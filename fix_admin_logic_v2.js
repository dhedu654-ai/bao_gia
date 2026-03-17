const fs = require('fs');
let code = fs.readFileSync('d:/Downloads/BAO GIA/app/admin.js', 'utf8');

const injectionHTML = `
// ================= ROUTE HISTORY MODALS =================
window.openRouteModal = function(idx = -1) {
  const modal = document.getElementById('routeModal');
if (!modal) return;
  const pkgData = PRICING_DATA[currentTab][currentRegion];
  if (!pkgData) return;
  
  document.getElementById('modalRouteIndex').value = idx;
  const isEdit = idx >= 0;
  
  if (isEdit) {
    const r = pkgData.routes[idx];
    document.getElementById('routeModalTitle').innerText = 'Sửa Tuyến Đường';
    document.getElementById('modalProvince').value = r.province || '';
    document.getElementById('modalCode').value = r.code || '';
    document.getElementById('modalArea').value = r.area || '';
    document.getElementById('modalZone').value = r.zone || 1;
    document.getElementById('modalTime').value = r.time || r.deliveryTime || '';
    document.getElementById('modalMin').value = r.min || 0;
    
    // Fill prices
    for(let i=0; i<5; i++) {
       document.getElementById('modalP'+(i+1)).value = r.prices && r.prices[i] ? r.prices[i] : 0;
    }
  } else {
    document.getElementById('routeModalTitle').innerText = 'Thêm Tuyến Đường Mới';
    document.getElementById('modalProvince').value = '';
    document.getElementById('modalCode').value = '';
    document.getElementById('modalArea').value = '';
    document.getElementById('modalZone').value = '';
    document.getElementById('modalTime').value = '';
    document.getElementById('modalMin').value = '';
    for(let i=0; i<5; i++) document.getElementById('modalP'+(i+1)).value = '';
  }
  
  document.getElementById('modalEffectiveDate').value = new Date().toISOString().split('T')[0];
  modal.style.display = 'flex';
};

window.closeRouteModal = function() {
  const modal = document.getElementById('routeModal');
  if (modal) modal.style.display = 'none';
};

window.saveRouteModal = function() {
  const pkgData = PRICING_DATA[currentTab][currentRegion];
  const idx = parseInt(document.getElementById('modalRouteIndex').value);
  const isEdit = idx >= 0;
  
  const effDate = document.getElementById('modalEffectiveDate').value;
  if (!effDate) { alert('Vui lòng chọn Ngày hiệu lực!'); return; }
  
  const newRoute = {
    zone: parseInt(document.getElementById('modalZone').value) || 1,
    province: document.getElementById('modalProvince').value,
    code: document.getElementById('modalCode').value,
    area: document.getElementById('modalArea').value,
    time: document.getElementById('modalTime').value,
    min: parseFloat(document.getElementById('modalMin').value) || 0,
    prices: [
      parseFloat(document.getElementById('modalP1').value) || 0,
      parseFloat(document.getElementById('modalP2').value) || 0,
      parseFloat(document.getElementById('modalP3').value) || 0,
      parseFloat(document.getElementById('modalP4').value) || 0,
      parseFloat(document.getElementById('modalP5').value) || 0
    ],
    effectiveDate: effDate,
    status: 'active'
  };

  if (isEdit) {
    const oldRoute = pkgData.routes[idx];
    oldRoute.status = 'inactive';
    oldRoute.endDate = effDate;
    pkgData.routes.splice(idx, 0, newRoute);
  } else {
    pkgData.routes.unshift(newRoute);
  }
  
  closeRouteModal();
  renderContent();
};

window.openDeleteModal = function(idx) {
  document.getElementById('deleteRouteIndex').value = idx;
  document.getElementById('modalInactiveDate').value = new Date().toISOString().split('T')[0];
  document.getElementById('deleteModal').style.display = 'flex';
};

window.closeDeleteModal = function() {
  document.getElementById('deleteModal').style.display = 'none';
};

window.confirmDeleteRoute = function() {
  const pkgData = PRICING_DATA[currentTab][currentRegion];
  const idx = parseInt(document.getElementById('deleteRouteIndex').value);
  const inactiveDate = document.getElementById('modalInactiveDate').value;
  
  if (!inactiveDate) { alert('Vui lòng chọn ngày ngừng hoạt động!'); return; }
  
  const route = pkgData.routes[idx];
  route.status = 'inactive';
  route.endDate = inactiveDate;
  
  closeDeleteModal();
  renderContent();
};
`;

if (!code.includes('openRouteModal')) {
   code += '\n\n' + injectionHTML;
}

// 2. Replace add config click
code = code.replace(
  /window\.addRouteConfig = function\(\) \{[\s\S]*?if \(\['g1', 'g2', 'g3'\].includes\(currentTab\)\) \{[\s\S]*?pkgData\.routes\.unshift\([\s\S]*?\}\);?\s*\} else if \(currentTab === 'g4'\)/,
  `window.addRouteConfig = function() {
  if (['g1', 'g2', 'g3'].includes(currentTab)) {
    openRouteModal(-1);
    return;
  } else if (currentTab === 'g4')`
);

