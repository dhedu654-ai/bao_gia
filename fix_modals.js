const fs = require('fs');
let html = fs.readFileSync('d:/Downloads/BAO GIA/app/admin.html', 'utf8');

const modalHTML = `
  <!-- Route Edit Modal -->
  <div class="overlay" id="routeModal" style="display:none; align-items:flex-start; overflow-y:auto; padding: 20px;">
    <div class="modal-content" style="background:white; border-radius:12px; max-width:600px; width:100%; padding:24px; box-shadow:0 10px 25px rgba(0,0,0,0.15); position:relative; margin-top: 40px;">
      <button onclick="closeRouteModal()" style="position:absolute; top:16px; right:16px; background:none; border:none; font-size:24px; cursor:pointer; color:#94a3b8;">&times;</button>
      <h2 id="routeModalTitle" style="margin-top:0; color:#0f172a; font-size:20px; border-bottom:1px solid #e2e8f0; padding-bottom:12px; margin-bottom:20px;">Thêm/Sửa Tuyến Đường</h2>
      
      <div id="routeForm" style="display:flex; flex-direction:column; gap:16px;">
        <input type="hidden" id="modalRouteIndex">
        
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
          <div>
            <label style="display:block; font-size:13px; font-weight:600; color:#475569; margin-bottom:6px;">Tỉnh/Thành</label>
            <input type="text" id="modalProvince" class="form-control" style="width:100%; padding:8px 12px; border:1px solid #cbd5e1; border-radius:6px;">
          </div>
          <div>
            <label style="display:block; font-size:13px; font-weight:600; color:#475569; margin-bottom:6px;">Mã (Code)</label>
            <input type="text" id="modalCode" class="form-control" style="width:100%; padding:8px 12px; border:1px solid #cbd5e1; border-radius:6px;">
          </div>
        </div>
        
        <div>
          <label style="display:block; font-size:13px; font-weight:600; color:#475569; margin-bottom:6px;">Khu vực (Quận/Huyện)</label>
          <input type="text" id="modalArea" class="form-control" style="width:100%; padding:8px 12px; border:1px solid #cbd5e1; border-radius:6px;">
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
          <div>
            <label style="display:block; font-size:13px; font-weight:600; color:#475569; margin-bottom:6px;">Ký hiệu Vùng (Zone 1/2...)</label>
            <input type="number" id="modalZone" class="form-control" style="width:100%; padding:8px 12px; border:1px solid #cbd5e1; border-radius:6px;">
          </div>
          <div>
            <label style="display:block; font-size:13px; font-weight:600; color:#475569; margin-bottom:6px;">Thời gian giao hàng</label>
            <input type="text" id="modalTime" class="form-control" style="width:100%; padding:8px 12px; border:1px solid #cbd5e1; border-radius:6px;">
          </div>
        </div>

        <div style="background:#f8fafc; padding:16px; border-radius:8px; border:1px solid #e2e8f0;">
          <h3 style="font-size:14px; margin-top:0; margin-bottom:12px; color:#1e293b;">Bảng Giá (VNĐ)</h3>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
            <div>
              <label style="display:block; font-size:12px; color:#64748b; margin-bottom:4px;">Phí Min (500kg)</label>
              <input type="number" id="modalMin" class="form-control" style="width:100%; padding:8px; border:1px solid #cbd5e1; border-radius:4px; font-weight:600; color:#1B75BB;">
            </div>
            <div>
              <label style="display:block; font-size:12px; color:#64748b; margin-bottom:4px;">Nấc 1 (500-600)</label>
              <input type="number" id="modalP1" class="form-control" style="width:100%; padding:8px; border:1px solid #cbd5e1; border-radius:4px;">
            </div>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr 1fr 1fr; gap:8px;">
            <div>
              <label style="display:block; font-size:12px; color:#64748b; margin-bottom:4px;">Nấc 2</label>
              <input type="number" id="modalP2" class="form-control" style="width:100%; padding:8px; border:1px solid #cbd5e1; border-radius:4px;">
            </div>
            <div>
              <label style="display:block; font-size:12px; color:#64748b; margin-bottom:4px;">Nấc 3</label>
              <input type="number" id="modalP3" class="form-control" style="width:100%; padding:8px; border:1px solid #cbd5e1; border-radius:4px;">
            </div>
            <div>
              <label style="display:block; font-size:12px; color:#64748b; margin-bottom:4px;">Nấc 4</label>
              <input type="number" id="modalP4" class="form-control" style="width:100%; padding:8px; border:1px solid #cbd5e1; border-radius:4px;">
            </div>
            <div>
              <label style="display:block; font-size:12px; color:#64748b; margin-bottom:4px;">Nấc 5</label>
              <input type="number" id="modalP5" class="form-control" style="width:100%; padding:8px; border:1px solid #cbd5e1; border-radius:4px;">
            </div>
          </div>
        </div>

        <div style="background:#fffbeb; padding:16px; border-radius:8px; border:1px solid #fde68a;">
          <label style="display:block; font-size:14px; font-weight:700; color:#b45309; margin-bottom:8px;">📅 Ngày Hiệu Lực Áp Dụng <span style="color:red">*</span></label>
          <p style="font-size:12px; color:#d97706; margin-top:0; margin-bottom:12px;">Hệ thống sẽ giữ lại phiên bản cũ và tạo phiên bản cước mới bắt đầu từ ngày này.</p>
          <input type="date" id="modalEffectiveDate" class="form-control" style="width:100%; padding:10px; border:1px solid #fcd34d; border-radius:6px; font-weight:600; font-size:15px;">
        </div>

        <div style="display:flex; justify-content:flex-end; gap:12px; margin-top:8px;">
          <button type="button" class="btn btn-outline" onclick="closeRouteModal()">Hủy bỏ</button>
          <button type="button" class="btn btn-primary-bg" onclick="saveRouteModal()">💾 Lưu Tuyến Đường</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Delete Modal -->
  <div class="overlay" id="deleteModal" style="display:none; align-items:flex-start; overflow-y:auto; padding: 20px;">
    <div class="modal-content" style="background:white; border-radius:12px; max-width:450px; width:100%; padding:24px; box-shadow:0 10px 25px rgba(0,0,0,0.15); margin-top: 100px;">
      <h2 style="margin-top:0; color:#dc2626; font-size:20px; margin-bottom:16px;">⚠️ Ngừng Hoạt Động Tuyến Đường</h2>
      <p style="font-size:14px; color:#475569; margin-bottom:20px;">Tuyến đường này sẽ không bị xóa khỏi cơ sở dữ liệu để phục vụ việc tra cứu báo giá cũ, nhưng sẽ bị ẩn khỏi công cụ báo giá mới kể từ ngày bạn chọn dưới đây.</p>
      
      <input type="hidden" id="deleteRouteIndex">
      <div style="margin-bottom:24px;">
        <label style="display:block; font-size:13px; font-weight:600; color:#475569; margin-bottom:6px;">Ngày bắt đầu ngừng hoạt động <span style="color:red">*</span></label>
        <input type="date" id="modalInactiveDate" class="form-control" style="width:100%; padding:10px; border:1px solid #cbd5e1; border-radius:6px; font-weight:600;">
      </div>

      <div style="display:flex; justify-content:flex-end; gap:12px;">
        <button type="button" class="btn btn-outline" onclick="closeDeleteModal()">Hủy bỏ</button>
        <button type="button" class="btn" style="background:#dc2626; color:white;" onclick="confirmDeleteRoute()">Ngừng hoạt động</button>
      </div>
    </div>
  </div>
`;

if (!html.includes('id="routeModal"')) {
  html = html.replace('</body>', modalHTML + '\n</body>');
  fs.writeFileSync('d:/Downloads/BAO GIA/app/admin.html', html);
  console.log("SUCCESS: Added modals to admin.html");
} else {
  console.log("Modals already exist.");
}
