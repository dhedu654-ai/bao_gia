// NPV Logistics - App UI Logic
const VIETNAM_PROVINCES = [
  "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu", "Bắc Ninh", "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước", "Bình Thuận", "Cà Mau", "Cần Thơ", "Cao Bằng", "Đà Nẵng", "Đắk Lắk", "Đắk Nông", "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Giang", "Hà Nam", "Hà Nội", "Hà Tĩnh", "Hải Dương", "Hải Phòng", "Hậu Giang", "Hòa Bình", "Hưng Yên", "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu", "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Long An", "Nam Định", "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên", "Quảng Bình", "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên", "Thanh Hóa", "Thừa Thiên Huế", "Tiền Giang", "Trà Vinh", "Tuyên Quang", "Vĩnh Long", "Vĩnh Phúc", "Yên Bái", "Hồ Chí Minh"
];

const App = {
  init() {
    const provinceSelect = document.getElementById('province');
    provinceSelect.innerHTML = '<option value="">-- Chọn tỉnh/TP --</option>';
    VIETNAM_PROVINCES.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p;
      opt.textContent = p;
      provinceSelect.appendChild(opt);
    });

    document.getElementById('region').addEventListener('change', () => this.checkRouteAvailability());
    document.getElementById('province').addEventListener('change', () => this.checkRouteAvailability());
    document.getElementById('packageType').addEventListener('change', () => this.onPackageChange());
  },

  checkRouteAvailability() {
    const region = document.getElementById('region').value;
    const province = document.getElementById('province').value;
    const warningBox = document.getElementById('routeWarningBox');

    if (!region || !province) {
      warningBox.style.display = 'none';
      return;
    }

    let route = null;
    if (PRICING_DATA.g1[region]) {
      route = PRICING_DATA.g1[region].routes.find(r => r.province === province);
    }

    warningBox.style.display = 'block';
    if (!route) {
      warningBox.style.background = 'rgba(239, 68, 68, 0.1)';
      warningBox.style.border = '1px solid rgba(239, 68, 68, 0.3)';
      warningBox.style.color = '#b91c1c';
      warningBox.innerHTML = `⚠️ <b>KHÔNG CÓ TUYẾN:</b> Tỉnh <strong>${province}</strong> không có trong bảng giá cố định.<br>Vui lòng đo khoảng cách thực tế và chọn gói <strong>G4 - Bao Xe</strong>.`;
    } else {
      warningBox.style.background = 'rgba(2, 132, 199, 0.1)';
      warningBox.style.border = '1px solid rgba(2, 132, 199, 0.3)';
      warningBox.style.color = '#0369a1';
      warningBox.innerHTML = `📍 <b>THÔNG TIN:</b> Cước cơ bản áp dụng cho khu vực trung tâm (<strong>${route.area}</strong>).<br>Nếu địa chỉ giao hàng không thuộc trung tâm này, hãy chọn mục Cấp khu vực là <strong>"Vùng xa / Ngoại thành"</strong>.`;
    }
  },

  onPackageChange() {
    const pkg = document.getElementById('packageType').value;
    const cargoSection = document.getElementById('cargoSection');
    const vehicleSection = document.getElementById('vehicleSection');
    const btnCompare = document.getElementById('btnCompare');

    if (pkg === 'g4') {
      cargoSection.style.display = 'none';
      vehicleSection.classList.add('show');
      btnCompare.style.display = 'none';
    } else {
      cargoSection.style.display = 'block';
      vehicleSection.classList.remove('show');
      btnCompare.style.display = 'inline-flex';
    }
  },

  getFormData() {
    return {
      productName: document.getElementById('productName').value.trim(),
      region: document.getElementById('region').value,
      province: document.getElementById('province').value,
      district: document.getElementById('district').value.trim(),
      packageType: document.getElementById('packageType').value,
      areaType: document.getElementById('areaType').value,
      weight: parseFloat(document.getElementById('weight').value) || 0,
      pieces: parseInt(document.getElementById('pieces').value) || 1,
      cbm: parseFloat(document.getElementById('cbm').value) || 0,
      goodsValue: parseFloat(document.getElementById('goodsValue').value) || 0,
      isOversized: document.getElementById('isOversized').checked,
      isChemical: document.getElementById('isChemical').checked,
      isNonStackable: document.getElementById('isNonStackable').checked,
      wantInsurance: document.getElementById('wantInsurance').checked,
      wantDelivery: document.getElementById('wantDelivery').checked,
      vehicleType: parseInt(document.getElementById('vehicleType').value),
      distance: parseFloat(document.getElementById('distance').value) || 0,
      totalOccupiedHours: parseFloat(document.getElementById('totalOccupiedHours').value) || 0,
      drivingHours: parseFloat(document.getElementById('drivingHours').value) || 0,
      extraPoints: parseInt(document.getElementById('extraPoints').value) || 0,
      hasReturn: document.getElementById('hasReturn').checked,
      woodenCrateCBM: parseFloat(document.getElementById('woodenCrateCBM').value) || 0,
      countingQty: parseInt(document.getElementById('countingQty').value) || 0,
      codAmount: parseFloat(document.getElementById('codAmount').value) || 0
    };
  },

  validate(f) {
    if (!f.region) return 'Vui lòng chọn điểm nhận hàng';
    if (!f.packageType) return 'Vui lòng chọn gói cước';
    if (f.packageType !== 'g4') {
      if (!f.province) return 'Vui lòng chọn tỉnh/TP trả hàng';
      let hasRoute = false;
      if (PRICING_DATA.g1[f.region]) {
        const r = PRICING_DATA.g1[f.region].routes.find(route => route.province === f.province);
        if (r) hasRoute = true;
      }
      if (!hasRoute) return `Tỉnh/TP ${f.province} không có trong bảng giá tuyến cố định. Vui lòng chuyển sang gói Bao Xe (G4)!`;
      if (!f.weight || f.weight <= 0) return 'Vui lòng nhập trọng lượng';
    } else {
      if (!f.distance || f.distance <= 0) return 'Vui lòng nhập khoảng cách (km)';
    }
    return null;
  },

  calculate() {
    const f = this.getFormData();
    const err = this.validate(f);
    if (err) { alert(err); return; }

    if (f.packageType === 'g4') {
      this.calculateG4(f);
    } else {
      this.calculateRoute(f);
    }
  },

  calculateRoute(f) {
    // Tính kg tính cước
    const weightPerPiece = f.weight / f.pieces;
    const oversized = f.isOversized;
    const needsLifting = weightPerPiece >= 200;
    let chargeableWeight = f.weight;
    const cbmConvertedKg = f.cbm > 0 ? f.cbm * 300 : 0;

    // Nếu có CBM, quy đổi kg = CBM × 300, lấy max(thực, quy đổi)
    if (f.cbm > 0) {
      chargeableWeight = Calculator.calcChargeableWeight(f.weight, f.cbm);
    }

    // Tính giá cơ bản
    const result = Calculator.calcRoutePrice(f.region, f.packageType, f.province, chargeableWeight);
    if (!result) { alert('Không tìm thấy tuyến đường này'); return; }

    // Lấy notes phụ phí
    const pkgData = PRICING_DATA[f.packageType][f.region];

    // Delivery fee
    let deliveryFee = 0;
    if (f.wantDelivery) {
      const da = PRICING_DATA.deliveryFee.areas.find(a => {
        if (['Hồ Chí Minh', 'Bình Dương', 'Đồng Nai'].includes(f.province)) return a.code === 'HCM';
        if (f.province === 'Đà Nẵng') return a.code === 'DNG';
        if (f.province === 'Hà Nội') return a.code === 'HNI';
        if (['Khánh Hòa', 'Thừa Thiên Huế', 'Bình Định'].includes(f.province)) return a.code === 'NTG_HUE_BDH';
        if (['Đắk Nông', 'Đắk Lắk', 'Gia Lai', 'Kon Tum'].includes(f.province)) return a.code === 'TAYNGUYEN';
        return false;
      });
      if (da) deliveryFee = da.fees.xe2t;
    }

    // Surcharge options dùng chung
    const surchargeOpts = {
      isOversized: oversized,
      oversizePercent: pkgData.notes.oversizePercent,
      isChemical: f.isChemical,
      chemicalPercent: pkgData.notes.chemicalPercent,
      isSuburban: f.areaType === 'suburb',
      deliveryFee,
      woodenCrate: f.woodenCrateCBM > 0,
      cbm: f.woodenCrateCBM,
      countingQty: f.countingQty,
      codAmount: f.codAmount,
      insuranceValue: f.wantInsurance ? f.goodsValue : 0
    };

    // Tính phụ phí
    const surchargeResult = Calculator.calcSurcharges(result.baseCost, surchargeOpts);

    const subtotal = result.baseCost + surchargeResult.totalSurcharge;
    const final = Calculator.calcFinal(subtotal);

    // === SO SÁNH GIÁ THEO KG THỰC VS CBM ===
    let cbmComparison = null;
    if (f.cbm > 0 && f.weight > 0) {
      // Giá theo KG thực
      const resultByKg = Calculator.calcRoutePrice(f.region, f.packageType, f.province, f.weight);
      let totalByKg = null;
      if (resultByKg) {
        const surByKg = Calculator.calcSurcharges(resultByKg.baseCost, surchargeOpts);
        const subByKg = resultByKg.baseCost + surByKg.totalSurcharge;
        totalByKg = Calculator.calcFinal(subByKg);
      }

      // Giá theo CBM quy đổi
      const resultByCbm = Calculator.calcRoutePrice(f.region, f.packageType, f.province, cbmConvertedKg);
      let totalByCbm = null;
      if (resultByCbm) {
        const surByCbm = Calculator.calcSurcharges(resultByCbm.baseCost, surchargeOpts);
        const subByCbm = resultByCbm.baseCost + surByCbm.totalSurcharge;
        totalByCbm = Calculator.calcFinal(subByCbm);
      }

      if (totalByKg && totalByCbm) {
        cbmComparison = {
          actualKg: f.weight,
          cbmKg: Math.round(cbmConvertedKg * 100) / 100,
          cbm: f.cbm,
          totalByKg: totalByKg.total,
          totalByCbm: totalByCbm.total,
          cheaper: totalByKg.total <= totalByCbm.total ? 'kg' : 'cbm'
        };
      }
    }

    // Tính thời gian giao
    let deliveryTime = result.deliveryTime;
    if (f.areaType === 'suburb') deliveryTime += ' (+24-48h huyện xa)';
    if (f.wantDelivery) deliveryTime += ' (+12-24h giao tận nơi)';

    // Render
    this.renderResult({
      productName: f.productName,
      packageName: this.getPackageName(f.packageType),
      region: PRICING_DATA.regions[f.region].name,
      province: result.route.province,
      district: f.district,
      area: result.route.area,
      actualWeight: f.weight,
      chargeableWeight: Math.round(chargeableWeight * 100) / 100,
      isConverted: chargeableWeight > f.weight,
      oversized,
      needsLifting,
      pricePerKg: result.pricePerKg,
      weightTier: result.weightTier,
      baseCost: result.baseCost,
      surcharges: surchargeResult.surcharges,
      totalSurcharge: surchargeResult.totalSurcharge,
      ...final,
      deliveryTime,
      cbmComparison
    });
  },

  calculateG4(f) {
    const result = Calculator.calcVehiclePrice(
      f.region, f.vehicleType, f.distance, f.totalOccupiedHours, f.drivingHours, f.extraPoints, f.hasReturn
    );
    if (!result) { alert('Không tìm thấy thông tin xe'); return; }

    // Phụ phí đặc biệt
    let extraFees = 0;
    const surcharges = [];
    if (f.woodenCrateCBM > 0) {
      const fee = Calculator.calcWoodenCrateFee(f.woodenCrateCBM);
      if (fee) { surcharges.push({ name: "Đóng kiện gỗ", amount: fee }); extraFees += fee; }
    }
    if (f.countingQty > 0) {
      const fee = Calculator.calcCountingFee(f.countingQty);
      surcharges.push({ name: `Kiểm đếm (${f.countingQty} SP)`, amount: fee }); extraFees += fee;
    }
    if (f.codAmount > 0) {
      const fee = Calculator.calcCODFee(f.codAmount);
      surcharges.push({ name: "Thu hộ COD", amount: fee }); extraFees += fee;
    }

    const subtotal = result.totalBeforeTax + extraFees;
    const final = Calculator.calcFinal(subtotal);

    this.renderG4Result({
      productName: f.productName,
      region: PRICING_DATA.regions[f.region].name,
      vehicle: result.vehicle,
      distance: f.distance,
      baseCost: result.baseCost,
      waitFee: result.waitFee,
      waitHours: result.waitHours,
      totalOccupiedHours: f.totalOccupiedHours,
      drivingHours: f.drivingHours,
      loadTimeHrs: result.loadTimeHrs,
      extraPointFee: result.extraPointFee,
      extraPoints: f.extraPoints,
      returnFee: result.returnFee,
      surcharges,
      ...final
    });
  },

  renderG4Result(data) {
    const container = document.getElementById('resultContent');
    let html = `
      <div class="price-main">
        <div class="label">TỔNG CƯỚC BAO XE (đã bao gồm VAT + Phụ phí xăng dầu)</div>
        <div class="amount">${Calculator.formatVND(data.total)}</div>
        <div class="sub">${data.productName ? data.productName + ' | ' : ''}${data.vehicle.name} | ${data.distance}km</div>
      </div>

      <div class="delivery-info">
        <div class="delivery-item">
          <div class="icon">🚛</div>
          <div class="label">Loại xe</div>
          <div class="value">${data.vehicle.name} (${data.vehicle.size})</div>
        </div>
        <div class="delivery-item">
          <div class="icon">📏</div>
          <div class="label">Khoảng cách</div>
          <div class="value">${data.distance} km</div>
        </div>
        <div class="delivery-item">
          <div class="icon">⏱️</div>
          <div class="label">Thời gian giao nhận</div>
          <div class="value">${data.vehicle.loadTime}</div>
        </div>
      </div>

      <div class="divider"></div>
      <div class="section-title">Chi tiết cước phí</div>
      
      <div class="detail-row">
        <span class="label">Cước vận chuyển</span>
        <span class="value">${Calculator.formatVND(data.baseCost)}</span>
      </div>`;

    if (data.waitFee > 0 || data.totalOccupiedHours > 0) {
      html += `<div class="detail-row">
        <span class="label">Phí chờ (Tổng ${data.totalOccupiedHours}h - Chạy ${data.drivingHours}h - Bốc xếp ${data.loadTimeHrs}h = <strong style="color:var(--danger)">Dư ${Number(data.waitHours.toFixed(2))}h chờ</strong>)</span>
        <span class="value">${data.waitFee > 0 ? '+' : ''}${Calculator.formatVND(data.waitFee)}</span>
      </div>`;
    }
    if (data.extraPointFee > 0) {
      html += `<div class="detail-row">
        <span class="label">Điểm giao thêm (${data.extraPoints} điểm)</span>
        <span class="value">+${Calculator.formatVND(data.extraPointFee)}</span>
      </div>`;
    }
    if (data.returnFee > 0) {
      html += `<div class="detail-row">
        <span class="label">Chiều về có hàng (70%)</span>
        <span class="value">+${Calculator.formatVND(data.returnFee)}</span>
      </div>`;
    }

    if (data.surcharges.length > 0) {
      html += `<div class="divider"></div><div class="section-title">Phụ phí</div><div class="surcharge-list">`;
      for (const s of data.surcharges) {
        html += `<div class="surcharge-item">
          <span class="name">${s.name}</span>
          <span class="amount">+${Calculator.formatVND(s.amount)}</span>
        </div>`;
      }
      html += `</div>`;
    }

    html += `
      <div class="divider"></div>
      <div class="detail-row">
        <span class="label">Tạm tính</span>
        <span class="value">${Calculator.formatVND(data.subtotal)}</span>
      </div>
      <div class="detail-row">
        <span class="label">Phụ phí xăng dầu (23%)</span>
        <span class="value">+${Calculator.formatVND(data.fuel)}</span>
      </div>
      <div class="detail-row">
        <span class="label">VAT (10%)</span>
        <span class="value">+${Calculator.formatVND(data.vat)}</span>
      </div>
      <div class="detail-row total">
        <span class="label">💰 TỔNG CỘNG</span>
        <span class="value">${Calculator.formatVND(data.total)}</span>
      </div>`;

    html += `<div style="margin-top:12px;padding:8px 12px;background:var(--bg-glass);border-radius:8px;font-size:12px;color:var(--text-muted);">
      💡 Cước phí cầu đường, bến bãi (nếu có) thanh toán theo phát sinh thực tế.
    </div>`;

    if (data.oversized) {
      html += `<div style="margin-top:12px;padding:8px 12px;background:rgba(245,158,11,0.1);border-radius:8px;font-size:12px;color:var(--warning);">
        ⚠️ Hàng quá khổ (cạnh > 1m hoặc > 150kg/kiện)${data.isConverted ? ' - KL quy đổi cao hơn KL thực' : ''}
      </div>`;
    }
    if (data.needsLifting) {
      html += `<div style="margin-top:12px;padding:8px 12px;background:rgba(245,158,11,0.1);border-radius:8px;font-size:12px;color:var(--warning);">
        ⚠️ Hàng nguyên khối nặng (≥ 200kg/kiện) - Yêu cầu cộng thêm phí nâng hạ theo thỏa thuận.
      </div>`;
    }

    container.innerHTML = html;
    document.getElementById('resultEmpty').style.display = 'none';
    document.getElementById('resultSummary').classList.add('show');
  },

  renderResult(data) {
    const container = document.getElementById('resultContent');

    let html = `
      <div class="price-main">
        <div class="label">TỔNG CƯỚC (đã bao gồm VAT + Phụ phí xăng dầu)</div>
        <div class="amount">${Calculator.formatVND(data.total)}</div>
        <div class="sub">${data.productName ? data.productName + ' | ' : ''}${data.packageName}</div>
      </div>

      <div class="delivery-info">
        <div class="delivery-item">
          <div class="icon">📍</div>
          <div class="label">Tuyến đường</div>
          <div class="value">${data.region.split(' - ')[0]} → ${data.district ? data.district + ', ' : ''}${data.province}</div>
        </div>
        <div class="delivery-item">
          <div class="icon">⏱️</div>
          <div class="label">Thời gian giao</div>
          <div class="value">${data.deliveryTime}</div>
        </div>
        <div class="delivery-item">
          <div class="icon">⚖️</div>
          <div class="label">KL tính cước</div>
          <div class="value">${data.chargeableWeight} kg${data.isConverted ? ' (QĐ)' : ''}</div>
        </div>
      </div>

      <div class="divider"></div>
      <div class="section-title">Chi tiết cước phí</div>
      
      <div class="detail-row">
        <span class="label">Cước cơ bản (Nấc ${data.weightTier})</span>
        <span class="value">${Calculator.formatVND(data.baseCost)}</span>
      </div>`;

    if (data.surcharges.length > 0) {
      html += `<div class="divider"></div><div class="section-title">Phụ phí</div><div class="surcharge-list">`;
      for (const s of data.surcharges) {
        html += `<div class="surcharge-item">
          <span class="name">${s.name}${s.percent ? ` (+${s.percent}%)` : ''}</span>
          <span class="amount">+${Calculator.formatVND(s.amount)}</span>
        </div>`;
      }
      html += `</div>`;
    }

    html += `
      <div class="divider"></div>
      <div class="detail-row">
        <span class="label">Tạm tính</span>
        <span class="value">${Calculator.formatVND(data.subtotal)}</span>
      </div>
      <div class="detail-row">
        <span class="label">Phụ phí xăng dầu (23%)</span>
        <span class="value">+${Calculator.formatVND(data.fuel)}</span>
      </div>
      <div class="detail-row">
        <span class="label">VAT (10%)</span>
        <span class="value">+${Calculator.formatVND(data.vat)}</span>
      </div>
      <div class="detail-row total">
        <span class="label">💰 TỔNG CỘNG</span>
        <span class="value">${Calculator.formatVND(data.total)}</span>
      </div>`;

    html += `<div style="margin-top:12px;padding:8px 12px;background:var(--bg-glass);border-radius:8px;font-size:12px;color:var(--text-muted);">
      💡 Cước phí cầu đường, bến bãi (nếu có) thanh toán theo phát sinh thực tế.
    </div>`;

    // === SO SÁNH GIÁ THEO KG VS CBM ===
    if (data.cbmComparison) {
      const c = data.cbmComparison;
      html += `<div style="margin-top:16px;padding:16px;background:linear-gradient(135deg,rgba(27,117,187,0.04),rgba(76,175,80,0.04));border:1px solid rgba(27,117,187,0.15);border-radius:10px;">
        <div style="font-size:14px;font-weight:700;color:var(--accent);margin-bottom:12px;">📊 So sánh giá: KG thực vs CBM quy đổi</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div style="padding:12px;background:white;border-radius:8px;border:2px solid ${c.cheaper === 'kg' ? 'var(--green)' : 'var(--border)'};text-align:center;">
            <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">Theo KG thực</div>
            <div style="font-size:13px;font-weight:600;color:var(--text-secondary);">${c.actualKg} kg</div>
            <div style="font-size:20px;font-weight:800;color:${c.cheaper === 'kg' ? 'var(--green)' : 'var(--text-primary)'};margin-top:4px;">${Calculator.formatVND(c.totalByKg)}</div>
            ${c.cheaper === 'kg' ? '<div style="margin-top:6px;font-size:11px;font-weight:700;color:var(--green);">✅ RẺ HƠN</div>' : ''}
          </div>
          <div style="padding:12px;background:white;border-radius:8px;border:2px solid ${c.cheaper === 'cbm' ? 'var(--green)' : 'var(--border)'};text-align:center;">
            <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">Theo CBM quy đổi</div>
            <div style="font-size:13px;font-weight:600;color:var(--text-secondary);">${c.cbm} CBM = ${c.cbmKg} kg</div>
            <div style="font-size:20px;font-weight:800;color:${c.cheaper === 'cbm' ? 'var(--green)' : 'var(--text-primary)'};margin-top:4px;">${Calculator.formatVND(c.totalByCbm)}</div>
            ${c.cheaper === 'cbm' ? '<div style="margin-top:6px;font-size:11px;font-weight:700;color:var(--green);">✅ RẺ HƠN</div>' : ''}
          </div>
        </div>
        <div style="margin-top:8px;font-size:12px;color:var(--text-muted);text-align:center;">
          Chênh lệch: <strong style="color:var(--accent);">${Calculator.formatVND(Math.abs(c.totalByKg - c.totalByCbm))}</strong>
        </div>
      </div>`;
    }

    if (data.oversized) {
      html += `<div style="margin-top:12px;padding:8px 12px;background:rgba(245,158,11,0.08);border-radius:8px;font-size:13px;color:var(--warning);border:1px solid rgba(245,158,11,0.15);">
        ⚠️ Hàng quá khổ (cạnh > 1m hoặc > 150kg/kiện)
      </div>`;
    }
    if (data.needsLifting) {
      html += `<div style="margin-top:8px;padding:8px 12px;background:rgba(245,158,11,0.08);border-radius:8px;font-size:13px;color:var(--warning);border:1px solid rgba(245,158,11,0.15);">
        ⚠️ Hàng nguyên khối nặng (≥ 200kg/kiện) - Yêu cầu cộng thêm phí nâng hạ.
      </div>`;
    }

    container.innerHTML = html;
    document.getElementById('resultEmpty').style.display = 'none';
    document.getElementById('resultSummary').classList.add('show');
  },

  compare() {
    const f = this.getFormData();
    if (!f.region) { alert('Vui lòng chọn điểm nhận hàng'); return; }
    if (!f.province) { alert('Vui lòng chọn tỉnh/TP trả hàng'); return; }
    if (!f.weight || f.weight <= 0) { alert('Vui lòng nhập trọng lượng'); return; }

    const oversized = f.isOversized;
    let chargeableWeight = f.weight;
    if (f.cbm > 0) {
      chargeableWeight = Calculator.calcChargeableWeight(f.weight, f.cbm);
    }

    let deliveryFee = 0;
    if (f.wantDelivery) {
      const da = PRICING_DATA.deliveryFee.areas.find(a => {
        if (['Hồ Chí Minh', 'Bình Dương', 'Đồng Nai'].includes(f.province)) return a.code === 'HCM';
        if (f.province === 'Đà Nẵng') return a.code === 'DNG';
        if (f.province === 'Hà Nội') return a.code === 'HNI';
        if (['Khánh Hòa', 'Thừa Thiên Huế', 'Bình Định'].includes(f.province)) return a.code === 'NTG_HUE_BDH';
        if (['Đắk Nông', 'Đắk Lắk', 'Gia Lai', 'Kon Tum'].includes(f.province)) return a.code === 'TAYNGUYEN';
        return false;
      });
      if (da) deliveryFee = da.fees.xe2t;
    }

    const results = Calculator.comparePackages(f.region, f.province, chargeableWeight, {
      isOversized: oversized,
      isChemical: f.isChemical,
      isSuburban: f.areaType === 'suburb',
      deliveryFee,
      woodenCrate: f.woodenCrateCBM > 0,
      cbm: f.woodenCrateCBM,
      countingQty: f.countingQty,
      codAmount: f.codAmount,
      insuranceValue: f.wantInsurance ? f.goodsValue : 0
    });


    if (results.length === 0) {
      alert('Không có dữ liệu cho tuyến đường này');
      return;
    }

    let html = `
      <p style="font-size:13px;color:var(--text-secondary);margin-bottom:12px;">
        KL tính cước: <strong>${Math.round(chargeableWeight)}kg</strong> | 
        Tuyến: <strong>${PRICING_DATA.regions[f.region].name} → ${results[0].route.province}</strong>
      </p>
      <table class="compare-table">
        <thead>
          <tr>
            <th>Gói cước</th>
            <th>Đơn giá/kg</th>
            <th>Thời gian</th>
            <th>Tổng cước</th>
            <th></th>
          </tr>
        </thead>
        <tbody>`;

    for (let i = 0; i < results.length; i++) {
      const r = results[i];
      const isBest = i === 0;
      html += `
        <tr>
          <td><strong>${r.packageName}</strong></td>
          <td>${Calculator.formatVND(r.pricePerKg)}</td>
          <td>${r.deliveryTime}</td>
          <td class="${isBest ? 'best' : ''}">${Calculator.formatVND(r.total)}</td>
          <td>${isBest ? '<span class="badge badge-best">💰 Rẻ nhất</span>' : ''}</td>
        </tr>`;
    }

    html += `</tbody></table>`;

    // Recommendation
    const cheapest = results[0];
    const fastest = results.reduce((a, b) => {
      const aTime = a.deliveryTime.match(/\d+/);
      const bTime = b.deliveryTime.match(/\d+/);
      return (aTime && bTime && parseInt(aTime[0]) < parseInt(bTime[0])) ? a : b;
    });

    html += `<div style="margin-top:16px;padding:12px 16px;background:var(--success-bg);border-radius:8px;border:1px solid rgba(34,197,94,0.2);">
      <div style="font-size:13px;font-weight:600;color:var(--success);margin-bottom:4px;">💡 Khuyến nghị</div>
      <div style="font-size:12px;color:var(--text-secondary);">
        Tiết kiệm nhất: <strong>${cheapest.packageName}</strong> - ${Calculator.formatVND(cheapest.total)}<br>
        Nhanh nhất: <strong>${fastest.packageName}</strong> - ${fastest.deliveryTime}
      </div>
    </div>`;

    document.getElementById('compareContent').innerHTML = html;
    document.getElementById('compareCard').style.display = 'block';
    document.getElementById('compareCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
  },

  reset() {
    document.querySelectorAll('.form-control').forEach(el => {
      if (el.tagName === 'SELECT') { el.selectedIndex = 0; }
      else if (el.type === 'checkbox') { el.checked = false; }
      else { el.value = ''; }
    });
    document.querySelectorAll('input[type="checkbox"]').forEach(el => el.checked = false);
    document.getElementById('pieces').value = '1';
    document.getElementById('totalOccupiedHours').value = '0';
    document.getElementById('drivingHours').value = '0';
    document.getElementById('extraPoints').value = '0';
    document.getElementById('district').value = '';
    document.getElementById('routeWarningBox').style.display = 'none';
    document.getElementById('resultEmpty').style.display = 'block';
    document.getElementById('resultSummary').classList.remove('show');
    document.getElementById('compareCard').style.display = 'none';
    document.getElementById('cargoSection').style.display = 'block';
    document.getElementById('vehicleSection').classList.remove('show');
    document.getElementById('btnCompare').style.display = 'inline-flex';
  },

  getPackageName(pkg) {
    const names = { g1: 'G1 - Đúng Giờ', g2: 'G2 - Đảm Bảo', g3: 'G3 - Tiết Kiệm', g4: 'G4 - Bao Xe' };
    return names[pkg] || pkg;
  }
};

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch valid data from Supabase
        const { data, error } = await supabase.from('configs').select('data').eq('id', 1).single();
        if (error) {
            console.warn("Chưa cấu hình Supabase Bảng chuẩn, tải từ file mẫu...", error.message);
            // Xảy ra khi chưa set table configs trên Supabase (hoặc RLS block)
        } else if (data && data.data) {
            console.log("Đã tải dữ liệu bảng giá mới nhất từ máy chủ!");
            PRICING_DATA = data.data; // Ghi đè dữ liệu mẫu
        }
    } catch (e) {
        console.error("Lỗi kết nối Supabase, fallback về dữ liệu mẫu offline...", e);
    }
    
    App.init();
});
