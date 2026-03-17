const fs = require('fs');

// --- 1. Fix admin.html ---
let html = fs.readFileSync('d:/Downloads/BAO GIA/app/admin.html', 'utf8');

// Replace old logo with npv-logo.png
html = html.replace(
  '<div class="sidebar-logo">\n        <span class="icon" style="font-size: 24px; color: #2563eb;">🚛</span> <span class="text" style="font-size: 18px; font-weight: 700; color: #1e3a8a;">NPV Logistics</span>\n      </div>',
  \`      <div class="sidebar-logo" style="flex-direction: column; align-items: center; padding: 20px 10px;">
        <img src="npv-logo.png" alt="NPV Logistics" style="max-width: 140px; margin-bottom: 8px;">
        <span class="text" style="font-size: 14px; font-weight: 700; color: #1B75BB; text-align: center;">CÀI ĐẶT BẢNG GIÁ</span>
      </div>\`
);

// Add "Quay lại Báo Giá" button to header actions
const authRoleBadgeStr = '<div class="auth-role-badge" id="roleBadge" style="display:none;">Chế độ Xem</div>';
const backBtnStr = '<a href="index.html" class="btn btn-outline" style="text-decoration:none; display:inline-flex; align-items:center; gap:6px;">⬅️ Quay lại Báo Giá</a>';
if (!html.includes('Quay lại Báo Giá')) {
  html = html.replace(authRoleBadgeStr, backBtnStr + '\n          ' + authRoleBadgeStr);
}

// Add Mobile Toggle Button to header
const headerTitlesStr = '<div class="header-titles">';
const mobileMenuBtn = '<button class="mobile-menu-btn" onclick="toggleSidebar()">☰</button>\n          ';
if (!html.includes('mobile-menu-btn')) {
  html = html.replace(headerTitlesStr, mobileMenuBtn + headerTitlesStr);
}

// Add script for toggle sidebar
if (!html.includes('toggleSidebar')) {
  html = html.replace('</body>', \`
  <script>
    function toggleSidebar() {
      document.querySelector('.sidebar').classList.toggle('open');
      document.querySelector('.overlay-mobile').classList.toggle('show');
    }
  </script>
  <div class="overlay-mobile" onclick="toggleSidebar()"></div>
</body>\`);
}

fs.writeFileSync('d:/Downloads/BAO GIA/app/admin.html', html);


// --- 2. Fix admin.css ---
let css = fs.readFileSync('d:/Downloads/BAO GIA/app/admin.css', 'utf8');

// Replace colors
css = css.replace(/#2563eb/g, '#1B75BB'); // main blue
css = css.replace(/#1e3a8a/g, '#1B75BB'); // dark blue to main blue
css = css.replace(/#10b981/g, '#4CAF50'); // save button green
css = css.replace(/#3b82f6/g, '#1B75BB'); // hover blue
css = css.replace(/#eff6ff/g, 'rgba(27,117,187,0.05)'); // active bg
css = css.replace(/#dbeafe/g, 'rgba(27,117,187,0.1)'); // border

// Add Responsive Media Queries
const responsiveCSS = \`
/* ===== RESPONSIVE ===== */
.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  font-size: 24px;
  color: #1B75BB;
  cursor: pointer;
  padding: 0 10px 0 0;
}

.overlay-mobile {
  display: none;
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 99;
}
.overlay-mobile.show { display: block; }

@media (max-width: 1024px) {
  .actions { flex-wrap: wrap; justify-content: flex-end; }
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0; bottom: 0; left: -250px;
    z-index: 100;
    transition: 0.3s;
  }
  .sidebar.open { left: 0; }
  
  .mobile-menu-btn { display: block; }
  
  .header { padding: 12px 16px; align-items: flex-start; flex-direction: column; gap: 12px; }
  .header-titles { display: flex; align-items: center; }
  .actions { width: 100%; justify-content: space-between; }
  
  .layout-toolbar { flex-direction: column; align-items: stretch; gap: 12px; }
  .toolbar-actions { flex-wrap: wrap; justify-content: flex-start; }
  .filter-bar { flex-direction: column; align-items: stretch; }
  
  /* Make table scrollable */
  .table-wrapper { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  table { min-width: 800px; }
  
  /* Popup modals */
  .modal-content { width: 95%; max-height: 90vh; overflow-y: auto; margin: 20px auto; }
}
\`;

if (!css.includes('/* ===== RESPONSIVE ===== */')) {
  css += responsiveCSS;
}

fs.writeFileSync('d:/Downloads/BAO GIA/app/admin.css', css);

console.log('SUCCESS: UI Consistent and Responsive updates applied.');
