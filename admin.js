let currentTab = 'g1';
let currentRegion = 'vung1';

const TABS = [
  { id: 'g1', label: '🚀 G1 - Đúng Giờ' },
  { id: 'g2', label: '🛡️ G2 - Đảm Bảo' },
  { id: 'g3', label: '💰 G3 - Tiết Kiệm' },
  { id: 'g4', label: '🚛 G4 - Bao Xe' },
  { id: 'delivery', label: '📍 Phí Giao Nhận' },
  { id: 'surcharges', label: '⚙️ Phụ Phí Chung' },
];

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
  renderContent();
}

function renderSidebar() {
  const menu = document.getElementById('navMenu');
  menu.innerHTML = TABS.map(tab => `
    <li class="nav-item ${currentTab === tab.id ? 'active' : ''}" onclick="switchTab('${tab.id}')">
      ${tab.label}
    </li>
  `).join('');
}

function switchTab(tabId) {
  currentTab = tabId;
  const hideRegion = ['delivery', 'surcharges'].includes(tabId);
  document.getElementById('regionTabs').style.display = hideRegion ? 'none' : 'flex';
  renderUI();
}

document.querySelectorAll('.region-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.region-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    currentRegion = e.target.dataset.region;
    renderContent();
  });
});

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

// ================= RENDER LOGICS =================

// Hàm helper để tạo input gắn reference trực tiếp đến Object Data
function createInput(obj, key, isNumber = false) {
  const input = document.createElement('input');
  input.type = isNumber ? 'text' : 'text'; // dùng text để dễ gõ hơn, parse sau
  input.className = `cell-input ${isNumber ? 'number' : ''}`;
  input.value = obj[key] !== undefined ? obj[key] : '';
  
  input.addEventListener('change', (e) => {
    let val = e.target.value;
    if (isNumber) {
      val = parseFloat(val) || 0;
    }
    obj[key] = val;
  });
  return input;
}

// Bảng G1, G2, G3
function renderStandardPackageTable(container, pkgId, regionId) {
  const pkgData = PRICING_DATA[pkgId][regionId];
  if (!pkgData) return;

  const btnAdd = document.createElement('button');
  btnAdd.className = 'btn btn-add';
  btnAdd.innerText = '➕ Thêm tuyến đường mới';
  btnAdd.onclick = () => {
    pkgData.routes.push({
      zone: 1, province: "Tỉnh Mới", code: "NEW", area: "", deliveryTime: "", min: 0,
      prices: new Array(pkgData.weightTiers.length).fill(0)
    });
    renderContent();
  };
  container.appendChild(btnAdd);

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

  // Rows
  pkgData.routes.forEach((route, idx) => {
    const tr = document.createElement('tr');
    
    // Del btn
    const tdDel = document.createElement('td');
    const btnDel = document.createElement('button');
    btnDel.className = 'btn-remove'; btnDel.innerText = '×';
    btnDel.onclick = () => { if(confirm('Xóa tuyến này?')) { pkgData.routes.splice(idx, 1); renderContent(); } };
    tdDel.appendChild(btnDel);
    tr.appendChild(tdDel);

    ['zone', 'province', 'code', 'area'].forEach(k => {
      const td = document.createElement('td');
      td.appendChild(createInput(route, k, k==='zone'));
      tr.appendChild(td);
    });

    const timeKey = route.time !== undefined ? 'time' : 'deliveryTime';
    const tdTime = document.createElement('td');
    tdTime.appendChild(createInput(route, timeKey));
    tr.appendChild(tdTime);

    const tdMin = document.createElement('td');
    tdMin.appendChild(createInput(route, 'min', true));
    tr.appendChild(tdMin);

    route.prices.forEach((p, pIdx) => {
      const td = document.createElement('td');
      const inp = document.createElement('input');
      inp.className = 'cell-input number';
      inp.value = p;
      inp.addEventListener('change', (e) => { route.prices[pIdx] = parseFloat(e.target.value) || 0; });
      td.appendChild(inp);
      tr.appendChild(td);
    });

    table.appendChild(tr);
  });
  
  container.appendChild(table);
}

