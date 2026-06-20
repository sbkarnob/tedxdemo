// ============================================
// TEDxUAP 2026 — Shared Components
// (Header, Footer, Admin Sidebar, Topbar)
// ============================================

// ========== PUBLIC HEADER ==========
function renderHeader(active) {
    const el = document.getElementById('site-header');
    if (!el) return;
    const links = [
        { href: '/index.html', label: 'Home', id: 'home' },
        { href: '/speakers.html', label: 'Speakers', id: 'speakers' },
        { href: '/organizers.html', label: 'Organizers', id: 'organizers' },
        { href: '/event.html', label: 'Event', id: 'event' },
        { href: '/contact.html', label: 'Contact', id: 'contact' }
    ];
    const navLinks = links.map(l => `<a href="${l.href}" class="nav-link${active === l.id ? ' active' : ''}">${l.label}</a>`).join('');
    const mobileLinks = links.map(l => `<a href="${l.href}" class="mobile-nav-link" onclick="closeMobileMenu()">${l.label}</a>`).join('');

    el.innerHTML = `
    <nav class="site-nav" id="siteNav">
      <div class="nav-inner">
        <a href="index.html" class="nav-logo">
          <div><span class="nav-logo-ted">TED</span><span class="nav-logo-x">x</span></div>
          <span class="nav-logo-sub">UniversityofAsiaPacific</span>
        </a>
        <div class="nav-links">${navLinks}<a href="index.html#tickets" class="nav-cta">Join Event</a></div>
        <button class="nav-hamburger" onclick="openMobileMenu()" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
    <div class="mobile-menu" id="mobileMenu">
      <button class="mobile-menu-close" onclick="closeMobileMenu()">&times;</button>
      ${mobileLinks}
      <div class="mobile-menu-cta"><a href="index.html#tickets" class="btn-primary" onclick="closeMobileMenu()" style="width:100%;justify-content:center">Join Event</a></div>
    </div>`;
}

function openMobileMenu() { document.getElementById('mobileMenu').classList.add('open'); }
function closeMobileMenu() { document.getElementById('mobileMenu').classList.remove('open'); }

// ========== PUBLIC FOOTER ==========
function renderFooter() {
    const el = document.getElementById('site-footer');
    if (!el) return;
    el.innerHTML = `
    <footer class="site-footer">
      <div class="footer-main">
        <div class="container">
          <div class="footer-grid">
            <div>
              <div><span class="footer-logo-ted">TED</span><span class="footer-logo-x">x</span></div>
              <div class="footer-logo-sub">UniversityofAsiaPacific</div>
              <p class="footer-desc">Independently organized TEDx event, operated under license from TED. Ideas worth spreading at UAP.</p>
              <div>
                <a href="#" class="social-btn">X</a>
                <a href="#" class="social-btn">in</a>
                <a href="#" class="social-btn">ig</a>
                <a href="#" class="social-btn">fb</a>
              </div>
            </div>
            <div>
              <div class="footer-heading">Navigation</div>
              <a href="index.html" class="footer-link">Home</a>
              <a href="speakers.html" class="footer-link">Speakers</a>
              <a href="organizers.html" class="footer-link">Organizers</a>
              <a href="event.html" class="footer-link">Event Details</a>
              <a href="contact.html" class="footer-link">Contact</a>
              <a href="index.html#sponsors" class="footer-link">Sponsors</a>
              <a href="index.html#partners" class="footer-link">Partners</a>
            </div>
            <div>
              <div class="footer-heading">Contact</div>
              <a href="mailto:tedx@uap-bd.edu" class="footer-link">tedx@uap-bd.edu</a>
              <span class="footer-link" style="cursor:default">+880 1234-567890</span>
              <span class="footer-link" style="cursor:default">University of Asia Pacific</span>
              <span class="footer-link" style="cursor:default">74/A Green Road, Dhaka</span>
              <div style="margin-top:20px">
                <span style="font-size:.68rem;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,0,0,.6)">x = independently organized</span>
                <p style="font-size:.72rem;color:rgba(255,255,255,.2);line-height:1.6;margin-top:6px">This independent TEDx event is operated under license from TED.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="footer-bottom">
          <span class="footer-copy">&copy; 2026 TEDxUniversityofAsiaPacific. All rights reserved.</span>
          <span class="footer-copy">Made By Sajjad Arnob</span>
        </div>
      </div>
    </footer>`;
}

