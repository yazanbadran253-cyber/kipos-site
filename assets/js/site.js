/* Kipos site. Three small jobs, no dependencies. */

/* ── THE LAUNCH SWITCH ──────────────────────────────────────────────
   Kipos is not released yet, so there is no App Store page and
   every badge renders as a non-clickable "Coming soon" pill.

   On release day, set this to the URL and every badge on every page
   becomes a real link. That is the only edit needed.

     const APP_STORE_URL = 'https://apps.apple.com/app/id6798338126';

   Apple ID 6798338126 — CODEX_BACKLOG.md:719 in the app repo. */
const APP_STORE_URL = null;

const SUPPORT_EMAIL = 'support@getgardenai.com';

/* 1. Badges. The HTML ships the honest "coming soon" state, so a browser
      with JS off never sees a dead link promising a download. */
if (APP_STORE_URL) {
  document.querySelectorAll('[data-store-badge]').forEach(function (el) {
    var a = document.createElement('a');
    a.href = APP_STORE_URL;
    a.className = el.className;
    a.rel = 'noopener';
    a.innerHTML = el.innerHTML;
    var kicker = a.querySelector('[data-badge-kicker]');
    if (kicker) kicker.textContent = 'Download on the';
    el.replaceWith(a);
  });
  document.querySelectorAll('[data-soon-note]').forEach(function (el) { el.remove(); });
}

/* 2. Contact forms. No server, so the browser's own mail app does the
      sending. The address is also printed beside every form as a plain
      link, which is the path when there is no mail client. */
document.querySelectorAll('[data-mail-form]').forEach(function (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = form.elements;
    var body = f.message.value + '\n\n— Reply to: ' + f.email.value;
    window.location.href = 'mailto:' + SUPPORT_EMAIL +
      '?subject=' + encodeURIComponent(f.subject.value) +
      '&body=' + encodeURIComponent(body);
    var status = form.querySelector('[data-mail-status]');
    if (status) {
      status.textContent = 'Opening your mail app… If nothing happens, email ' +
        SUPPORT_EMAIL + ' directly.';
    }
  });
});

/* 3. Subtle reveal. The class is added by script, so the page renders
      finished when JS fails or motion is not wanted. */
var motionOK = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (motionOK && 'IntersectionObserver' in window) {
  var targets = document.querySelectorAll('[data-reveal]');
  targets.forEach(function (el) { el.classList.add('reveal'); });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  targets.forEach(function (el) { io.observe(el); });
}
