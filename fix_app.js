const fs = require('fs');
let fileContent = fs.readFileSync('d:/Downloads/BAO GIA/app/app.js', 'utf8');

fileContent = fileContent.replace(
`      dimL: parseFloat(document.getElementById('dimL').value) || 0,
      dimW: parseFloat(document.getElementById('dimW').value) || 0,
      dimH: parseFloat(document.getElementById('dimH').value) || 0,
      goodsValue: parseFloat(document.getElementById('goodsValue').value) || 0,`,
`      cbm: parseFloat(document.getElementById('cbm').value) || 0,
      isOversized: document.getElementById('isOversized').checked,
      goodsValue: parseFloat(document.getElementById('goodsValue').value) || 0,`
);

// fix calculateRoute
fileContent = fileContent.replace(
`    const oversized = Calculator.isOversized(f.dimL, f.dimW, f.dimH);
    const needsLifting = Calculator.needsLiftingFee(weightPerPiece);
    let chargeableWeight = f.weight;

    if (f.dimL > 0 && f.dimW > 0 && f.dimH > 0) {
      chargeableWeight = Calculator.calcChargeableWeight(
        f.weight, f.dimL, f.dimW, f.dimH, !f.isNonStackable, oversized
      );
    }`,
`    const oversized = f.isOversized;
    const needsLifting = Calculator.needsLiftingFee(weightPerPiece);
    
    let chargeableWeight = f.weight;
    let convertedWeight = 0;

    if (f.cbm > 0) {
      convertedWeight = f.cbm * 300;
      chargeableWeight = Math.max(f.weight, convertedWeight);
    }`
);

// fix calcSurcharges
fileContent = fileContent.replace(
`      woodenCrate: f.woodenCrateCBM > 0,
      cbm: f.woodenCrateCBM,`,
`      woodenCrate: f.woodenCrateCBM > 0,
      woodCbm: f.woodenCrateCBM,`
);

fileContent = fileContent.replace(
`    this.renderResult({
      productName: f.productName,
      packageName: this.getPackageName(f.packageType),`,
`    const effectiveDate = PRICING_DATA.effectiveDate || new Date().toLocaleDateString('vi-VN');
    this.lastResult = {
      productName: f.productName,
      customerName: '',
      effectiveDate: effectiveDate,
      packageName: this.getPackageName(f.packageType),`
);

fileContent = fileContent.replace(
`      chargeableWeight: Math.round(chargeableWeight * 100) / 100,
      isConverted: chargeableWeight > f.weight,`,
`      cbm: f.cbm,
      cbmWeight: convertedWeight,
      chargeableWeight: Math.round(chargeableWeight * 100) / 100,
      isConverted: convertedWeight > f.weight,`
);

fileContent = fileContent.replace(
`      deliveryTime
    });
  },`,
`      deliveryTime
    };
    this.renderResult(this.lastResult);
  },`
);

fileContent = fileContent.replace(
`          <div class="value">\${data.chargeableWeight} kg\${data.isConverted ? ' (QĐ)' : ''}</div>
        </div>
      </div>`,
`          <div class="value">\${data.chargeableWeight} kg</div>
          <div style="font-size:11px; color:#64748b; margin-top:4px;">
            (Thực tế: \${data.actualWeight}kg <br/> Quy đổi \${data.cbm || 0} CBM: \${data.cbmWeight}kg)
          </div>
        </div>
      </div>`
);

fileContent = fileContent.replace(
`    document.getElementById('resultEmpty').style.display = 'none';
    document.getElementById('resultSummary').classList.add('show');
  },`,
`    document.getElementById('resultEmpty').style.display = 'none';
    document.getElementById('resultSummary').classList.add('show');
    const wordExportSection = document.getElementById('wordExportSection');
    if(wordExportSection) wordExportSection.style.display = 'block';
  },`
);

fileContent = fileContent.replace(
`    const weightPerPiece = f.weight / f.pieces;
    const oversized = Calculator.isOversized(f.dimL, f.dimW, f.dimH);
    let chargeableWeight = f.weight;
    if (f.dimL > 0 && f.dimW > 0 && f.dimH > 0) {
      chargeableWeight = Calculator.calcChargeableWeight(
        f.weight, f.dimL, f.dimW, f.dimH, !f.isNonStackable, oversized
      );
    }`,
`    const weightPerPiece = f.weight / f.pieces;
    const oversized = f.isOversized;
    let chargeableWeight = f.weight;
    if (f.cbm > 0) {
      chargeableWeight = Math.max(f.weight, f.cbm * 300);
    }`
);

fileContent = fileContent.replace(
`      woodenCrate: f.woodenCrateCBM > 0,
      cbm: f.woodenCrateCBM,
      countingQty: f.countingQty,`,
`      woodenCrate: f.woodenCrateCBM > 0,
      woodCbm: f.woodenCrateCBM,
      countingQty: f.countingQty,`
);

