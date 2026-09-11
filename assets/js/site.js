/* Kipos site. Two small jobs, no dependencies. */

/* Kipos 1.0 was released 2026-09-08, so the App Store badge is a plain
   <a href> in the markup on every page. It used to be a "coming soon" pill
   that this file rewrote on load; that switch was deleted with the launch,
   because a badge that needs JavaScript to become a link is a dead badge
   for anyone whose JavaScript did not run.

   Apple ID 6798338126 — see the app repo's CODEX_BACKLOG.md. */

const SUPPORT_EMAIL = 'support@kipostracker.com';

/* 1. Contact forms. No server, so the browser's own mail app does the
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

/* 2. Subtle reveal. The class is added by script, so the page renders
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