// 3. Exact replacement of renderStandardPackageTable's row loop
const oldLoop = `pkgData.routes.forEach((route, idx) => {
    if (filterZone && route.zone.toString() !== filterZone) return;
    if (searchTerm) {
      const txt = ((route.province || '') + (route.code || '') + (route.area || '')).toLowerCase();
      if (!txt.includes(searchTerm)) return;
    }

    const tr = document.createElement('tr');

    // Delete button
    const tdDel = document.createElement('td');
    const btnDel = document.createElement('button');
    btnDel.className = 'btn-remove';
    btnDel.innerHTML = '&times;';
    btnDel.onclick = () => { if (confirm('Xóa tuyến này?')) { pkgData.routes.splice(idx, 1); renderContent(); } };
    tdDel.appendChild(btnDel);
    tr.appendChild(tdDel);

    // Zone, Province, Code, Area
    [
      { key: 'zone', num: false, left: false },
      { key: 'province', num: false, left: true },
      { key: 'code', num: false, left: false },
      { key: 'area', num: false, left: true }
    ].forEach(col => {
      const td = document.createElement('td');
      td.appendChild(createInput(route, col.key, col.num, col.left));
      tr.appendChild(td);
    });

    // Delivery time
    const timeKey = route.time !== undefined ? 'time' : 'deliveryTime';
    const tdTime = document.createElement('td');
    tdTime.appendChild(createInput(route, timeKey, false, false));
    tr.appendChild(tdTime);

    // Min price
    const tdMin = document.createElement('td');
    const inpMin = createInput(route, 'min', true, false);
    inpMin.style.fontWeight = 'bold';
    inpMin.style.color = '#000';
    tdMin.appendChild(inpMin);
    tr.appendChild(tdMin);

    // Price tiers
    route.prices.forEach((p, pIdx) => {
      const td = document.createElement('td');
      const inp = document.createElement('input');
      inp.className = 'cell-input number';
      inp.value = p ? fMoney(p) : '0';
      inp.addEventListener('change', (e) => {
        let val = e.target.value.replace(/[^0-9.\\-]+/g, "");
        route.prices[pIdx] = parseFloat(val) || 0;
        inp.value = fMoney(route.prices[pIdx]);
      });
      td.appendChild(inp);
      tr.appendChild(td);
    });

    table.appendChild(tr);
  });`;

const newLoop = `pkgData.routes.forEach((route, idx) => {
    if (filterZone && (route.zone || '').toString() !== filterZone) return;
    if (searchTerm) {
      const txt = ((route.province || '') + (route.code || '') + (route.area || '')).toLowerCase();
      if (!txt.includes(searchTerm)) return;
    }

    const tr = document.createElement('tr');
    const isInactive = route.status === 'inactive';
    if (isInactive) {
      tr.style.opacity = '0.5';
      tr.style.background = '#f1f5f9';
    }

    // Actions
    const tdAct = document.createElement('td');
    tdAct.style.whiteSpace = 'nowrap';
    const authDisabled = currentUserRole !== 'boss' ? 'disabled' : '';
    const authStyle = currentUserRole !== 'boss' ? 'display:none;' : '';
    
    if (!isInactive) {
      tdAct.innerHTML = \`<button class="btn btn-outline" style="padding:4px 8px; font-size:12px; margin-right:4px; \${authStyle}" onclick="openRouteModal(\${idx})">✏️ Sửa</button>
                         <button class="btn btn-remove" style="\${authStyle} padding:4px 8px;" onclick="openDeleteModal(\${idx})">✖</button>\`;
    } else {
      tdAct.innerHTML = \`<span style="font-size:11px; color:#ef4444; font-weight:bold; background:#fee2e2; padding:2px 6px; border-radius:4px;">Đã Ngừng<br>(\${route.endDate || 'N/A'})</span>\`;
    }
    tr.appendChild(tdAct);

    // Texts instead of inputs
    const tdZone = document.createElement('td'); tdZone.innerText = route.zone || ''; tr.appendChild(tdZone);
    const tdProv = document.createElement('td'); tdProv.style.textAlign = 'left'; tdProv.style.fontWeight = '500';
    let provHtml = route.province || '';
    if (route.effectiveDate && !isInactive) provHtml += \`<br><span style="font-size:10px; color:#10b981; background:#d1fae5; padding:2px 4px; border-radius:4px;">Từ: \${route.effectiveDate}</span>\`;
    tdProv.innerHTML = provHtml; tr.appendChild(tdProv);
    const tdCode = document.createElement('td'); tdCode.innerText = route.code || ''; tr.appendChild(tdCode);
    const tdArea = document.createElement('td'); tdArea.style.textAlign = 'left'; tdArea.innerText = route.area || ''; tr.appendChild(tdArea);
    const tdTime = document.createElement('td'); tdTime.innerText = route.time || route.deliveryTime || ''; tr.appendChild(tdTime);
    const tdMin = document.createElement('td'); tdMin.style.fontWeight = 'bold'; tdMin.style.color = '#1B75BB'; tdMin.innerText = fMoney(route.min); tr.appendChild(tdMin);

    if (route.prices) {
      route.prices.forEach((p) => { const td = document.createElement('td'); td.innerText = fMoney(p); tr.appendChild(td); });
    } else {
      for(let i=0; i<pkgData.weightTiers.length; i++) { const td = document.createElement('td'); td.innerText='0'; tr.appendChild(td); }
    }
    table.appendChild(tr);
  });`;

if (code.includes('if (confirm(\\'Xóa tuyến này?\\'))')) {
  code = code.replace(oldLoop, newLoop);
  fs.writeFileSync('d:/Downloads/BAO GIA/app/admin.js', code);
  console.log('SUCCESS: Injected history modals logic into admin.js using exact string replacement');
} else {
  console.log('Already replaced or loop not found.');
}