let docxLogic = `
  exportWord() {
    if (!this.lastResult) return alert("Vui lòng tính cước trước!");
    const data = this.lastResult;
    // Cập nhật giá trị ô input
    data.customerName = document.getElementById('exportCustomerName').value.trim() || "Kính gửi: Quý Khách Hàng";
    const incDelivery = document.getElementById('expIncludeDelivery').checked;
    const expCBM = document.getElementById('expCBM').checked;
    const expNoneVat = document.getElementById('expNoneVat').checked;

    // Build rows cho bảng báo giá
    const tableRows = [
      new docx.TableRow({
        children: [
          new docx.TableCell({ children: [new docx.Paragraph({ text: "Tuyến đường", bold: true })], shading: { fill: "f1f5f9" } }),
          new docx.TableCell({ children: [new docx.Paragraph({ text: "TGSK", bold: true })], shading: { fill: "f1f5f9" } }),
          new docx.TableCell({ children: [new docx.Paragraph({ text: "Tổng KG", bold: true })], shading: { fill: "f1f5f9" } }),
          new docx.TableCell({ children: [new docx.Paragraph({ text: "Gói Cước", bold: true })], shading: { fill: "f1f5f9" } }),
          new docx.TableCell({ children: [new docx.Paragraph({ text: "Đơn giá/kg", bold: true })], shading: { fill: "f1f5f9" } }),
          new docx.TableCell({ children: [new docx.Paragraph({ text: "Cước Vận Chuyển", bold: true })], shading: { fill: "f1f5f9" } })
        ]
      }),
      new docx.TableRow({
        children: [
          new docx.TableCell({ children: [new docx.Paragraph(\`\${data.region.split('-')[0]} đi \${data.province}\`)] }),
          new docx.TableCell({ children: [new docx.Paragraph(data.deliveryTime)] }),
          new docx.TableCell({ children: [new docx.Paragraph(data.chargeableWeight.toString())] }),
          new docx.TableCell({ children: [new docx.Paragraph(data.packageName.split('-')[1] || data.packageName)] }),
          new docx.TableCell({ children: [new docx.Paragraph(Calculator.formatVND(data.pricePerKg))] }),
          new docx.TableCell({ children: [new docx.Paragraph(Calculator.formatVND(data.baseCost))] })
        ]
      })
    ];

    // Thêm các phụ phí vào bảng
    data.surcharges.forEach(s => {
      tableRows.push(new docx.TableRow({
        children: [
          new docx.TableCell({ children: [new docx.Paragraph(s.name)], columnSpan: 5 }),
          new docx.TableCell({ children: [new docx.Paragraph(Calculator.formatVND(s.amount))] })
        ]
      }));
    });

    tableRows.push(new docx.TableRow({
      children: [
        new docx.TableCell({ children: [new docx.Paragraph({ text: "Tạm tính (chưa VAT)", bold: true })], columnSpan: 5 }),
        new docx.TableCell({ children: [new docx.Paragraph({ text: Calculator.formatVND(data.subtotal + data.fuel), bold: true })] })
      ]
    }));

    const detailsParagraphs = [
      new docx.Paragraph({
        children: [new docx.TextRun({ text: "+ Phương thức vận chuyển: Vận chuyển bằng đường bộ.", size: 24 })]
      }),
      new docx.Paragraph({
        children: [new docx.TextRun({ text: "+ Điều kiện vận chuyển: giao nhận trên phương tiện vận tải.", size: 24 })]
      })
    ];

    if (expNoneVat) {
      detailsParagraphs.push(new docx.Paragraph({
        children: [new docx.TextRun({ text: "+ Giá cước trên chưa bao gồm: VAT, và phí bốc xếp 2 đầu.", size: 24 })]
      }));
    }
    if (expCBM) {
      detailsParagraphs.push(new docx.Paragraph({
        children: [new docx.TextRun({ text: "+ Đơn giá vận chuyển: 550.000 vnd/cbm.", size: 24 })]
      }));
    }
    if (incDelivery) {
      detailsParagraphs.push(new docx.Paragraph({
        children: [new docx.TextRun({ text: "+ Chi phí xe giao hàng tận nơi tại cửa hàng: 310.000 vnd/chuyến.", size: 24 })]
      }));
    }

    const doc = new docx.Document({
      sections: [{
        properties: {},
        children: [
          new docx.Paragraph({
            text: "BẢNG BÁO GIÁ DỊCH VỤ VẬN CHUYỂN",
            heading: docx.HeadingLevel.HEADING_1,
            alignment: docx.AlignmentType.CENTER,
          }),
          new docx.Paragraph({
            text: \`Áp dụng từ ngày: \${data.effectiveDate || '15/03/2026'}\`,
            alignment: docx.AlignmentType.RIGHT,
            spacing: { after: 400 }
          }),
          new docx.Paragraph({
            children: [
              new docx.TextRun({ text: data.customerName, bold: true, size: 28 })
            ],
            spacing: { after: 200 }
          }),
          new docx.Table({
            width: { size: 100, type: docx.WidthType.PERCENTAGE },
            rows: tableRows,
          }),
          new docx.Paragraph({ text: "", spacing: { after: 200 } }),
          new docx.Paragraph({ text: "Chi tiết báo giá:", bold: true, size: 24, spacing: { after: 100 } }),
          ...detailsParagraphs
        ],
      }],
    });

    docx.Packer.toBlob(doc).then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = \`Bao_Gia_\${data.productName.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'NPV'}.docx\`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  },`;

fileContent = fileContent.replace(
`    document.getElementById('compareCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
  },`,
`    document.getElementById('compareCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
  },
` + docxLogic
);

fileContent = fileContent.replace(
`    document.getElementById('resultEmpty').style.display = 'block';
    document.getElementById('resultSummary').classList.remove('show');`,
`    document.getElementById('resultEmpty').style.display = 'block';
    const wordExportSection = document.getElementById('wordExportSection');
    if(wordExportSection) wordExportSection.style.display = 'none';
    document.getElementById('resultSummary').classList.remove('show');`
);

fs.writeFileSync('d:/Downloads/BAO GIA/app/app.js', fileContent);
console.log('Fixed app.js successfully.');
