let currentTab = 'g1';
let currentRegion = 'vung1';
let currentUserRole = null; // 'admin' (xem) or 'boss' (sửa)

const TABS = [
  { id: 'g1', label: 'G1 - Đúng Giờ', icon: '🚀' },
  { id: 'g2', label: 'G2 - Đảm Bảo', icon: '🛡️' },
  { id: 'g3', label: 'G3 - Tiết Kiệm', icon: '💰' },
  { id: 'g4', label: 'G4 - Bao Xe', icon: '🚛' },
  { id: 'delivery', label: 'Phí Giao Nhận', icon: '📍' },
  { id: 'surcharges', label: 'Phụ Phí Chung', icon: '⚙️' },
];

// ================= LOAD & INIT =================
async function loadData() {
  try {
    const { data, error } = await supabase.from('configs').select('data').eq('id', 1).single();
    if (error) throw error;
    if (data && data.data) {
      PRICING_DATA = data.data;
    }
  } catch (err) {
    console.warn("Dùng dữ liệu file mẫu do lỗi Cloud hoặc bảng trống.");
  }
  renderUI();
}

function renderUI() {
  renderSidebar();

  const hideToolbar = ['delivery', 'surcharges'].includes(currentTab);
  document.getElementById('pageToolbar').style.display = hideToolbar ? 'none' : 'block';

  if (!hideToolbar) {
    if (currentTab === 'g4') {
      document.getElementById('filterBar').style.display = 'none';
      document.querySelector('.btn-add-route').innerText = '⊕ Thêm loại xe';
    } else {
      document.getElementById('filterBar').style.display = 'flex';
      document.querySelector('.btn-add-route').innerText = '⊕ Thêm tuyến đường mới';
    }
  }

  renderContent();
}

function renderSidebar() {
  const menu = document.getElementById('navMenu');
  menu.innerHTML = TABS.map(tab => `
    <li class="nav-item ${currentTab === tab.id ? 'active' : ''}" onclick="switchTab('${tab.id}')">
      <span class="icon">${tab.icon}</span> <span>${tab.label}</span>
    </li>
  `).join('');
}

function switchTab(tabId) {
  currentTab = tabId;
  const si = document.getElementById('searchInput');
  if (si) si.value = '';
  const fz = document.getElementById('filterZone');
  if (fz) fz.value = '';
  renderUI();
}

// Region tab click handlers
document.querySelectorAll('.region-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.region-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    currentRegion = e.target.dataset.region;
    renderContent();
  });
});

// Add route / vehicle
window.addRouteConfig = function() {
  if (['g1', 'g2', 'g3'].includes(currentTab)) {
    openRouteModal(-1);
    return;
  } else if (currentTab === 'g4') {
    openG4Modal(-1);
    return;
  }
  renderContent();
};

// ================= RENDER =================
function renderContent() {
  const container = document.getElementById('tableContainer');
  container.innerHTML = '';

  if (['g1', 'g2', 'g3'].includes(currentTab)) {
    renderStandardPackageTable(container, currentTab, currentRegion);
  } else if (currentTab === 'g4') {
    renderG4Table(container, currentRegion);
  } else if (currentTab === 'delivery') {
    renderDeliveryTable(container);
  } else if (currentTab === 'surcharges') {
    renderSurcharges(container);
  }
}

// Format tiền
function fMoney(num) {
  if (!num && num !== 0) return '0';
  return new Intl.NumberFormat('vi-VN').format(num);
}

function createInput(obj, key, isNumber, leftAlign) {
  const input = document.createElement('input');
  input.type = 'text';
  input.className = `cell-input ${isNumber ? 'number' : ''} ${leftAlign ? 'left' : ''}`;

  if (isNumber) {
    input.value = obj[key] ? fMoney(obj[key]) : '0';
  } else {
    input.value = obj[key] !== undefined ? obj[key] : '';
  }

  input.addEventListener('change', (e) => {
    let val = e.target.value;
    if (isNumber) {
      val = val.replace(/[^0-9.\-]+/g, "");
      val = parseFloat(val) || 0;
      input.value = fMoney(val);
    }
    obj[key] = val;
  });
  return input;
}

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
};


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

