const fs = require('fs');
let c = fs.readFileSync('d:/Downloads/BAO GIA/app/app.js', 'utf8');
let lines = c.split('\n');
console.log('Total lines:', lines.length);

// Line 452 (1-indexed) = index 451: </div> closing VAT value div  
// Line 453 (1-indexed) = index 452: broken compare code starts
// Line 487 (1-indexed) = index 486: if (results.length === 0) - compare table rendering starts

// Verify our assumptions
console.log('Line 452:', lines[451].substring(0, 40).trim());
console.log('Line 453:', lines[452].substring(0, 60).trim());
console.log('Line 487:', lines[486].substring(0, 60).trim());

// Build the replacement: close renderResult properly + full compare() start
const insertBlock = `      <div class="detail-row total">
        <span class="label">💰 TỔNG CỘNG</span>
        <span class="value">\${Calculator.formatVND(data.total)}</span>
      </div>\`;

    html += \`<div style="margin-top:12px;padding:8px 12px;background:var(--bg-glass);border-radius:8px;font-size:12px;color:var(--text-muted);">
      💡 Cước phí cầu đường, bến bãi (nếu có) thanh toán theo phát sinh thực tế.
    </div>\`;

    // === SO SÁNH GIÁ THEO KG VS CBM ===
    if (data.cbmComparison) {
      const c = data.cbmComparison;
      html += \`<div style="margin-top:16px;padding:16px;background:linear-gradient(135deg,rgba(27,117,187,0.04),rgba(76,175,80,0.04));border:1px solid rgba(27,117,187,0.15);border-radius:10px;">
        <div style="font-size:14px;font-weight:700;color:var(--accent);margin-bottom:12px;">📊 So sánh giá: KG thực vs CBM quy đổi</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div style="padding:12px;background:white;border-radius:8px;border:2px solid \${c.cheaper === 'kg' ? 'var(--green)' : 'var(--border)'};text-align:center;">
            <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">Theo KG thực</div>
            <div style="font-size:13px;font-weight:600;color:var(--text-secondary);">\${c.actualKg} kg</div>
            <div style="font-size:20px;font-weight:800;color:\${c.cheaper === 'kg' ? 'var(--green)' : 'var(--text-primary)'};margin-top:4px;">\${Calculator.formatVND(c.totalByKg)}</div>
            \${c.cheaper === 'kg' ? '<div style="margin-top:6px;font-size:11px;font-weight:700;color:var(--green);">✅ RẺ HƠN</div>' : ''}
          </div>
          <div style="padding:12px;background:white;border-radius:8px;border:2px solid \${c.cheaper === 'cbm' ? 'var(--green)' : 'var(--border)'};text-align:center;">
            <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">Theo CBM quy đổi</div>
            <div style="font-size:13px;font-weight:600;color:var(--text-secondary);">\${c.cbm} CBM = \${c.cbmKg} kg</div>
            <div style="font-size:20px;font-weight:800;color:\${c.cheaper === 'cbm' ? 'var(--green)' : 'var(--text-primary)'};margin-top:4px;">\${Calculator.formatVND(c.totalByCbm)}</div>
            \${c.cheaper === 'cbm' ? '<div style="margin-top:6px;font-size:11px;font-weight:700;color:var(--green);">✅ RẺ HƠN</div>' : ''}
          </div>
        </div>
        <div style="margin-top:8px;font-size:12px;color:var(--text-muted);text-align:center;">
          Chênh lệch: <strong style="color:var(--accent);">\${Calculator.formatVND(Math.abs(c.totalByKg - c.totalByCbm))}</strong>
        </div>
      </div>\`;
    }

    if (data.oversized) {
      html += \`<div style="margin-top:12px;padding:8px 12px;background:rgba(245,158,11,0.08);border-radius:8px;font-size:13px;color:var(--warning);border:1px solid rgba(245,158,11,0.15);">
        ⚠️ Hàng quá khổ (cạnh > 1m hoặc > 150kg/kiện)
      </div>\`;
    }
    if (data.needsLifting) {
      html += \`<div style="margin-top:8px;padding:8px 12px;background:rgba(245,158,11,0.08);border-radius:8px;font-size:13px;color:var(--warning);border:1px solid rgba(245,158,11,0.15);">
        ⚠️ Hàng nguyên khối nặng (≥ 200kg/kiện) - Yêu cầu cộng thêm phí nâng hạ.
      </div>\`;
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

`.split('\n');

// Keep lines 0-451 (inclusive), skip 452-485 (broken), keep 486+ 
const before = lines.slice(0, 452); // 0 to 451 inclusive
const after = lines.slice(486);      // from index 486 onwards

const result = [...before, ...insertBlock.map(l => l + '\r'), ...after];
fs.writeFileSync('d:/Downloads/BAO GIA/app/app.js', result.join('\n'));
console.log('SUCCESS! Old lines:', lines.length, 'New lines:', result.length);