// Bảng G4 Bao xe
function renderG4Table(container, regionId) {
  const pkgData = PRICING_DATA.g4[regionId];
  if (!pkgData) return;

  const btnAdd = document.createElement('button');
  btnAdd.className = 'btn btn-add';
  btnAdd.innerText = '➕ Thêm loại xe';
  btnAdd.onclick = () => {
    const newId = (pkgData.vehicles[pkgData.vehicles.length-1]?.id || 0) + 1;
    pkgData.vehicles.push({
      id: newId, name: "Xe mới", size: "", loadTime: "60 phút", basePrice: 0,
       kmPrices: [0,0,0,0,0,0], waitFee: 0, extraPoint: 0
    });
    renderContent();
  };
  container.appendChild(btnAdd);

  const table = document.createElement('table');
  table.className = 'data-table';
  
  const trHead = document.createElement('tr');
  const theads = ['Gỡ', 'ID', 'Loại xe', 'Kích thước', 'TG Bốc', 'Base Price (10km)', ...pkgData.kmTiers.slice(1), 'Phí Chờ', 'Phí Thêm Điểm'];
  theads.forEach(t => { const th = document.createElement('th'); th.innerText = t; trHead.appendChild(th); });
  table.appendChild(trHead);

  pkgData.vehicles.forEach((v, idx) => {
    const tr = document.createElement('tr');
    
    const tdDel = document.createElement('td');
    const btnDel = document.createElement('button');
    btnDel.className = 'btn-remove'; btnDel.innerText = '×';
    btnDel.onclick = () => { if(confirm('Xóa xe này?')) { pkgData.vehicles.splice(idx, 1); renderContent(); } };
    tdDel.appendChild(btnDel);
    tr.appendChild(tdDel);

    ['id', 'name', 'size', 'loadTime', 'basePrice'].forEach(k => {
      const td = document.createElement('td');
      td.appendChild(createInput(v, k, ['id','basePrice'].includes(k)));
      tr.appendChild(td);
    });

    // skip index 0
    for(let i=1; i<v.kmPrices.length; i++) {
        const td = document.createElement('td');
        const inp = document.createElement('input');
        inp.className = 'cell-input number';
        inp.value = v.kmPrices[i];
        inp.addEventListener('change', (e) => { v.kmPrices[i] = parseFloat(e.target.value) || 0; });
        td.appendChild(inp);
        tr.appendChild(td);
    }

    ['waitFee', 'extraPoint'].forEach(k => {
      const td = document.createElement('td');
      td.appendChild(createInput(v, k, true));
      tr.appendChild(td);
    });

    table.appendChild(tr);
  });
  
  container.appendChild(table);
}

// Bảng Giao nhận
function renderDeliveryTable(container) {
  const areas = PRICING_DATA.deliveryFee.areas;
  const table = document.createElement('table');
  table.className = 'data-table';
  
  const trHead = document.createElement('tr');
  const theads = ['Tên', 'Khu vực', 'Xe 1T', 'Xe 2T', 'Xe 3.5T', 'Xe 5T'];
  theads.forEach(t => { const th = document.createElement('th'); th.innerText = t; trHead.appendChild(th); });
  table.appendChild(trHead);

  areas.forEach((a) => {
    const tr = document.createElement('tr');
    
    ['name', 'area'].forEach(k => {
      const td = document.createElement('td');
      td.appendChild(createInput(a, k));
      tr.appendChild(td);
    });

    ['xe1t', 'xe2t', 'xe35t', 'xe5t'].forEach(k => {
      const td = document.createElement('td');
      td.appendChild(createInput(a.fees, k, true));
      tr.appendChild(td);
    });

    table.appendChild(tr);
  });
  container.appendChild(table);
}

// Cấu hình chung
function renderSurcharges(container) {
  const sur = PRICING_DATA.surcharges;
  const grid = document.createElement('div');
  grid.className = 'config-grid';

  const card1 = document.createElement('div');
  card1.className = 'config-card';
  card1.innerHTML = `<h3>Phụ phí nền</h3>
    <div class="form-group"><label>VAT (%)</label></div>
    <div class="form-group"><label>Phụ phí xăng dầu (%)</label></div>
    <div class="form-group"><label>Phụ phí quá khổ (%)</label></div>
    <div class="form-group"><label>Phụ phí hóa chất (%)</label></div>
  `;
  const inputs1 = card1.querySelectorAll('.form-group');
  inputs1[0].appendChild(createInput(sur, 'vat', true));
  inputs1[1].appendChild(createInput(sur, 'fuel', true));
  // These are usually nested in notes, let's keep it simple and just do the global ones
  grid.appendChild(card1);

  container.appendChild(grid);
}

// ================= LƯU DATA =================
async function saveData() {
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

document.addEventListener('DOMContentLoaded', loadData);
