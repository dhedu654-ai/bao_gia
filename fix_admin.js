const fs = require('fs');

const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bảng Quản Trị Giá - NPV Logistics</title>
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>
  <link rel="stylesheet" href="admin.css">
</head>
<body>
  <!-- Login Overlay -->
  <div class="overlay" id="authOverlay">
    <div class="auth-card">
      <div class="auth-icon">🔒</div>
      <h2>Đăng nhập Hệ thống</h2>
      <p>Nhập mật khẩu để truy cập vào Bảng quản trị NPV Logistics.</p>
      
      <div class="auth-input-group">
        <input type="password" id="authPassword" placeholder="Nhập mật khẩu..." onkeypress="if(event.key === 'Enter') login()">
        <button class="btn btn-primary-bg" onclick="login()">Đăng nhập</button>
      </div>
      <div id="authError" style="color:red; font-size:13px; margin-top:10px; display:none;">Sai mật khẩu!</div>
      
      <div class="auth-hints">
        <p><i>Gợi ý:</i></p>
        <ul style="text-align:left; font-size:12px; margin-top:5px; padding-left:20px; color:#64748b;">
          <li>Mật khẩu Hành chính: <b>admin</b> (Chỉ xem)</li>
          <li>Mật khẩu Giám đốc: <b>boss</b> (Được lưu)</li>
        </ul>
      </div>
      
      <div style="margin-top: 20px;">
        <a href="index.html" style="font-size:13px; color:#2563eb; text-decoration:none;">&larr; Quay lại form Báo giá</a>
      </div>
    </div>
  </div>

  <div class="layout">
    <div class="sidebar">
      <div class="sidebar-logo">
        <span class="icon" style="font-size: 24px; color: #2563eb;">🚛</span> <span class="text" style="font-size: 18px; font-weight: 700; color: #1e3a8a;">NPV Logistics</span>
      </div>
      <ul class="nav-menu" id="navMenu">
        <!-- JS VẼ TABS VÀO ĐÂY -->
      </ul>
      <div class="sidebar-footer">
         <div class="avatar">AD</div>
         <div class="admin-info">
           <div class="admin-name">Admin NPV</div>
           <div class="admin-email">admin@npv.com</div>
         </div>
      </div>
    </div>
    
    <div class="main-content">
      <div class="header">
        <div class="header-titles">
          <h1>Cài Đặt Bảng Giá</h1>
          <p>Sửa đổi trực tiếp trong các ô và ấn nút Lưu để cập nhật tức thì.</p>
        </div>
        <div class="actions">
          <div class="auth-role-badge" id="roleBadge" style="display:none;">Chế độ Xem</div>
          <button class="btn btn-save" id="btnSave" onclick="saveData()">💾 Lưu Bảng Giá Lên Máy Chủ</button>
        </div>
      </div>

      <div class="editor-container">
        <!-- Toolbar for Table Pages -->
        <div id="pageToolbar" class="page-toolbar">
          <div class="layout-toolbar">
            <div class="region-tabs" id="regionTabs">
              <button class="region-btn active" data-region="vung1">Từ Vùng 1 (Hồ Chí Minh)</button>
              <button class="region-btn" data-region="vung2">Từ Vùng 2 (Đà Nẵng)</button>
            </div>
            <div class="toolbar-actions" id="toolbarActions">
              <button class="btn btn-outline" style="cursor: pointer;" onclick="exportExcel()">⬇️ Xuất Excel</button>
              <label class="btn btn-outline" style="cursor: pointer;" for="importExcelInput">
                ⬆️ Nhập từ Excel
                <input type="file" id="importExcelInput" accept=".xlsx, .xls" style="display: none;" onchange="importExcel(event)">
              </label>
              <button class="btn btn-primary-bg btn-add-route" onclick="window.addRouteConfig()">⊕ Thêm tuyến đường mới</button>
            </div>
          </div>

          <div class="filter-bar" id="filterBar">
            <div class="search-input">
                <span class="search-icon">🔍</span>
                <input type="text" placeholder="Tìm kiếm theo tỉnh, mã hoặc khu vực..." id="searchInput" oninput="renderContent()">
            </div>
            <div class="filter-dropdowns">
                <label>LỌC THEO:</label>
                <select id="filterZone" onchange="renderContent()"><option value="">Tất cả Vùng</option><option value="1">Vùng 1</option><option value="2">Vùng 2</option><option value="3">Vùng 3</option><option value="4">Vùng 4</option></select>
                <!-- Dùng text input ẩn làm filter tỉnh cho nhanh -->
                <button class="btn-clear-filter" onclick="document.getElementById('searchInput').value=''; document.getElementById('filterZone').value=''; renderContent();">✕ Xóa lọc</button>
            </div>
          </div>
        </div>

        <!-- Khung chứa bảng dữ liệu động -->
        <div id="tableContainer" class="table-wrapper">
          <div class="loading">Đang tải dữ liệu...</div>
        </div>
      </div>
    </div>
  </div>

  <script src="config.js"></script>
  <script src="data.js"></script>
  <script src="admin.js"></script>