// ===== Bảng G1, G2, G3 =====
function renderStandardPackageTable(container, pkgId, regionId) {
  const pkgData = PRICING_DATA[pkgId][regionId];
  if (!pkgData) { container.innerHTML = '<p style="color:#94a3b8;text-align:center;">Không có dữ liệu cho vùng này.</p>'; return; }

  const searchTerm = (document.getElementById('searchInput')?.value || '').toLowerCase();
  const filterZone = document.getElementById('filterZone')?.value || '';

  const table = document.createElement('table');
  table.className = 'data-table';

  // Header
  const trHead = document.createElement('tr');
  const theads = ['Gỡ', 'Vùng', 'Tỉnh', 'Mã', 'Khu vực', 'TG Giao', 'Phí Min', ...pkgData.weightTiers];
  theads.forEach(thTxt => {
    const th = document.createElement('th');
    th.innerText = thTxt;
    trHead.appendChild(th);
  });
  table.appendChild(trHead);

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

    // Actions
    const tdAct = document.createElement('td');
    tdAct.style.whiteSpace = 'nowrap';
    const authDisabled = currentUserRole !== 'boss' ? 'disabled' : '';
    const authStyle = currentUserRole !== 'boss' ? 'display:none;' : '';
    
    if (!isInactive) {
      tdAct.innerHTML = `<button class="btn btn-outline" style="padding:4px 8px; font-size:12px; margin-right:4px; ${authStyle}" onclick="openRouteModal(${idx})">✏️ Sửa</button>
                         <button class="btn btn-remove" style="${authStyle} padding:4px 8px;" onclick="openDeleteModal(${idx})">✖</button>`;
    } else {
      tdAct.innerHTML = `<span style="font-size:11px; color:#ef4444; font-weight:bold; background:#fee2e2; padding:2px 6px; border-radius:4px;">Đã Ngừng<br>(${route.endDate || 'N/A'})</span>`;
    }
    tr.appendChild(tdAct);

    // Texts instead of inputs
    const tdZone = document.createElement('td'); tdZone.innerText = route.zone || ''; tr.appendChild(tdZone);
    const tdProv = document.createElement('td'); tdProv.style.textAlign = 'left'; tdProv.style.fontWeight = '500';
    let provHtml = route.province || '';
    if (route.effectiveDate && !isInactive) provHtml += `<br><span style="font-size:10px; color:#10b981; background:#d1fae5; padding:2px 4px; border-radius:4px;">Từ: ${route.effectiveDate}</span>`;
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
  });

  container.appendChild(table);
}

// ===== Bảng G4 =====
function renderG4Table(container, regionId) {
  const pkgData = PRICING_DATA.g4[regionId];
  if (!pkgData) { container.innerHTML = '<p style="color:#94a3b8;text-align:center;">Không có dữ liệu.</p>'; return; }

  const table = document.createElement('table');
  table.className = 'data-table';

  const trHead = document.createElement('tr');
  const theads = ['Gỡ', 'ID', 'Loại xe', 'Kích thước', 'TG Bốc', 'Base (10km)', ...pkgData.kmTiers.slice(1), 'Phí Chờ', 'Thêm Điểm'];
  theads.forEach(t => { const th = document.createElement('th'); th.innerText = t; trHead.appendChild(th); });
  table.appendChild(trHead);

  pkgData.vehicles.forEach((v, idx) => {
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
      tdAct.innerHTML = `<button class="btn btn-outline" style="padding:4px 8px; font-size:12px; margin-right:4px; ${authStyle}" onclick="openG4Modal(${idx})">✏️ Sửa</button>
                         <button class="btn btn-remove" style="${authStyle} padding:4px 8px;" onclick="openDeleteModalG4(${idx})">✖</button>`;
    } else {
      tdAct.innerHTML = `<span style="font-size:11px; color:#ef4444; font-weight:bold; background:#fee2e2; padding:2px 6px; border-radius:4px;">Đã Ngừng<br>(${v.endDate || 'N/A'})</span>`;
    }
    tr.appendChild(tdAct);

    // Text cells
    const cId = document.createElement('td'); cId.innerText = v.id || ''; tr.appendChild(cId);
    
    let nameHtml = v.name || '';
    if (v.effectiveDate && !isInactive) nameHtml += `<br><span style="font-size:10px; color:#10b981; background:#d1fae5; padding:2px 4px; border-radius:4px;">Từ: ${v.effectiveDate}</span>`;
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
  });

  container.appendChild(table);
}