// ========== ADMIN SIDEBAR ==========
function renderAdminSidebar(active) {
    const el = document.getElementById('adminSidebar');
    if (!el) return;
    const items = [
        { section: 'Main', links: [{ href: '/admin/dashboard', icon: '📊', label: 'Dashboard', id: 'dashboard' }] },
        { section: 'Content', links: [
            { href: '/admin/speakers', icon: '🎤', label: 'Speakers', id: 'speakers' },
            { href: '/admin/organizers', icon: '👥', label: 'Organizers', id: 'organizers' },
            { href: '/admin/volunteers', icon: '🤝', label: 'Volunteers', id: 'volunteers' },
            { href: '/admin/sponsors', icon: '💎', label: 'Sponsors & Partners', id: 'sponsors' }
        ]},
        { section: 'Event', links: [
            { href: '/admin/event', icon: '📅', label: 'Event Details', id: 'event' },
            { href: '/admin/schedule', icon: '⏰', label: 'Schedule', id: 'schedule' }
        ]},
        { section: 'Communication', links: [
            { href: '/admin/messages', icon: '📧', label: 'Messages', id: 'messages', badge: true }
        ]},
        { section: 'Account', links: [
            { href: '/admin/settings', icon: '⚙️', label: 'Settings', id: 'settings' }
        ]}
    ];

    let html = `
    <div class="admin-sidebar-logo">
      <span class="nav-logo-ted">TED</span><span class="nav-logo-x">x</span>
      <span class="admin-sidebar-badge">Admin</span>
    </div>`;

    items.forEach(s => {
        html += `<div class="admin-nav-section"><div class="admin-nav-title">${s.section}</div>`;
        s.links.forEach(l => {
            html += `<a href="${l.href}" class="admin-nav-item${active === l.id ? ' active' : ''}">
              <span class="admin-nav-icon">${l.icon}</span><span>${l.label}</span>
              ${l.badge ? '<span class="admin-nav-badge" id="msgBadge" style="display:none">0</span>' : ''}
            </a>`;
        });
        html += '</div>';
    });

    html += `<div class="admin-nav-section" style="margin-top:auto;padding:0 16px">
      <a href="../index.html" class="admin-nav-item" target="_blank"><span class="admin-nav-icon">🌐</span><span>View Website</span></a>
    </div>`;

    el.innerHTML = html;
}

function renderAdminTopbar(title) {
    const el = document.getElementById('adminTopbar');
    if (!el) return;
    el.innerHTML = `
    <div style="display:flex;align-items:center;gap:12px">
      <button class="admin-mobile-toggle" onclick="toggleAdminSidebar()">☰</button>
      <span class="admin-topbar-title">${title}</span>
    </div>
    <div class="admin-topbar-actions">
      <div class="admin-user-menu">
        <div class="admin-user-avatar" id="adminAvatar">A</div>
        <div class="admin-user-info">
          <span class="admin-user-name" id="adminName">Admin</span>
          <span class="admin-user-role">Administrator</span>
        </div>
      </div>
      <button class="admin-btn-signout" onclick="adminSignOut()">Sign Out</button>
    </div>`;
}

function toggleAdminSidebar() {
    document.getElementById('adminSidebar').classList.toggle('open');
    document.getElementById('adminOverlay').classList.toggle('show');
}
function closeAdminSidebar() {
    document.getElementById('adminSidebar').classList.remove('open');
    document.getElementById('adminOverlay').classList.remove('show');
}

async function adminSignOut() {
    try { await window.db.signOut(); } catch(e) {}
    window.location.href = '/admin';
}

async function loadAdminUser() {
    try {
        const session = await window.db.getSession();
        if (!session) { window.location.href = '/admin'; return false; }

        const email = session.user?.email || 'Admin';
        const displayName = email.split('@')[0];
        const n = document.getElementById('adminName');
        const a = document.getElementById('adminAvatar');
        if (n) n.textContent = displayName;
        if (a) a.textContent = displayName[0].toUpperCase();

        try {
            const profile = await window.db.getAdminProfile();
            if (profile && profile.full_name) {
                if (n) n.textContent = profile.full_name;
                if (a) a.textContent = profile.full_name[0].toUpperCase();
            }
        } catch(e) {}

        return true;
    } catch (e) {
        window.location.href = '/admin';
        return false;
    }
}

async function loadMsgBadge() {
    try {
        const count = await window.db.unreadCount();
        if (count > 0) {
            const badge = document.getElementById('msgBadge');
            if (badge) { badge.textContent = count; badge.style.display = 'block'; }
        }
    } catch(e) {}
}

function adminToast(msg, type = '') {
    let t = document.getElementById('adminToast');
    if (!t) {
        t = document.createElement('div');
        t.id = 'adminToast';
        t.className = 'toast';
        document.body.appendChild(t);
    }
    t.textContent = msg;
    t.className = 'toast' + (type === 'success' ? ' success' : type === 'error' ? ' error' : '');
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}