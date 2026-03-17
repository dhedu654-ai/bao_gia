const fs = require('fs');
let c = fs.readFileSync('d:/Downloads/BAO GIA/app/app.js', 'utf8');
let lines = c.split('\n');

// Find "getPackageName" line - we'll add exportWord before it
let getPackageIdx = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('getPackageName(pkg)')) {
    getPackageIdx = i;
    break;
  }
}
console.log('getPackageName at line:', getPackageIdx + 1);

const exportWordFunction = `  exportWord() {
    const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle, HeadingLevel } = docx;
    
    const f = this.getFormData();
    const customerName = document.getElementById('exportCustomerName').value || 'Quý Khách Hàng';
    const today = new Date();
    const dateStr = 'ngày ' + String(today.getDate()).padStart(2,'0') + ' tháng ' + String(today.getMonth()+1).padStart(2,'0') + ' năm ' + today.getFullYear();
    
    // Collect selected export options
    const expOpts = {
      includeDelivery: document.getElementById('expDeliveryFee').checked,
      includeCBM: document.getElementById('expCBMPrice').checked,
      includeNoVat: document.getElementById('expNoVat').checked,
      includeOversized: document.getElementById('expOversized').checked,
      includeChemical: document.getElementById('expChemical').checked,
      includeInsurance: document.getElementById('expInsurance').checked,
      includeWoodenCrate: document.getElementById('expWoodenCrate').checked,
      includeCounting: document.getElementById('expCounting').checked,
      includeCOD: document.getElementById('expCOD').checked,
    };

    // Build conditions list
    const conditions = [];
    conditions.push('- Phương thức vận chuyển: Vận chuyển bằng đường bộ.');
    conditions.push('- Điều kiện vận chuyển: giao nhận trên phương tiện vận tải.');
    
    if (expOpts.includeNoVat) {
      conditions.push('- Giá cước trên chưa bao gồm: VAT, và phí bốc xếp 2 đầu.');
    }
    if (expOpts.includeCBM) {
      conditions.push('- Đơn giá vận chuyển: 550.000 VND/CBM.');
    }
    if (expOpts.includeDelivery) {
      conditions.push('- Chi phí xe giao hàng tận nơi tại cửa hàng: 310.000 VND/chuyến.');
    }
    if (expOpts.includeOversized) {
      conditions.push('- Hàng quá khổ (kích thước > 1m hoặc > 150kg/kiện): phụ thu 15-30% tùy gói cước.');
    }
    if (expOpts.includeChemical) {
      conditions.push('- Hàng hóa chất/chất lỏng: phụ thu 20-30% tùy gói cước.');
    }
    if (expOpts.includeInsurance) {
      conditions.push('- Bảo hiểm hàng hóa: 0.08% giá trị hàng hóa. Không mua → bồi thường tối đa 1.500đ/kg.');
    }
    if (expOpts.includeWoodenCrate) {
      conditions.push('- Đóng kiện gỗ: 1.200.000 VND/CBM.');
    }
    if (expOpts.includeCounting) {
      conditions.push('- Kiểm đếm hàng hóa: 2.000 VND/sản phẩm.');
    }
    if (expOpts.includeCOD) {
      conditions.push('- Thu hộ COD: 1% giá trị thu hộ (tối thiểu 30.000đ).');
    }

    // Build document
    const docChildren = [];

    // Title
    docChildren.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ text: 'BẢNG BÁO GIÁ', bold: true, size: 36, font: 'Times New Roman', color: '1B75BB' })]
    }));

    // Ref number
    const refNum = String(today.getDate()).padStart(2,'0') + String(today.getMonth()+1).padStart(2,'0');
    docChildren.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [new TextRun({ text: 'Số: ' + refNum + '/NPV-' + today.getFullYear(), bold: true, size: 24, font: 'Times New Roman' })]
    }));

    // Customer
    docChildren.push(new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({ text: 'Kính gửi: ', bold: true, size: 24, font: 'Times New Roman' }),
        new TextRun({ text: customerName.toUpperCase(), bold: true, size: 24, font: 'Times New Roman', color: '1B75BB' })
      ]
    }));

    // Greeting  
    docChildren.push(new Paragraph({
      spacing: { after: 200 },
      children: [new TextRun({ text: 'Trước hết, NPV gửi lời cảm ơn sự quan tâm của quý công ty đến loại hình dịch vụ vận chuyển NPV.', size: 24, font: 'Times New Roman' })]
    }));

    // Transport description
    const regionName = f.region ? (PRICING_DATA.regions[f.region]?.name || '') : '';
    const provinceName = document.getElementById('province').selectedOptions[0]?.text || '';
    if (regionName && provinceName) {
      docChildren.push(new Paragraph({
        spacing: { after: 300 },
        children: [new TextRun({ text: 'Được biết, quý công ty có nhu cầu vận chuyển hàng từ ' + regionName.split(' - ')[1] + ' đi ' + provinceName + '. NPV xin gửi quý công ty bảng báo giá như sau.', size: 24, font: 'Times New Roman' })]
      }));
    }

    // Conditions
    for (const cond of conditions) {
      docChildren.push(new Paragraph({
        spacing: { after: 100 },
        children: [new TextRun({ text: cond, bold: true, size: 24, font: 'Times New Roman' })]
      }));
    }

    // Spacing
    docChildren.push(new Paragraph({ spacing: { after: 300 }, children: [] }));

    // Sign-off date
    docChildren.push(new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { after: 200 },
      children: [new TextRun({ text: (regionName ? regionName.split(' - ')[1] : 'TP.HCM') + ', ' + dateStr, bold: true, italics: true, size: 24, font: 'Times New Roman' })]
    }));

    const doc = new Document({
      sections: [{ properties: {}, children: docChildren }]
    });

    Packer.toBlob(doc).then(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Bao_gia_' + customerName.replace(/[^a-zA-Z0-9\\u00C0-\\u024F\\u1E00-\\u1EFF]/g, '_').substring(0, 30) + '.docx';
      a.click();
      URL.revokeObjectURL(url);
    });
  },

`;

// Insert before getPackageName
const insertLines = exportWordFunction.split('\n');
lines.splice(getPackageIdx, 0, ...insertLines.map(l => l + '\r'));

fs.writeFileSync('d:/Downloads/BAO GIA/app/app.js', lines.join('\n'));
console.log('SUCCESS! Added exportWord function. New line count:', lines.length + insertLines.length);
