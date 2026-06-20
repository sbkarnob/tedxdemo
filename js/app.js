// ============================================
// TEDxUAP 2026 — Common App Logic
// ============================================

// Scroll navbar
window.addEventListener('scroll', function () {
    const nav = document.getElementById('siteNav');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
});

// Reveal on scroll
const revealObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
        if (e.isIntersecting) e.target.classList.add('visible');
    });
}, { threshold: 0.08 });

function initReveals() {
    document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(function (el) {
        revealObs.observe(el);
    });
}

// FAQ toggle
function toggleFaq(btn, i) {
    const ans = document.getElementById('faq-' + i);
    const isOpen = ans.classList.contains('open');
    document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('open'));
    document.querySelectorAll('.faq-question').forEach(b => b.classList.remove('open'));
    if (!isOpen) { ans.classList.add('open'); btn.classList.add('open'); }
}

// Toast (public pages)
function showToast(msg, isError) {
    let t = document.getElementById('toast');
    if (!t) {
        t = document.createElement('div');
        t.id = 'toast';
        t.className = 'toast';
        document.body.appendChild(t);
    }
    t.textContent = msg;
    t.className = 'toast' + (isError ? ' error' : '');
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 4000);
}

// Init
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(initReveals, 100);
});