// NPV Logistics - Calculation Engine
const Calculator = {

    // Quy đổi kg từ kích thước (D×R×C mét × 300)
    convertDimToKg(lengthM, widthM, heightM) {
        return lengthM * widthM * heightM * 300;
    },

    // Tính CBM
    calcCBM(lengthM, widthM, heightM) {
        return lengthM * widthM * heightM;
    },

    // Kiểm tra hàng quá khổ: cạnh dài nhất > 1m hoặc KL/kiện > 150kg
    isOversized(dimL, dimW, dimH, weightPerPiece) {
        if (dimL > 1 || dimW > 1 || dimH > 1) return true;
        if (weightPerPiece && weightPerPiece > 150) return true;
        return false;
    },

    // Quy đổi CBM -> Kg (hỗ trợ cả 2 cách gọi)
    // Cách 1: calcChargeableWeight(actualKg, cbm)
    // Cách 2: calcChargeableWeight(actualKg, L, W, H, stackable, oversized)
    calcChargeableWeight(actualKg, arg2, arg3, arg4, stackable, oversized) {
        let cbm;
        if (arg3 !== undefined && arg4 !== undefined) {
            // Gọi kiểu (actualKg, L, W, H, ...)
            cbm = arg2 * arg3 * arg4;
        } else {
            // Gọi kiểu (actualKg, cbm)
            cbm = arg2;
        }
        const convertedKg = cbm * 300;
        return Math.max(actualKg, convertedKg);
    },

    // Tìm nấc giá theo trọng lượng cho G1/G2/G3
    findPriceTier(weight, tiers) {
        // Parse tier strings to ranges
        for (let i = 0; i < tiers.length; i++) {
            const tier = tiers[i];
            if (tier.startsWith("<=")) {
                const max = parseFloat(tier.substring(2));
                if (weight <= max) return i;
            } else if (tier.startsWith(">")) {
                return i;
            } else {
                const parts = tier.split("-");
                const min = parseFloat(parts[0]);
                const max = parseFloat(parts[1]);
                if (weight > min && weight <= max) return i;
            }
        }
        return tiers.length - 1;
    },

    // Tìm nấc km cho G4
    findKmTier(km, tiers) {
        return this.findPriceTier(km, tiers);
    },

    // Tính cước lũy tiến G1/G2/G3
    calcRoutePrice(region, packageType, provinceName, chargeableWeight) {
        const pkg = PRICING_DATA[packageType][region];
        if (!pkg) return null;

        const today = new Date().toISOString().split('T')[0];
        const route = pkg.routes.find(r => {
            if (r.province !== provinceName) return false;
            if (r.effectiveDate && r.effectiveDate > today) return false; // Chưa tới ngày hiệu lực
            if (r.status === 'inactive') {
                if (!r.endDate) return false; // Bị xóa hẳn
                if (r.endDate <= today) return false; // Đã hết hạn
            }
            return true;
        });
        if (!route) return null;

        // Tính cước lũy tiến
        let totalCost = route.min; // Dưới hoặc bằng 500kg thì luôn tính Phí Min
        let remainingWeight = chargeableWeight - 500;
        let lastTierIdx = 0;

        if (remainingWeight > 0) {
            for (let i = 0; i < pkg.weightTiers.length; i++) {
                const tier = pkg.weightTiers[i];
                let rangeSize = Infinity;
                
                if (tier.startsWith(">")) {
                    rangeSize = Infinity;
                } else {
                    const parts = tier.split("-");
                    const min = parseFloat(parts[0]);
                    const max = parseFloat(parts[1]);
                    rangeSize = max - min;
                }

                const price = route.prices[i];
                const activeKg = Math.min(remainingWeight, rangeSize);
                
                totalCost += activeKg * price;
                remainingWeight -= activeKg;
                lastTierIdx = i;

                if (remainingWeight <= 0) break;
            }
        }

        return {
            route,
            tierIdx: lastTierIdx,
            pricePerKg: route.prices[lastTierIdx] || 0,
            baseCost: totalCost,
            min: route.min,
            deliveryTime: route.deliveryTime || `${route.day} - ${route.time}`,
            weightTier: pkg.weightTiers[lastTierIdx] || '>5000'
        };
    },

    // Tính cước G4 (bao xe)
    calcVehiclePrice(region, vehicleId, distanceKm, totalOccupiedHours, drivingHours, extraPoints, hasReturn) {
        const pkg = PRICING_DATA.g4[region];
        if (!pkg) return null;

        const today = new Date().toISOString().split('T')[0];
        const vehicle = pkg.vehicles.find(v => {
            if (v.id !== vehicleId) return false;
            if (v.effectiveDate && v.effectiveDate > today) return false;
            if (v.status === 'inactive') {
                if (!v.endDate) return false;
                if (v.endDate <= today) return false;
            }
            return true;
        });
        if (!vehicle) return null;

        // Tính giá base (đến 10km)
        let totalCost = vehicle.basePrice;

        // Cộng thêm giá theo km
        let remainingKm = distanceKm;
        const kmRanges = [
            { max: 10, idx: 0 },
            { max: 100, idx: 1 },
            { max: 300, idx: 2 },
            { max: 500, idx: 3 },
            { max: 1000, idx: 4 },
            { max: Infinity, idx: 5 }
        ];

        let prevMax = 0;
        for (const range of kmRanges) {
            if (distanceKm <= prevMax) break;
            if (range.idx === 0) { prevMax = range.max; continue; } // base price covers first 10km

            const kmsInRange = Math.min(distanceKm, range.max) - Math.max(prevMax, 0);
            if (kmsInRange > 0 && distanceKm > prevMax) {
                const actualKms = Math.min(kmsInRange, distanceKm - prevMax);
                totalCost += actualKms * vehicle.kmPrices[range.idx];
            }
            prevMax = range.max;
        }

        // Phí chờ: Thời gian tính phí chờ = Tổng thời gian - Chỉ tiêu giao nhận - Thời gian di chuyển
        const loadTimeHrs = parseInt(vehicle.loadTime) / 60; // VD: "60 phút" -> 1 giờ
        const waitHours = Math.max(0, totalOccupiedHours - drivingHours - loadTimeHrs);
        const waitFee = waitHours * vehicle.waitFee;

        // Điểm giao thêm
        const extraPointFee = Math.max(0, extraPoints) * vehicle.extraPoint;

        // Chiều về có hàng = 70%
        let returnFee = 0;
        if (hasReturn) {
            returnFee = totalCost * 0.7;
        }

        return {
            vehicle,
            baseCost: totalCost,
            waitHours,
            loadTimeHrs,
            waitFee,
            extraPointFee,
            returnFee,
            totalBeforeTax: totalCost + waitFee + extraPointFee + returnFee
        };
    },

    // Tính phụ phí
    calcSurcharges(baseCost, options) {
        const surcharges = [];
        let totalSurcharge = 0;

        // Phụ phí hàng quá khổ
        if (options.isOversized && options.oversizePercent) {
            const fee = baseCost * (options.oversizePercent / 100);
            surcharges.push({ name: "Phụ phí hàng quá khổ", percent: options.oversizePercent, amount: fee });
            totalSurcharge += fee;
        }

        // Phụ phí hóa chất / chất lỏng
        if (options.isChemical && options.chemicalPercent) {
            const fee = baseCost * (options.chemicalPercent / 100);
            surcharges.push({ name: "Phụ phí hóa chất/chất lỏng", percent: options.chemicalPercent, amount: fee });
            totalSurcharge += fee;
        }

        // Tự động Phụ phí ngoại thành/huyện xa
        if (options.isSuburban) {
            const fee = baseCost * PRICING_DATA.surcharges.suburbanExtraPercent;
            surcharges.push({ name: "Phụ phí vùng thu trả tận nơi khác tuyến", percent: 30, amount: fee });
            totalSurcharge += fee;
        }

        // Tự động Phí Lấy hàng tận nơi
        if (options.pickupFee && options.pickupFee > 0) {
            surcharges.push({ name: options.pickupInfo ? `Phí lấy hàng tận nơi (${options.pickupInfo})` : "Phí lấy hàng tận nơi", amount: options.pickupFee });
            totalSurcharge += options.pickupFee;
        }

        // Tự động Phí giao hàng tận nơi
        if (options.deliveryFee && options.deliveryFee > 0) {
            surcharges.push({ name: options.deliveryInfo ? `Phí phụ xe nâng hạ / giao hàng tận nơi (${options.deliveryInfo})` : "Phí phụ xe nâng hạ / giao hàng tận nơi", amount: options.deliveryFee });
            totalSurcharge += options.deliveryFee;
        }

        // Phí đóng kiện gỗ (nhập thủ công bằng CBM gỗ)
        if (options.woodenCrate && options.cbm) {
            const fee = this.calcWoodenCrateFee(options.cbm);
            if (fee) {
                surcharges.push({ name: "Phí đóng kiện gỗ", amount: fee });
                totalSurcharge += fee;
            }
        }

        // Phí kiểm đếm
        if (options.countingQty && options.countingQty > 0) {
            const fee = this.calcCountingFee(options.countingQty);
            surcharges.push({ name: `Phí kiểm đếm (${options.countingQty} SP)`, amount: fee });
            totalSurcharge += fee;
        }

        // Phí thu hộ (COD)
        if (options.codAmount && options.codAmount > 0) {
            const fee = this.calcCODFee(options.codAmount);
            surcharges.push({ name: "Phí thu hộ (COD)", amount: fee });
            totalSurcharge += fee;
        }

        // Bảo hiểm
        if (options.insuranceValue && options.insuranceValue > 0) {
            const fee = options.insuranceValue * PRICING_DATA.specialFees.insurance.rate;
            surcharges.push({ name: "Bảo hiểm hàng hóa (0.08%)", amount: fee });
            totalSurcharge += fee;
        }

        return { surcharges, totalSurcharge };
    },

    // Tính phí đóng kiện gỗ
    calcWoodenCrateFee(cbm) {
        const tiers = PRICING_DATA.specialFees.woodenCrate.tiers;
        for (const tier of tiers) {
            const parts = tier.cbm.replace("<=", "0-").split("-");
            const max = parseFloat(parts[parts.length - 1]);
            if (cbm <= max) return tier.fee;
        }
        return null; // Liên hệ NPV
    },

    // Tính phí kiểm đếm
    calcCountingFee(qty) {
        const c = PRICING_DATA.specialFees.counting;
        if (qty <= c.baseQty) return c.baseFee;
        return c.baseFee + (qty - c.baseQty) * c.extraPerItem;
    },

    // Tính phí thu hộ COD
    calcCODFee(amount) {
        const tiers = PRICING_DATA.specialFees.cod.tiers;
        if (amount <= 300000) return 25000;
        if (amount <= 600000) return 35000;
        if (amount <= 1000000) return 40000;
        // Trên 1 triệu, tính theo mức
        let fee = 40000;
        let remaining = amount - 1000000;
        if (remaining > 0) {
            const chunk1 = Math.min(remaining, 4000000);
            fee += Math.ceil(chunk1 / 1000000) * 20000;
            remaining -= chunk1;
        }
        if (remaining > 0) {
            const chunk2 = Math.min(remaining, 5000000);
            fee += Math.ceil(chunk2 / 1000000) * 15000;
            remaining -= chunk2;
        }
        if (remaining > 0) {
            fee += Math.ceil(remaining / 1000000) * 10000;
        }
        return fee;
    },

    // Tính tổng cước cuối cùng
    calcFinal(subtotal) {
        const fuel = subtotal * PRICING_DATA.surcharges.fuel;
        const beforeVat = subtotal + fuel;
        const vat = beforeVat * PRICING_DATA.surcharges.vat;
        return {
            subtotal,
            fuel,
            beforeVat,
            vat,
            total: beforeVat + vat
        };
    },

    // So sánh giá giữa 3 gói G1/G2/G3
    comparePackages(region, provinceCode, chargeableWeight, options) {
        const packages = ['g1', 'g2', 'g3'];
        const results = [];

        for (const pkg of packages) {
            const result = this.calcRoutePrice(region, pkg, provinceCode, chargeableWeight);
            if (!result) continue;

            const pkgData = PRICING_DATA[pkg][region];
            const surchargeResult = this.calcSurcharges(result.baseCost, {
                ...options,
                oversizePercent: pkgData.notes.oversizePercent,
                chemicalPercent: pkgData.notes.chemicalPercent
            });

            const subtotal = result.baseCost + surchargeResult.totalSurcharge;
            const final = this.calcFinal(subtotal);

            results.push({
                package: pkg,
                packageName: pkg === 'g1' ? 'Đúng Giờ' : pkg === 'g2' ? 'Đảm Bảo' : 'Tiết Kiệm',
                ...result,
                ...surchargeResult,
                ...final
            });
        }

        return results.sort((a, b) => a.total - b.total);
    },

    // Format tiền VND
    formatVND(amount) {
        return new Intl.NumberFormat('vi-VN').format(Math.round(amount)) + ' đ';
    }
};