// ===== Bảng Giao nhận =====
function renderDeliveryTable(container) {
  const areas = PRICING_DATA.deliveryFee.areas;
  const table = document.createElement('table');
  table.className = 'data-table';

  const trHead = document.createElement('tr');
  ['Tên', 'Khu vực', 'Xe 1T', 'Xe 2T', 'Xe 3.5T', 'Xe 5T'].forEach(t => {
    const th = document.createElement('th'); th.innerText = t; trHead.appendChild(th);
  });
  table.appendChild(trHead);

  areas.forEach((a) => {
    const tr = document.createElement('tr');
    ['name', 'area'].forEach(k => {
      const td = document.createElement('td');
      td.appendChild(createInput(a, k, false, true));
      tr.appendChild(td);
    });
    ['xe1t', 'xe2t', 'xe35t', 'xe5t'].forEach(k => {
      const td = document.createElement('td');
      td.appendChild(createInput(a.fees, k, true, false));
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });
  container.appendChild(table);
}

// ===== Phụ Phí Chung =====
function renderSurcharges(container) {
  const sur = PRICING_DATA.surcharges;
  const grid = document.createElement('div');
  grid.className = 'config-grid';

  // Cấu hình chung
  const card0 = document.createElement('div');
  card0.className = 'config-card';
  card0.innerHTML = `<h3>🗓️ Cấu hình chung</h3>
    <div class="form-group"><label>Ngày hiệu lực báo giá</label></div>
  `;
  card0.querySelectorAll('.form-group')[0].appendChild(createInput(PRICING_DATA, 'effectiveDate', false, false));
  grid.appendChild(card0);

  // Phụ phí nền
  const card1 = document.createElement('div');
  card1.className = 'config-card';
  card1.innerHTML = `<h3>⚡ Phụ phí nền</h3>
    <div class="form-group"><label>VAT (tỷ lệ, VD: 0.1 = 10%)</label></div>
    <div class="form-group"><label>Phụ phí xăng dầu (VD: 0.23 = 23%)</label></div>
    <div class="form-group"><label>Phụ phí ngoại thành (VD: 0.3 = 30%)</label></div>
  `;
  const inputs1 = card1.querySelectorAll('.form-group');
  inputs1[0].appendChild(createInput(sur, 'vat', false, false));
  inputs1[1].appendChild(createInput(sur, 'fuel', false, false));
  inputs1[2].appendChild(createInput(sur, 'suburbanExtraPercent', false, false));
  grid.appendChild(card1);

  // COD
  const codData = PRICING_DATA.specialFees.cod;
  const card2 = document.createElement('div');
  card2.className = 'config-card';
  card2.innerHTML = `<h3>💵 Thu hộ COD</h3>
    <div class="form-group"><label>Dưới 300k</label></div>
    <div class="form-group"><label>Từ 300k - 600k</label></div>
    <div class="form-group"><label>Từ 600k - 1tr</label></div>
  `;
  const inputs2 = card2.querySelectorAll('.form-group');
  inputs2[0].appendChild(createInput(codData.tiers[0], 'fee', true, false));
  inputs2[1].appendChild(createInput(codData.tiers[1], 'fee', true, false));
  inputs2[2].appendChild(createInput(codData.tiers[2], 'fee', true, false));
  grid.appendChild(card2);

  // Kiểm đếm
  const countData = PRICING_DATA.specialFees.counting;
  const card3 = document.createElement('div');
  card3.className = 'config-card';
  card3.innerHTML = `<h3>📦 Phí kiểm đếm</h3>
    <div class="form-group"><label>Phí cơ bản (đến ${countData.baseQty} SP)</label></div>
    <div class="form-group"><label>Phí mỗi SP phát sinh thêm</label></div>
  `;
  const inputs3 = card3.querySelectorAll('.form-group');
  inputs3[0].appendChild(createInput(countData, 'baseFee', true, false));
  inputs3[1].appendChild(createInput(countData, 'extraPerItem', true, false));
  grid.appendChild(card3);

  // Bảo hiểm
  const insData = PRICING_DATA.specialFees.insurance;
  const card4 = document.createElement('div');
  card4.className = 'config-card';
  card4.innerHTML = `<h3>🛡️ Bảo hiểm hàng hóa</h3>
    <div class="form-group"><label>Tỷ lệ bảo hiểm (VD: 0.0008 = 0.08%)</label></div>
  `;
  card4.querySelectorAll('.form-group')[0].appendChild(createInput(insData, 'rate', false, false));
  grid.appendChild(card4);

  container.appendChild(grid);
}

// ================= SAVE =================
async function saveData() {
  if (currentUserRole !== 'boss') {
    alert("❌ Chỉ Giám đốc mới có quyền lưu cấu hình!");
    return;
  }
  const btn = document.getElementById('btnSave');
  btn.innerText = '⏳ Đang lưu...';
  try {
    const { error } = await supabase.from('configs').upsert({ id: 1, data: PRICING_DATA });
    if (error) throw error;
    alert("✅ Đã lưu cấu hình bảng giá thành công lên hệ thống!");
  } catch (err) {
    alert("❌ Lỗi: " + err.message);
  } finally {
    btn.innerText = '💾 Lưu Bảng Giá Lên Máy Chủ';
  }
}

// ================= AUTH =================
function login() {
  const pwd = document.getElementById('authPassword').value;
  const err = document.getElementById('authError');
  if (pwd === 'admin') {
    currentUserRole = 'admin';
    document.getElementById('authOverlay').style.display = 'none';
    document.getElementById('roleBadge').style.display = 'block';
    document.getElementById('roleBadge').innerText = '👀 Quyền Xem';
    document.getElementById('roleBadge').className = 'auth-role-badge admin';
    document.getElementById('btnSave').style.display = 'none';
    const importLabel = document.querySelector('label[for="importExcelInput"]');
    if (importLabel) importLabel.style.display = 'none';
  } else if (pwd === 'boss') {
    currentUserRole = 'boss';
    document.getElementById('authOverlay').style.display = 'none';
    document.getElementById('roleBadge').style.display = 'block';
    document.getElementById('roleBadge').innerText = '👑 Giám Đốc';
    document.getElementById('roleBadge').className = 'auth-role-badge';
  } else {
    err.style.display = 'block';
  }
}

// ================= EXCEL =================
function exportExcel() {
  if (typeof XLSX === 'undefined') { alert('Thư viện Excel chưa tải xong.'); return; }
  const wb = XLSX.utils.book_new();
  ['g1', 'g2', 'g3'].forEach(pkg => {
    const sheetData = [];
    sheetData.push(["Vùng", "Tỉnh", "Khu vực", "TG Giao", "Phí Min", ...PRICING_DATA[pkg].vung1.weightTiers]);
    PRICING_DATA[pkg].vung1.routes.forEach(r => {
      sheetData.push(["Từ HCM", r.province, r.area, r.time || r.deliveryTime || "", r.min, ...r.prices]);
    });
    if (PRICING_DATA[pkg].vung2) {
      PRICING_DATA[pkg].vung2.routes.forEach(r => {
        sheetData.push(["Từ ĐN", r.province, r.area, r.time || r.deliveryTime || "", r.min, ...r.prices]);
      });
    }
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(sheetData), pkg.toUpperCase());
  });
  XLSX.writeFile(wb, `BangGia_NPV_${new Date().getTime()}.xlsx`);
}

function importExcel(e) {
  if (currentUserRole !== 'boss') { alert("❌ Chỉ Giám đốc thao tác!"); e.target.value = ""; return; }
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const g1Sheet = workbook.Sheets['G1'];
      if (g1Sheet) {
        const json = XLSX.utils.sheet_to_json(g1Sheet, { header: 1 });
        let newRoutesVung1 = [], newRoutesVung2 = [];
        for (let i = 1; i < json.length; i++) {
          let row = json[i];
          if (!row || row.length < 5) continue;
          let rData = {
            zone: row[0]?.toString().includes('HCM') ? 1 : 2,
            province: row[1], code: "", area: row[2] || "",
            deliveryTime: row[3] || "", min: parseFloat(row[4]) || 0,
            prices: row.slice(5).map(v => parseFloat(v) || 0)
          };
          if (rData.zone === 1) newRoutesVung1.push(rData);
          else newRoutesVung2.push(rData);
        }
        if (newRoutesVung1.length) PRICING_DATA.g1.vung1.routes = newRoutesVung1;
        if (newRoutesVung2.length && PRICING_DATA.g1.vung2) PRICING_DATA.g1.vung2.routes = newRoutesVung2;
      }
      alert("✅ Nhập cấu hình thành công tạm thời. Hãy ấn 'Lưu Bảng Giá' để áp dụng!");
      renderContent();
    } catch (err) { alert("❌ Lỗi đọc file: " + err.message); }
  };
  reader.readAsArrayBuffer(file);
  e.target.value = "";
}

document.addEventListener('DOMContentLoaded', loadData);
