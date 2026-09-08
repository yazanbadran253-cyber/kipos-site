/* Kipos site. Three small jobs, no dependencies. */

/* ── THE LAUNCH SWITCH ──────────────────────────────────────────────
   Flipped 2026-09-08, the day Kipos 1.0 was released. Every badge on
   every page is a real App Store link now, the kicker reads "Download
   on the", and the "iPhone first." notes are removed.

   The HTML still ships the honest "coming soon" state, so setting this
   back to null is a complete rollback — no markup change needed.

   Apple ID 6798338126 — see the app repo's CODEX_BACKLOG.md. */
const APP_STORE_URL = 'https://apps.apple.com/app/id6798338126';

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