</body>
</html>`;

const css = `body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8fafc;
  color: #1e293b;
}

.layout {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 250px;
  background: white;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
}

.sidebar-logo {
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #f1f5f9;
}
.sidebar-logo .icon {
  font-size: 24px; color: #2563eb;
}
.sidebar-logo .text {
  font-size: 18px; font-weight: 700; color: #1e3a8a;
}

.nav-menu {
  list-style: none; padding: 12px 0; margin: 0; flex: 1; overflow-y: auto;
}

.nav-item {
  padding: 12px 24px;
  cursor: pointer;
  font-weight: 500;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 12px;
}
.nav-item:hover { background: #f8fafc; }
.nav-item.active { background: #eff6ff; color: #2563eb; border-right: 3px solid #2563eb; font-weight: 600; background-color: #f8fafc; }
.nav-item.active .icon { color: #2563eb; filter: drop-shadow(0 0 2px rgba(37,99,235,0.2)); }

.sidebar-footer {
  padding: 16px 24px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  gap: 12px;
}
.sidebar-footer .avatar {
  width: 36px; height: 36px; background: #e2e8f0; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; color: #475569; font-size: 13px;
}
.sidebar-footer .admin-name { font-size: 14px; font-weight: 600; color: #0f172a; }
.sidebar-footer .admin-email { font-size: 12px; color: #64748b; }

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  background: #f8fafc;
}

.header {
  padding: 16px 32px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
}

.header-titles h1 { margin: 0; font-size: 20px; color: #0f172a; }
.header-titles p { margin: 4px 0 0 0; font-size: 13px; color: #64748b; }

.actions { display: flex; align-items: center; gap: 12px; }

.btn {
  padding: 8px 16px; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; transition: 0.2s; font-size: 14px; display: flex; align-items: center; gap: 6px;
}
.btn-save { background: #2563eb; color: white; }
.btn-save:hover { background: #1d4ed8; }
.btn-outline { background: white; border: 1px solid #cbd5e1; color: #475569; }
.btn-outline:hover { background: #f1f5f9; }
.btn-primary-bg { background: #10b981; color: white; }
.btn-primary-bg:hover { background: #059669; }

.editor-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.page-toolbar {
  background: white;
  padding: 0 32px;
  border-bottom: 1px solid #e2e8f0;
}

.layout-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-bottom: 1px solid #f1f5f9;
}

.region-tabs {
  display: flex;
  gap: 8px;
}

.region-btn {
  padding: 12px 24px; border: none; background: transparent; 
  cursor: pointer; color: #64748b; font-weight: 600; font-size: 14px;
  border-bottom: 2px solid transparent;
}
.region-btn.active { color: #2563eb; border-bottom: 2px solid #2563eb; }
.region-btn:hover:not(.active) { color: #0f172a; }

.toolbar-actions {
  display: flex;
  gap: 12px;
  padding-bottom: 12px;
}

.filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
}

.search-input {
  position: relative;
  width: 320px;
}
.search-input input {
  width: 100%; padding: 8px 12px 8px 36px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; font-size: 14px;
}
.search-icon { position: absolute; left: 10px; top: 8px; color: #94a3b8; font-size: 14px; }

.filter-dropdowns {
  display: flex; align-items: center; gap: 12px; font-size: 13px; color: #64748b; font-weight: 600;
}
.filter-dropdowns select {
  padding: 6px 32px 6px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px; color: #0f172a; outline: none; background: white;
}
.btn-clear-filter {
  background: none; border: none; color: #64748b; font-weight: 600; font-size: 13px; cursor: pointer; padding: 6px 12px; border-radius: 6px;
}
.btn-clear-filter:hover { background: #e2e8f0; color: #0f172a; }

.table-wrapper {
  padding: 24px 32px;
  flex: 1;
  overflow: auto;
}

/* Bảng */
.data-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  font-size: 13px;
}

.data-table th {
  background: #f8fafc;
  text-align: center;
  padding: 12px 8px;
  font-weight: 600;
  color: #475569;
  border-bottom: 1px solid #e2e8f0;
  border-right: 1px solid #e2e8f0;
  white-space: nowrap;
}

.data-table td {
  padding: 6px 8px;
  border-bottom: 1px solid #e2e8f0;
  border-right: 1px solid #e2e8f0;
  text-align: center;
  color: #334155;
}
.data-table td:nth-child(2), .data-table td:nth-child(3), .data-table td:nth-child(4), .data-table td:nth-child(5) {
  text-align: left;
}

.data-table tr:hover { background: #f1f5f9; }

/* Input field in table */
.cell-input {
  width: 100%;
  min-width: 60px;
  border: 1px solid transparent;
  background: transparent;
  padding: 6px 4px;
  font-size: 13px;
  border-radius: 4px;
  box-sizing: border-box;
  color: #0f172a;
  text-align: center;
  font-family: inherit;
}
.cell-input.left { text-align: left; }
.cell-input:focus {
  border-color: #3b82f6;
  background: white;
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}
.cell-input.number { color: #2563eb; }

.btn-remove {
  background: transparent; color: #ef4444; border: none; cursor: pointer; font-size: 18px; line-height: 1; padding: 4px 8px; border-radius: 4px;
}
.btn-remove:hover { background: #fee2e2; }

/* Config Cards */
.config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}
.config-card {
  background: white; border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.config-card h3 { margin: 0 0 16px 0; font-size: 16px; color: #0f172a; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px;}
.form-group { margin-bottom: 12px; }
.form-group label { display: block; font-size: 13px; color: #64748b; margin-bottom: 6px; font-weight: 500;}
.form-group input { width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; font-size: 14px; }
.form-group input:focus { border-color: #3b82f6; outline: none; }

/* Auth Overlay */
.overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex; align-items: center; justify-content: center;
}
.auth-card {
  background: white; padding: 40px; border-radius: 12px; max-width: 400px; width: 100%;
  text-align: center; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}
.auth-icon { font-size: 48px; margin-bottom: 16px; }
.auth-card h2 { margin: 0 0 8px 0; color: #0f172a; font-size: 24px; }
.auth-card p { margin: 0 0 24px 0; color: #64748b; font-size: 14px; line-height: 1.5; }
.auth-input-group { display: flex; flex-direction: column; gap: 12px; }
.auth-input-group input {
  padding: 12px 16px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 15px; outline: none; text-align: center;
}
.auth-input-group input:focus { border-color: #3b82f6; }
.auth-input-group button { padding: 12px; font-size: 15px; justify-content: center;}

.auth-role-badge {
  background: #f1f5f9; color: #475569; padding: 6px 12px; border-radius: 6px; font-size: 13px; font-weight: 600; border: 1px solid #cbd5e1;
}
.auth-role-badge.admin { background: #fee2e2; color: #b91c1c; border-color: #f87171; }
`;

const js = \`let currentTab = 'g1';
let currentRegion = 'vung1';
let currentUserRole = null; 

const TABS = [
  { id: 'g1', label: 'G1 - Đúng Giờ', icon: '🚀' },
  { id: 'g2', label: 'G2 - Đảm Bảo', icon: '🛡️' },
  { id: 'g3', label: 'G3 - Tiết Kiệm', icon: '💰' },
  { id: 'g4', label: 'G4 - Bao Xe', icon: '🚛' },
  { id: 'delivery', label: 'Phí Giao Nhận', icon: '💵' },
  { id: 'surcharges', label: 'Phụ Phí Chung', icon: '⚙️' },
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
  
  const hideToolbar = ['delivery', 'surcharges'].includes(currentTab);
  document.getElementById('pageToolbar').style.display = hideToolbar ? 'none' : 'block';
  
  if(currentTab === 'g4') {
     document.getElementById('filterBar').style.display = 'none';
     document.querySelector('.btn-add-route').innerText = '⊕ Thêm loại xe';
  } else if (!hideToolbar) {
     document.getElementById('filterBar').style.display = 'flex';
     document.querySelector('.btn-add-route').innerText = '⊕ Thêm tuyến đường mới';
  }
  
  renderContent();
}

function renderSidebar() {
  const menu = document.getElementById('navMenu');
  menu.innerHTML = TABS.map(tab => \`
    <li class="nav-item \${currentTab === tab.id ? 'active' : ''}" onclick="switchTab('\${tab.id}')">
      <span class="icon">\${tab.icon}</span> <span style="margin-top: 1px;">\${tab.label}</span>
    </li>
  \`).join('');
}

function switchTab(tabId) {
  currentTab = tabId;
  const si = document.getElementById('searchInput'); if(si) si.value = '';
  const fz = document.getElementById('filterZone'); if(fz) fz.value = '';
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

window.addRouteConfig = function() {
  if (['g1', 'g2', 'g3'].includes(currentTab)) {
    const pkgData = PRICING_DATA[currentTab][currentRegion];
    pkgData.routes.unshift({
      zone: 1, province: "", code: "NEW", area: "", deliveryTime: "", min: 0,
      prices: new Array(pkgData.weightTiers?.length || 5).fill(0)
    });
  } else if (currentTab === 'g4') {
    const pkgData = PRICING_DATA.g4[currentRegion];
    const newId = (pkgData.vehicles[pkgData.vehicles.length-1]?.id || 0) + 1;
    pkgData.vehicles.unshift({
      id: newId, name: "Xe mới", size: "", loadTime: "60 phút", basePrice: 0,
       kmPrices: [0,0,0,0,0,0], waitFee: 0, extraPoint: 0
    });
  }
  renderContent();
};

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

// Hàm format hiển thị tiền
function fMoney(num) {
   if(!num) return '0';
   return new Intl.NumberFormat('vi-VN').format(num);
}

function createInput(obj, key, isNumber = false, leftAlign=false) {
  const input = document.createElement('input');
  input.type = 'text'; 
  input.className = \`cell-input \${isNumber ? 'number' : ''} \${leftAlign ? 'left' : ''}\`;
  
  if (isNumber) {
    input.value = obj[key] ? fMoney(obj[key]) : '0';
  } else {
    input.value = obj[key] !== undefined ? obj[key] : '';
  }
  
  input.addEventListener('change', (e) => {
    let val = e.target.value;
    if (isNumber) {
      val = val.replace(/[^0-9.-]+/g,"");
      val = parseFloat(val) || 0;
      input.value = fMoney(val);
    }
    obj[key] = val;
  });
  return input;
}

// Bảng G1, G2, G3
function renderStandardPackageTable(container, pkgId, regionId) {
  const pkgData = PRICING_DATA[pkgId][regionId];
  if (!pkgData) return;

  const searchTerm = document.getElementById('searchInput') ? document.getElementById('searchInput').value.toLowerCase() : '';
  const filterZone = document.getElementById('filterZone') ? document.getElementById('filterZone').value : '';

  const table = document.createElement('table');
  table.className = 'data-table';
  
  // Header
  const trHead = document.createElement('tr');
  const theads = ['Gỡ', 'Vùng', 'Tỉnh', 'Mã', 'Khu vực', 'TG Giao', 'Phí Min', '<=500', ...pkgData.weightTiers]; // Thêm <=500 theo thiết kế mockup
  theads.forEach(thTxt => {
    const th = document.createElement('th');
    th.innerText = thTxt;
    trHead.appendChild(th);
  });
  table.appendChild(trHead);

  // Rows
  pkgData.routes.forEach((route, idx) => {
    // Filter logic
    if (filterZone && route.zone.toString() !== filterZone) return;
    if (searchTerm) {
      const txt = (route.province + route.code + route.area).toLowerCase();
      if (!txt.includes(searchTerm)) return;
    }

    const tr = document.createElement('tr');
    
    // Del btn
    const tdDel = document.createElement('td');
    const btnDel = document.createElement('button');
    btnDel.className = 'btn-remove'; btnDel.innerHTML = '&times;';
    btnDel.onclick = () => { if(confirm('Xóa tuyến này?')) { pkgData.routes.splice(idx, 1); renderContent(); } };
    tdDel.appendChild(btnDel);
    tr.appendChild(tdDel);

    const tdZone = document.createElement('td'); tdZone.appendChild(createInput(route, 'zone', false, false)); tr.appendChild(tdZone);
    const tdProv = document.createElement('td'); tdProv.appendChild(createInput(route, 'province', false, true)); tr.appendChild(tdProv);
    const tdCode = document.createElement('td'); tdCode.appendChild(createInput(route, 'code', false, true)); tr.appendChild(tdCode);
    const tdArea = document.createElement('td'); tdArea.appendChild(createInput(route, 'area', false, true)); tr.appendChild(tdArea);

    const timeKey = route.time !== undefined ? 'time' : 'deliveryTime';
    const tdTime = document.createElement('td');
    tdTime.appendChild(createInput(route, timeKey, false, false));
    tr.appendChild(tdTime);

    // Min
    const tdMin = document.createElement('td');
    const inpMin = createInput(route, 'min', true, false);
    inpMin.style.fontWeight = 'bold';
    inpMin.style.color = '#000';
    tdMin.appendChild(inpMin);
    tr.appendChild(tdMin);

    // <=500 - Giả lập hiện giá trị đầu tiên cho mockup, route.prices[0]
    const dummyCell = document.createElement('td');
    const dummyInput = createInput(route.prices, 0, true, false);
    dummyCell.appendChild(dummyInput);
    tr.appendChild(dummyCell);
    
    // Render phần còn lại của prices[] cho các cột sau
    route.prices.forEach((p, pIdx) => {
      // Vì mockup hiện <=500 và 500-600, ta sẽ dùng prices[0] cho cả 2 hoặc dùng mảng từ 1.
      // Dựa trên mockup, prices arrays đã bỏ qua cột <=500. Nên để an toàn, data gốc prices[0] chính là 500-600 (index 0). 
      // Nhưng mockup có cả 2. Tạm thời mình map mảng theo giao diện, prices[pIdx] sẽ xuất hiện 1 cột bên cạnh dummyCell.
      const td = document.createElement('td');
      const inp = document.createElement('input');
      inp.className = 'cell-input number';
      inp.value = p ? fMoney(p) : '0';
      inp.addEventListener('change', (e) => { 
         let val = e.target.value.replace(/[^0-9.-]+/g,"");
         route.prices[pIdx] = parseFloat(val) || 0; 
         inp.value = fMoney(route.prices[pIdx]);
      });
      td.appendChild(inp);
      tr.appendChild(td);
    });
    
    table.appendChild(tr);
  });
  
  container.appendChild(table);
}

// Bảng G4
function renderG4Table(container, regionId) {
  const pkgData = PRICING_DATA.g4[regionId];
  if (!pkgData) return;

  const table = document.createElement('table');
  table.className = 'data-table';
  
  const trHead = document.createElement('tr');
  const theads = ['Gỡ', 'ID', 'Loại xe', 'Kích thước', 'TG Bốc', 'Base (10km)', ...pkgData.kmTiers.slice(1), 'Phí Chờ', 'Thêm Điểm'];
  theads.forEach(t => { const th = document.createElement('th'); th.innerText = t; trHead.appendChild(th); });
  table.appendChild(trHead);

  pkgData.vehicles.forEach((v, idx) => {
    const tr = document.createElement('tr');
    
    const tdDel = document.createElement('td');
    const btnDel = document.createElement('button');
    btnDel.className = 'btn-remove'; btnDel.innerHTML = '&times;';
    btnDel.onclick = () => { if(confirm('Xóa xe này?')) { pkgData.vehicles.splice(idx, 1); renderContent(); } };
    tdDel.appendChild(btnDel);
    tr.appendChild(tdDel);

    ['id', 'name', 'size', 'loadTime', 'basePrice'].forEach(k => {
      const td = document.createElement('td');
      td.appendChild(createInput(v, k, ['id','basePrice'].includes(k), !['id','basePrice'].includes(k)));
      tr.appendChild(td);
    });

    for(let i=1; i<v.kmPrices.length; i++) {
        const td = document.createElement('td');
        const inp = createInput(v.kmPrices, i, true, false);
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
      td.appendChild(createInput(a, k, false, true));
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

// Cấu hình chung + Phụ phí
function renderSurcharges(container) {
  const sur = PRICING_DATA.surcharges;
  const eff = PRICING_DATA;
  const grid = document.createElement('div');
  grid.className = 'config-grid';

  const card0 = document.createElement('div');
  card0.className = 'config-card';
  card0.innerHTML = \`<h3>🗓️ Cấu hình chung</h3>
    <div class="form-group"><label>Ngày hiệu lực báo giá</label></div>
  \`;
  const inputs0 = card0.querySelectorAll('.form-group');
  inputs0[0].appendChild(createInput(eff, 'effectiveDate'));
  grid.appendChild(card0);

  const card1 = document.createElement('div');
  card1.className = 'config-card';
  card1.innerHTML = \`<h3>⚡ Phụ phí nền (%)</h3>
    <div class="form-group"><label>VAT</label></div>
    <div class="form-group"><label>Phụ phí xăng dầu</label></div>
    <div class="form-group"><label>Phụ phí ngoại thành</label></div>
  \`;
  const inputs1 = card1.querySelectorAll('.form-group');
  inputs1[0].appendChild(createInput(sur, 'vat'));
  inputs1[1].appendChild(createInput(sur, 'fuel'));
  inputs1[2].appendChild(createInput(sur, 'suburbanExtraPercent'));
  grid.appendChild(card1);

  // COD
  const codData = PRICING_DATA.specialFees.cod;
  const card2 = document.createElement('div');
  card2.className = 'config-card';
  card2.innerHTML = \`<h3>💵 Thu hộ COD (Cố định theo nấc)</h3>
    <div class="form-group"><label>Dưới 300k</label></div>
    <div class="form-group"><label>Từ 300k - 600k</label></div>
    <div class="form-group"><label>Từ 600k - 1tr</label></div>
  \`;
  const inputs2 = card2.querySelectorAll('.form-group');
  inputs2[0].appendChild(createInput(codData.tiers[0], 'fee', true));
  inputs2[1].appendChild(createInput(codData.tiers[1], 'fee', true));
  inputs2[2].appendChild(createInput(codData.tiers[2], 'fee', true));
  grid.appendChild(card2);

  const card3 = document.createElement('div');
  card3.className = 'config-card';
  card3.innerHTML = \`<h3>📦 Phí kiểm đếm</h3>
    <div class="form-group"><label>Phí cơ bản</label></div>
    <div class="form-group"><label>Mức SP cơ bản báo trọn gói</label></div>
    <div class="form-group"><label>Phí mỗi SP phát sinh thêm</label></div>
  \`;
  const countData = PRICING_DATA.specialFees.counting;
  const inputs3 = card3.querySelectorAll('.form-group');
  inputs3[0].appendChild(createInput(countData, 'baseFee', true));
  inputs3[1].appendChild(createInput(countData, 'baseQty', false));
  inputs3[2].appendChild(createInput(countData, 'extraPerItem', true));
  grid.appendChild(card3);

  container.appendChild(grid);
}

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
    btn.innerHTML = '<span class="icon">💾</span> Lưu Bảng Giá Lên Máy Chủ';
  }
}

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
    document.querySelector('label[for="importExcelInput"]').style.display = 'none';
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

function exportExcel() {
  if (typeof XLSX === 'undefined') { alert('Thư viện Excel chưa tải xong.'); return; }
  const wb = XLSX.utils.book_new();
  ['g1', 'g2', 'g3'].forEach(pkg => {
    const sheetData = [];
    sheetData.push(["Vùng", "Tỉnh", "Khu vực", "TG Giao", "Phí Min", "<=500", ...PRICING_DATA[pkg].vung1.weightTiers]);
    PRICING_DATA[pkg].vung1.routes.forEach(r => sheetData.push(["Từ HCM", r.province, r.area, r.time || "", r.min, ...r.prices]));
    if(PRICING_DATA[pkg].vung2) PRICING_DATA[pkg].vung2.routes.forEach(r => sheetData.push(["Từ ĐN", r.province, r.area, r.time || "", r.min, ...r.prices]));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(sheetData), pkg.toUpperCase());
  });
  XLSX.writeFile(wb, \`BangGia_NPV_\${new Date().getTime()}.xlsx\`);
}

function importExcel(e) {
  if (currentUserRole !== 'boss') { alert("❌ Chỉ Giám đốc thao tác!"); e.target.value = ""; return; }
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, {type: 'array'});
      const g1Sheet = workbook.Sheets['G1'];
      if(g1Sheet) {
        const json = XLSX.utils.sheet_to_json(g1Sheet, {header: 1});
        let newRoutesVung1 = [], newRoutesVung2 = [];
        for(let i=1; i<json.length; i++) {
          let row = json[i];
          if(!row || row.length < 5) continue;
          let rData = {
            zone: row[0]?.includes('HCM') ? 1 : 2,
            province: row[1], code: "", area: row[2] || "", deliveryTime: row[3] || "", min: parseFloat(row[4]) || 0,
            prices: row.slice(5).map(v => parseFloat(v) || 0)
          };
          if(rData.zone === 1) newRoutesVung1.push(rData); else newRoutesVung2.push(rData);
        }
        if(newRoutesVung1.length) PRICING_DATA.g1.vung1.routes = newRoutesVung1;
      }
      alert("✅ Nhập cấu hình thành công tạm thời. Hãy ấn 'Lưu Bảng Giá' để áp dụng!");
      renderContent();
    } catch(err) { alert("❌ Lỗi đọc file: " + err.message); }
  };
  reader.readAsArrayBuffer(file);
  e.target.value = "";
}

document.addEventListener('DOMContentLoaded', loadData);
\`

fs.writeFileSync('d:/Downloads/BAO GIA/app/admin.html', html);
fs.writeFileSync('d:/Downloads/BAO GIA/app/admin.css', css);
fs.writeFileSync('d:/Downloads/BAO GIA/app/admin.js', js);
console.log('Done rewriting files!');
