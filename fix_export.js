const fs = require('fs');
let c = fs.readFileSync('d:/Downloads/BAO GIA/app/index.html', 'utf8');

// Find and replace the export section
const oldSection = `            <div class="checkbox-row" style="margin-bottom: 12px;">
              <label class="checkbox-label"><input type="checkbox" id="expIncludeDelivery" checked> Gồm phí giao hàng (+310.000đ/chuyến)</label>
              <label class="checkbox-label"><input type="checkbox" id="expCBM" checked> Lời thoại tính cước CBM (550.000đ/cbm)</label>
              <label class="checkbox-label"><input type="checkbox" id="expNoneVat" checked> Ghi chú cước chưa VAT &amp; bốc xếp 2 đầu</label>
            </div>`;

const newSection = `            <div class="section-title" style="margin-top:0;">Chọn phụ phí hiển thị trong báo giá</div>
            <div class="checkbox-row" style="margin-bottom: 12px; flex-wrap:wrap;">
              <label class="checkbox-label"><input type="checkbox" id="expNoVat" checked> Cước chưa VAT & bốc xếp</label>
              <label class="checkbox-label"><input type="checkbox" id="expCBMPrice" checked> Đơn giá CBM (550k/cbm)</label>
              <label class="checkbox-label"><input type="checkbox" id="expDeliveryFee" checked> Giao tận nơi (310k/chuyến)</label>
              <label class="checkbox-label"><input type="checkbox" id="expOversized"> Hàng quá khổ (+15-30%)</label>
              <label class="checkbox-label"><input type="checkbox" id="expChemical"> Hóa chất (+20-30%)</label>
              <label class="checkbox-label"><input type="checkbox" id="expInsurance"> Bảo hiểm (0.08%)</label>
              <label class="checkbox-label"><input type="checkbox" id="expWoodenCrate"> Đóng kiện gỗ (1.2M/cbm)</label>
              <label class="checkbox-label"><input type="checkbox" id="expCounting"> Kiểm đếm (2k/SP)</label>
              <label class="checkbox-label"><input type="checkbox" id="expCOD"> Thu hộ COD (1%)</label>
            </div>`;

if (c.includes('expIncludeDelivery')) {
  c = c.replace(oldSection, newSection);
  fs.writeFileSync('d:/Downloads/BAO GIA/app/index.html', c);
  console.log('SUCCESS: Updated export section');
} else {
  console.log('ERROR: Could not find old section. Trying line-based approach...');
  const lines = c.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('expIncludeDelivery')) {
      console.log('Found at line', i + 1, ':', lines[i].substring(0, 80));
    }
  }
}
