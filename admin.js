let currentTab = 'g1';
let currentRegion = 'vung1';
let currentUserRole = null; // 'admin' (xem) or 'boss' (sửa)

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
  
  // Set Effective Date
  const dateInput = document.getElementById('effectiveDateInput');
  if (dateInput) {
    dateInput.value = PRICING_DATA.effectiveDate || new Date().toLocaleDateString('vi-VN');
    dateInput.addEventListener('change', (e) => {
      PRICING_DATA.effectiveDate = e.target.value;
    });
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
    btn.innerText = '💾 Lưu Lên Cloud';
  }
}

// ================= AUTHENTICATION =================
function login() {
  const pwd = document.getElementById('authPassword').value;
  const err = document.getElementById('authError');
  if (pwd === 'admin') {
    currentUserRole = 'admin';
    document.getElementById('authOverlay').style.display = 'none';
    document.getElementById('roleBadge').innerText = '👀 Quyền Xem';
    document.getElementById('roleBadge').className = 'auth-role-badge admin';
    document.getElementById('btnSave').style.display = 'none'; // Ẩn nút lưu
    document.querySelector('label[for="importExcelInput"]').style.display = 'none'; // Ẩn nút nhập
  } else if (pwd === 'boss') {
    currentUserRole = 'boss';
    document.getElementById('authOverlay').style.display = 'none';
    document.getElementById('roleBadge').innerText = '👑 Giám Đốc';
    document.getElementById('roleBadge').className = 'auth-role-badge';
  } else {
    err.style.display = 'block';
  }
}

// ================= EXCEL EXPORT / IMPORT =================
function exportExcel() {
  if (typeof XLSX === 'undefined') {
    alert('Thư viện Excel chưa được tải, vui lòng thử lại sau.');
    return;
  }
  
  const wb = XLSX.utils.book_new();

  // Export G1/G2/G3
  ['g1', 'g2', 'g3'].forEach(pkg => {
    const sheetData = [];
    sheetData.push(["Vùng", "Tỉnh", "Khu vực", "TG Giao", "Phí Min", ...PRICING_DATA[pkg].vung1.weightTiers]);
    
    // Vùng 1
    PRICING_DATA[pkg].vung1.routes.forEach(r => {
      sheetData.push(["Từ HCM", r.province, r.area, r.time || r.deliveryTime || "", r.min || 0, ...r.prices]);
    });
    // Vùng 2
    if(PRICING_DATA[pkg].vung2) {
      PRICING_DATA[pkg].vung2.routes.forEach(r => {
        sheetData.push(["Từ ĐN", r.province, r.area, r.time || r.deliveryTime || "", r.min || 0, ...r.prices]);
      });
    }

    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(wb, ws, pkg.toUpperCase());
  });

  XLSX.writeFile(wb, `BangGia_NPV_${new Date().getTime()}.xlsx`);
}

function importExcel(e) {
  if (currentUserRole !== 'boss') {
    alert("❌ Chỉ Giám đốc mới có quyền Nhập file Excel!");
    e.target.value = "";
    return;
  }

  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, {type: 'array'});

      // Xử lý đơn giản cho G1 làm ví dụ (Cần map logic phức tạp nếu muốn import chuẩn hoàn toàn)
      const g1Sheet = workbook.Sheets['G1'];
      if(g1Sheet) {
        const json = XLSX.utils.sheet_to_json(g1Sheet, {header: 1});
        // Bỏ header (dòng 0)
        let newRoutesVung1 = [];
        let newRoutesVung2 = [];
        for(let i=1; i<json.length; i++) {
          let row = json[i];
          if(!row || row.length < 5) continue;
          let rData = {
            zone: row[0].includes('HCM') ? 1 : 2,
            province: row[1],
            code: "",
            area: row[2] || "",
            deliveryTime: row[3] || "",
            min: parseFloat(row[4]) || 0,
            prices: row.slice(5).map(v => parseFloat(v) || 0)
          };
          if(rData.zone === 1) newRoutesVung1.push(rData);
          else newRoutesVung2.push(rData);
        }
        
        if(newRoutesVung1.length > 0) PRICING_DATA.g1.vung1.routes = newRoutesVung1;
        if(newRoutesVung2.length > 0 && PRICING_DATA.g1.vung2) PRICING_DATA.g1.vung2.routes = newRoutesVung2;
      }
      
      alert("✅ Nhập cấu hình thành công vào hệ thống tạm. Hãy ấn 'Lưu Lên Cloud' để áp dụng!");
      renderContent();
    } catch(err) {
      alert("❌ Lỗi đọc file Excel: " + err.message);
    }
  };
  reader.readAsArrayBuffer(file);
  e.target.value = "";
}

document.addEventListener('DOMContentLoaded', loadData);
