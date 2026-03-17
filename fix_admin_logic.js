const fs = require('fs');
let code = fs.readFileSync('d:/Downloads/BAO GIA/app/admin.js', 'utf8');

// We need to inject the logic for opening and saving modals, and rendering the status badge

const injectionHTML = \`
// ================= ROUTE HISTORY MODALS =================
window.openRouteModal = function(idx = -1) {
  const modal = document.getElementById('routeModal');
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
  document.getElementById('routeModal').style.display = 'none';
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
    // Soft Delete old version: set status inactive & endDate
    const oldRoute = pkgData.routes[idx];
    oldRoute.status = 'inactive';
    oldRoute.endDate = effDate;
    
    // Insert new version right after old
    pkgData.routes.splice(idx, 0, newRoute);
  } else {
    // Add new
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
\`;

if (!code.includes('openRouteModal')) {
   code += '\\n\\n' + injectionHTML;
}

// Ensure the Add Route button opens the modal instead of creating empty objects directly
code = code.replace(
  /if \(\['g1', 'g2', 'g3'\].includes\(currentTab\)\) \{\s*const pkgData = PRICING_DATA\[currentTab\]\[currentRegion\];\s*if \(\!pkgData\) return;\s*pkgData\.routes\.unshift\([\s\S]*?\}\);?\s*\}/,
  \`if (['g1', 'g2', 'g3'].includes(currentTab)) {
    openRouteModal(-1);
    return;
  }\`
);


// Rewrite renderStandardPackageTable's row loop to use text and buttons instead of raw inputs
const renderRegex = /pkgData\.routes\.forEach\(\(route, idx\) => \{[\s\S]*?table\.appendChild\(tr\);\s*\}\);/;

const newRenderHTML = \`
  pkgData.routes.forEach((route, idx) => {
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

    // Actions: Edit / Delete
    const tdAct = document.createElement('td');
    tdAct.style.whiteSpace = 'nowrap';
    const authDisabled = currentUserRole !== 'boss' ? 'disabled' : '';
    const authStyle = currentUserRole !== 'boss' ? 'display:none;' : '';
    
    if (!isInactive) {
      tdAct.innerHTML = \\`<button class="btn btn-outline" style="padding:4px 8px; font-size:12px; margin-right:4px; \${authStyle}" onclick="openRouteModal(\${idx})">✏️ Sửa</button>
                         <button class="btn btn-remove" style="\${authStyle} padding:4px 8px;" onclick="openDeleteModal(\${idx})">✖</button>\\`;
    } else {
      tdAct.innerHTML = \\`<span style="font-size:11px; color:#ef4444; font-weight:bold; background:#fee2e2; padding:2px 6px; border-radius:4px;">Đã Ngừng<br>(\${route.endDate || 'N/A'})</span>\\`;
    }
    tr.appendChild(tdAct);

    // Zone
    const tdZone = document.createElement('td');
    tdZone.innerText = route.zone || '';
    tr.appendChild(tdZone);

    // Province (with effective date badge if any)
    const tdProv = document.createElement('td');
    tdProv.style.textAlign = 'left';
    tdProv.style.fontWeight = '500';
    let provHtml = route.province || '';
    if (route.effectiveDate && !isInactive) {
      provHtml += \\`<br><span style="font-size:10px; color:#10b981; background:#d1fae5; padding:2px 4px; border-radius:4px; font-weight:normal;">Từ: \${route.effectiveDate}</span>\\`;
    }
    tdProv.innerHTML = provHtml;
    tr.appendChild(tdProv);

    // Code
    const tdCode = document.createElement('td');
    tdCode.innerText = route.code || '';
    tr.appendChild(tdCode);

    // Area
    const tdArea = document.createElement('td');
    tdArea.style.textAlign = 'left';
    tdArea.innerText = route.area || '';
    tr.appendChild(tdArea);

    // Delivery time
    const tdTime = document.createElement('td');
    tdTime.innerText = route.time || route.deliveryTime || '';
    tr.appendChild(tdTime);

    // Min price
    const tdMin = document.createElement('td');
    tdMin.style.fontWeight = 'bold';
    tdMin.style.color = '#1B75BB';
    tdMin.innerText = fMoney(route.min);
    tr.appendChild(tdMin);

    // Price tiers
    if (route.prices) {
      route.prices.forEach((p) => {
        const td = document.createElement('td');
        td.innerText = fMoney(p);
        tr.appendChild(td);
      });
    } else {
        // Fallback if missing
        for(let i=0; i<pkgData.weightTiers.length; i++) {
           const td = document.createElement('td'); td.innerText='0'; tr.appendChild(td);
        }
    }

    table.appendChild(tr);
  });
\`;

code = code.replace(renderRegex, newRenderHTML);

fs.writeFileSync('d:/Downloads/BAO GIA/app/admin.js', code);
console.log('SUCCESS: Injected history modals logic and replaced table rendering');
