const fs = require('fs');

// 1. ADD G4 MODAL TO HTML
let html = fs.readFileSync('d:/Downloads/BAO GIA/app/admin.html', 'utf8');

const htmlModalG4 = \`
  <!-- G4 Vehicle Edit Modal -->
  <div class="overlay" id="g4Modal" style="display:none; align-items:flex-start; overflow-y:auto; padding: 20px;">
    <div class="modal-content" style="background:white; border-radius:12px; max-width:650px; width:100%; padding:24px; box-shadow:0 10px 25px rgba(0,0,0,0.15); position:relative; margin-top: 40px;">
      <button onclick="closeG4Modal()" style="position:absolute; top:16px; right:16px; background:none; border:none; font-size:24px; cursor:pointer; color:#94a3b8;">&times;</button>
      <h2 id="g4ModalTitle" style="margin-top:0; color:#0f172a; font-size:20px; border-bottom:1px solid #e2e8f0; padding-bottom:12px; margin-bottom:20px;">Thêm/Sửa Loại Xe G4</h2>
      
      <div style="display:flex; flex-direction:column; gap:16px;">
        <input type="hidden" id="modalG4Index">
        
        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px;">
          <div>
            <label style="display:block; font-size:13px; font-weight:600; color:#475569; margin-bottom:6px;">Mã Xe (ID)</label>
            <input type="number" id="modalG4Id" class="form-control" style="width:100%; padding:8px 12px; border:1px solid #cbd5e1; border-radius:6px;">
          </div>
          <div>
            <label style="display:block; font-size:13px; font-weight:600; color:#475569; margin-bottom:6px;">Tên Xe</label>
            <input type="text" id="modalG4Name" class="form-control" style="width:100%; padding:8px 12px; border:1px solid #cbd5e1; border-radius:6px;">
          </div>
          <div>
            <label style="display:block; font-size:13px; font-weight:600; color:#475569; margin-bottom:6px;">Kích thước</label>
            <input type="text" id="modalG4Size" class="form-control" style="width:100%; padding:8px 12px; border:1px solid #cbd5e1; border-radius:6px;">
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px;">
          <div>
            <label style="display:block; font-size:13px; font-weight:600; color:#475569; margin-bottom:6px;">Thời gian bốc hàng</label>
            <input type="text" id="modalG4LoadTime" class="form-control" style="width:100%; padding:8px 12px; border:1px solid #cbd5e1; border-radius:6px;">
          </div>
          <div>
            <label style="display:block; font-size:13px; font-weight:600; color:#475569; margin-bottom:6px;">Phí chờ (VNĐ)</label>
            <input type="number" id="modalG4WaitFee" class="form-control" style="width:100%; padding:8px 12px; border:1px solid #cbd5e1; border-radius:6px;">
          </div>
          <div>
            <label style="display:block; font-size:13px; font-weight:600; color:#475569; margin-bottom:6px;">Phí thêm điểm (VNĐ)</label>
            <input type="number" id="modalG4ExtraPoint" class="form-control" style="width:100%; padding:8px 12px; border:1px solid #cbd5e1; border-radius:6px;">
          </div>
        </div>

        <div style="background:#f8fafc; padding:16px; border-radius:8px; border:1px solid #e2e8f0;">
          <h3 style="font-size:14px; margin-top:0; margin-bottom:12px; color:#1e293b;">Bảng Giá Theo Km (VNĐ)</h3>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
             <div>
                <label style="display:block; font-size:12px; color:#64748b; margin-bottom:4px;">Giá cơ sở (10km đầu)</label>
                <input type="number" id="modalG4Base" class="form-control" style="width:100%; padding:8px; border:1px solid #cbd5e1; border-radius:4px; font-weight:bold; color:#1B75BB;">
             </div>
             <div>
                <label style="display:block; font-size:12px; color:#64748b; margin-bottom:4px;">Nấc 1 (10-30km)</label>
                <input type="number" id="modalG4Km1" class="form-control" style="width:100%; padding:8px; border:1px solid #cbd5e1; border-radius:4px;">
             </div>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr 1fr 1fr; gap:8px;">
             <div>
                <label style="display:block; font-size:12px; color:#64748b; margin-bottom:4px;">Nấc 2 (30-50)</label>
                <input type="number" id="modalG4Km2" class="form-control" style="width:100%; padding:8px; border:1px solid #cbd5e1; border-radius:4px;">
             </div>
             <div>
                <label style="display:block; font-size:12px; color:#64748b; margin-bottom:4px;">Nấc 3 (50-100)</label>
                <input type="number" id="modalG4Km3" class="form-control" style="width:100%; padding:8px; border:1px solid #cbd5e1; border-radius:4px;">
             </div>
             <div>
                <label style="display:block; font-size:12px; color:#64748b; margin-bottom:4px;">Nấc 4 (100-200)</label>
                <input type="number" id="modalG4Km4" class="form-control" style="width:100%; padding:8px; border:1px solid #cbd5e1; border-radius:4px;">
             </div>
             <div>
                <label style="display:block; font-size:12px; color:#64748b; margin-bottom:4px;">Nấc 5 (>200)</label>
                <input type="number" id="modalG4Km5" class="form-control" style="width:100%; padding:8px; border:1px solid #cbd5e1; border-radius:4px;">
             </div>
          </div>
        </div>

        <div style="background:#fffbeb; padding:16px; border-radius:8px; border:1px solid #fde68a;">
          <label style="display:block; font-size:14px; font-weight:700; color:#b45309; margin-bottom:8px;">📅 Ngày Hiệu Lực Áp Dụng <span style="color:red">*</span></label>
          <p style="font-size:12px; color:#d97706; margin-top:0; margin-bottom:12px;">Hệ thống sẽ giữ lại phiên bản cũ và tạo phiên bản cước mới bắt đầu từ ngày này.</p>
          <input type="date" id="modalG4EffectiveDate" class="form-control" style="width:100%; padding:10px; border:1px solid #fcd34d; border-radius:6px; font-weight:600; font-size:15px;">
        </div>

        <div style="display:flex; justify-content:flex-end; gap:12px; margin-top:8px;">
          <button type="button" class="btn btn-outline" onclick="closeG4Modal()">Hủy</button>
          <button type="button" class="btn btn-primary-bg" onclick="saveG4Modal()">💾 Lưu Loại Xe</button>
        </div>
      </div>
    </div>
  </div>
\`;

if (!html.includes('id="g4Modal"')) {
   html = html.replace('<!-- Delete Modal -->', htmlModalG4 + '\\n\\n  <!-- Delete Modal -->');
   fs.writeFileSync('d:/Downloads/BAO GIA/app/admin.html', html);
   console.log('Injected G4 modal into HTML.');
}


// 2. ADD JS LOGIC TO ADMIN.JS
let js = fs.readFileSync('d:/Downloads/BAO GIA/app/admin.js', 'utf8');

const jsModalG4 = \`
// ================= G4 HISTORY MODALS =================
window.openG4Modal = function(idx = -1) {
  const modal = document.getElementById('g4Modal');
  if (!modal) return;
  const pkgData = PRICING_DATA.g4[currentRegion];
  if (!pkgData) return;
  
  document.getElementById('modalG4Index').value = idx;
  const isEdit = idx >= 0;
  
  if (isEdit) {
    const v = pkgData.vehicles[idx];
    document.getElementById('g4ModalTitle').innerText = 'Sửa Bảng Giá Xe';
    document.getElementById('modalG4Id').value = v.id || '';
    document.getElementById('modalG4Name').value = v.name || '';
    document.getElementById('modalG4Size').value = v.size || '';
    document.getElementById('modalG4LoadTime').value = v.loadTime || '';
    document.getElementById('modalG4WaitFee').value = v.waitFee || 0;
    document.getElementById('modalG4ExtraPoint').value = v.extraPoint || 0;
    document.getElementById('modalG4Base').value = v.basePrice || 0;
    
    for(let i=1; i<6; i++) {
       document.getElementById('modalG4Km'+i).value = v.kmPrices && v.kmPrices[i] ? v.kmPrices[i] : 0;
    }
  } else {
    document.getElementById('g4ModalTitle').innerText = 'Thêm Loại Xe Mới';
    const newId = (pkgData.vehicles[pkgData.vehicles.length - 1]?.id || 0) + 1;
    document.getElementById('modalG4Id').value = newId;
    document.getElementById('modalG4Name').value = '';
    document.getElementById('modalG4Size').value = '';
    document.getElementById('modalG4LoadTime').value = '60 phút';
    document.getElementById('modalG4WaitFee').value = '';
    document.getElementById('modalG4ExtraPoint').value = '';
    document.getElementById('modalG4Base').value = '';
    for(let i=1; i<6; i++) document.getElementById('modalG4Km'+i).value = '';
  }
  
  document.getElementById('modalG4EffectiveDate').value = new Date().toISOString().split('T')[0];
  modal.style.display = 'flex';
};

window.closeG4Modal = function() {
  const modal = document.getElementById('g4Modal');
  if (modal) modal.style.display = 'none';
};

window.saveG4Modal = function() {
  const pkgData = PRICING_DATA.g4[currentRegion];
  const idx = parseInt(document.getElementById('modalG4Index').value);
  const isEdit = idx >= 0;
  
  const effDate = document.getElementById('modalG4EffectiveDate').value;
  if (!effDate) { alert('Vui lòng chọn Ngày hiệu lực!'); return; }
  
  const newV = {
    id: parseInt(document.getElementById('modalG4Id').value) || 0,
    name: document.getElementById('modalG4Name').value,
    size: document.getElementById('modalG4Size').value,
    loadTime: document.getElementById('modalG4LoadTime').value,
    waitFee: parseFloat(document.getElementById('modalG4WaitFee').value) || 0,
    extraPoint: parseFloat(document.getElementById('modalG4ExtraPoint').value) || 0,
    basePrice: parseFloat(document.getElementById('modalG4Base').value) || 0,
    kmPrices: [
      0, // index 0 unused
      parseFloat(document.getElementById('modalG4Km1').value) || 0,
      parseFloat(document.getElementById('modalG4Km2').value) || 0,
      parseFloat(document.getElementById('modalG4Km3').value) || 0,
      parseFloat(document.getElementById('modalG4Km4').value) || 0,
      parseFloat(document.getElementById('modalG4Km5').value) || 0
    ],
    effectiveDate: effDate,
    status: 'active'
  };

  if (isEdit) {
    const oldV = pkgData.vehicles[idx];
    oldV.status = 'inactive';
    oldV.endDate = effDate;
    pkgData.vehicles.splice(idx, 0, newV);
  } else {
    pkgData.vehicles.unshift(newV);
  }
  
  closeG4Modal();
  renderContent();
};

window.openDeleteModalG4 = function(idx) {
  document.getElementById('deleteRouteIndex').value = idx + '-g4'; // string identifier
  document.getElementById('modalInactiveDate').value = new Date().toISOString().split('T')[0];
  document.getElementById('deleteModal').style.display = 'flex';
};
\`;

if (!js.includes('openG4Modal')) {
   js = js.replace('// ===== Bảng G1, G2, G3 =====', jsModalG4 + '\\n// ===== Bảng G1, G2, G3 =====');
}

// 3. Update Delete Modal confirm behavior to handle both Route and G4
js = js.replace(
  /window.confirmDeleteRoute\s*=\s*function\(\) \{[\s\S]*?renderContent\(\);\s*\};/,
  \`window.confirmDeleteRoute = function() {
  const delRef = document.getElementById('deleteRouteIndex').value;
  const inactiveDate = document.getElementById('modalInactiveDate').value;
  if (!inactiveDate) { alert('Vui lòng chọn ngày ngừng hoạt động!'); return; }
  
  if (delRef.includes('-g4')) {
    const idx = parseInt(delRef.split('-')[0]);
    const pkgData = PRICING_DATA.g4[currentRegion];
    const v = pkgData.vehicles[idx];
    v.status = 'inactive';
    v.endDate = inactiveDate;
  } else {
    const idx = parseInt(delRef);
    const pkgData = PRICING_DATA[currentTab][currentRegion];
    const route = pkgData.routes[idx];
    route.status = 'inactive';
    route.endDate = inactiveDate;
  }
  
  closeDeleteModal();
  renderContent();
};\`);

// 4. Replace + Add button logic
js = js.replace(
  /(\} else if \(currentTab === 'g4'\) \{\s*const pkgData = PRICING_DATA\.g4\[currentRegion\];\s*if \(\!pkgData\) return;\s*)const newId =[\s\S]*?\}\);?\s*\}/,
  '$1openG4Modal(-1);\n    return;\n  }'
);

// 5. Override renderG4Table Row loop
const renderG4Regex = /pkgData\.vehicles\.forEach\(\(v, idx\) => \{[\s\S]*?table\.appendChild\(tr\);\s*\}\);/;

const renderG4Replace = \`pkgData.vehicles.forEach((v, idx) => {
    const tr = document.createElement('tr');
    const isInactive = v.status === 'inactive';
    if (isInactive) {
      tr.style.opacity = '0.5';
      tr.style.background = '#f1f5f9';
    }

    const tdAct = document.createElement('td');
    tdAct.style.whiteSpace = 'nowrap';
    const authDisabled = currentUserRole !== 'boss' ? 'disabled' : '';
    const authStyle = currentUserRole !== 'boss' ? 'display:none;' : '';
    
    if (!isInactive) {
      tdAct.innerHTML = \\`<button class="btn btn-outline" style="padding:4px 8px; font-size:12px; margin-right:4px; \${authStyle}" onclick="openG4Modal(\${idx})">✏️ Sửa</button>
                         <button class="btn btn-remove" style="\${authStyle} padding:4px 8px;" onclick="openDeleteModalG4(\${idx})">✖</button>\\`;
    } else {
      tdAct.innerHTML = \\`<span style="font-size:11px; color:#ef4444; font-weight:bold; background:#fee2e2; padding:2px 6px; border-radius:4px;">Đã Ngừng<br>(\${v.endDate || 'N/A'})</span>\\`;
    }
    tr.appendChild(tdAct);

    // Text cells
    const cId = document.createElement('td'); cId.innerText = v.id || ''; tr.appendChild(cId);
    
    let nameHtml = v.name || '';
    if (v.effectiveDate && !isInactive) nameHtml += \\`<br><span style="font-size:10px; color:#10b981; background:#d1fae5; padding:2px 4px; border-radius:4px;">Từ: \${v.effectiveDate}</span>\\`;
    const cName = document.createElement('td'); cName.innerHTML = nameHtml; cName.style.fontWeight = '500'; cName.style.textAlign = 'left'; tr.appendChild(cName);
    
    const cSize = document.createElement('td'); cSize.innerText = v.size || ''; tr.appendChild(cSize);
    const cLoad = document.createElement('td'); cLoad.innerText = v.loadTime || ''; tr.appendChild(cLoad);
    
    const cBase = document.createElement('td'); cBase.innerText = fMoney(v.basePrice); cBase.style.fontWeight = 'bold'; cBase.style.color = '#1B75BB'; tr.appendChild(cBase);

    for (let i = 1; i < 6; i++) {
        const cKm = document.createElement('td');
        cKm.innerText = fMoney(v.kmPrices && v.kmPrices[i] ? v.kmPrices[i] : 0);
        tr.appendChild(cKm);
    }
    
    const cWait = document.createElement('td'); cWait.innerText = fMoney(v.waitFee); tr.appendChild(cWait);
    const cEx = document.createElement('td'); cEx.innerText = fMoney(v.extraPoint); tr.appendChild(cEx);

    table.appendChild(tr);
  });\`;

js = js.replace(renderG4Regex, renderG4Replace);
fs.writeFileSync('d:/Downloads/BAO GIA/app/admin.js', js);
console.log('Injected G4 rendering logic into admin.js.');
