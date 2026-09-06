/* Home page motion. GSAP + ScrollTrigger, scroll-driven only.
 *
 * Everything here is an enhancement. If GSAP fails to load, if the browser is
 * ancient, or if the visitor asked for reduced motion, this file returns before
 * touching the DOM and the page is exactly the static one that shipped before.
 * That is why the hero's entrance lives in CSS instead of here — an above-the-
 * fold element must never depend on a third-party script arriving.
 *
 * One rule governs the layering: a GSAP tween owns a property outright. Two
 * tweens writing y to the same element fight and jump. So the hero phone is
 * four nested elements, one property each:
 *
 *   .phone-par    y          parallax, scrubbed to scroll
 *   .phone-tilt   rotationX/Y  cursor tilt
 *   .phone-float  translateY   idle bob (CSS keyframes, not GSAP)
 *   .phone        opacity/scale entrance (CSS keyframes)
 */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches) return;
  if (!window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  /* ── text: rises in, drifts out ──────────────────────────────────────
     In on entry, then a slow upward drift as the block leaves. Deliberately
     not a fade-out: copy that dims while still on screen is harder to read,
     and punishes anyone who scrolls slowly. Motion without losing the words. */

  gsap.utils.toArray('[data-stagger]').forEach(function (group) {
    var kids = group.querySelectorAll('[data-rise], .step, .feature, details, .sec__head > *');
    if (!kids.length) return;
    // fromTo, never from. A `from` tween re-reads its end value when
    // ScrollTrigger refreshes, and if the start state is already applied it
    // records that as the destination — so the cards animate 26px to 26px and
    // sit there looking broken. Pinning both ends makes a refresh harmless.
    gsap.fromTo(kids,
      { autoAlpha: 0, y: 26 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.08,
        overwrite: 'auto',
        scrollTrigger: { trigger: group, start: 'top 86%', once: true }
      });
  });

  gsap.utils.toArray('[data-drift]').forEach(function (el) {
    gsap.to(el, {
      y: -26,
      ease: 'none',
      scrollTrigger: {
        // The parent is the trigger, never the element itself. Triggering off
        // something this tween is moving feeds its own position back in.
        trigger: el.parentElement,
        start: 'top 28%',
        end: 'bottom top',
        scrub: 0.6
      }
    });
  });

  /* ── the hero phone ──────────────────────────────────────────────── */

  var mm = gsap.matchMedia();

  // Parallax: the phone climbs slower than the page, so it reads as a deeper
  // layer. Runs at every width — it is just as legible on a narrow screen.
  var par = document.querySelector('.hero .phone-par');
  if (par) {
    gsap.to(par, {
      y: 70,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  }

  // Tilt: only where there is a real cursor to follow. `pointer: fine` keeps it
  // off touchscreens, where it would either never fire or fire on every tap.
  mm.add('(min-width: 901px) and (pointer: fine)', function () {
    var art = document.querySelector('.hero__art');
    var tilt = document.querySelector('.hero .phone-tilt');
    if (!art || !tilt) return;

    var rx = gsap.quickTo(tilt, 'rotationX', { duration: 0.7, ease: 'power3' });
    var ry = gsap.quickTo(tilt, 'rotationY', { duration: 0.7, ease: 'power3' });

    function follow(e) {
      var r = art.getBoundingClientRect();
      rx((0.5 - (e.clientY - r.top) / r.height) * 9);
      ry(((e.clientX - r.left) / r.width - 0.5) * 13);
    }
    function settle() { rx(0); ry(0); }

    art.addEventListener('mousemove', follow);
    art.addEventListener('mouseleave', settle);

    return function () {
      art.removeEventListener('mousemove', follow);
      art.removeEventListener('mouseleave', settle);
      gsap.set(tilt, { rotationX: 0, rotationY: 0 });
    };
  });

  /* ── the sticky phone's screen ───────────────────────────────────────
     Desktop only. Below 901px the stage is display:none and each block shows
     its own phone, so there is nothing here to drive. */

  mm.add('(min-width: 901px)', function () {
    var screens = gsap.utils.toArray('.swap__screen');
    var blocks = gsap.utils.toArray('.swap__block');
    if (screens.length < 2 || !blocks.length) return;

    // Crossfade by stacking, not by dipping both screens to half opacity at
    // once. Two half-transparent screenshots let the dark phone body show
    // through both, which looks like mud. The incoming screen fades in on top
    // of the outgoing one, which stays fully opaque underneath until it is
    // completely covered.
    var current = -1;
    var cleanup;

    function show(i) {
      if (i === current) return;
      var previous = current;
      current = i;

      screens.forEach(function (screen, j) {
        gsap.set(screen, { zIndex: j === i ? 2 : (j === previous ? 1 : 0) });
      });

      gsap.to(screens[i], { autoAlpha: 1, duration: 0.45, ease: 'power2.out', overwrite: 'auto' });

      // Hiding the old screens is scheduled separately rather than hung off the
      // fade-in's onComplete. Scroll fast enough and the next show() overwrites
      // that tween before it finishes, onComplete never fires, and a stale
      // screen is left sitting at full opacity under the new one. A delayedCall
      // that each show() kills and replaces always settles on the current index.
      if (cleanup) cleanup.kill();
      cleanup = gsap.delayedCall(0.45, function () {
        screens.forEach(function (screen, j) {
          if (j !== i) gsap.set(screen, { autoAlpha: 0 });
        });
      });
    }
    gsap.set(screens[0], { autoAlpha: 1, zIndex: 2 });
    gsap.set(screens.slice(1), { autoAlpha: 0, zIndex: 0 });
    current = 0;

    // Keep the screen derived from the current scroll position. The previous
    // per-block onToggle callbacks could miss a whole block when a trackpad,
    // scrollbar drag, anchor jump or restored scroll position crossed both of
    // its boundaries between two ScrollTrigger updates. In that case screen 1
    // stayed hidden even while its "Show off" copy was on screen.
    var syncFrame = 0;

    function syncScreen() {
      var marker = window.innerHeight * 0.58;
      var next = 0;

      blocks.forEach(function (block, i) {
        if (block.getBoundingClientRect().top <= marker) next = i;
      });

      show(next);
    }

    function requestSync() {
      if (syncFrame) return;
      syncFrame = window.requestAnimationFrame(function () {
        syncFrame = 0;
        syncScreen();
      });
    }

    // Listen to the browser's real scroll position instead of depending on a
    // trigger becoming active. ScrollTrigger deliberately coalesces updates;
    // that is useful for animation, but it means a large one-frame jump can
    // cross an entire middle block without making that block active.
    window.addEventListener('scroll', requestSync, { passive: true });
    window.addEventListener('resize', requestSync);

    // Set the right screen immediately, including when the browser restores a
    // saved scroll position before ScrollTrigger finishes its first refresh.
    syncScreen();

    return function () {
      if (cleanup) cleanup.kill();
      if (syncFrame) window.cancelAnimationFrame(syncFrame);
      window.removeEventListener('scroll', requestSync);
      window.removeEventListener('resize', requestSync);
      gsap.set(screens, { clearProps: 'opacity,visibility,zIndex' });
    };
  });

  /* Someone can switch reduced motion on after load. Honour it immediately
     rather than waiting for a reload. */
  reduced.addEventListener('change', function (e) {
    if (!e.matches) return;
    ScrollTrigger.getAll().forEach(function (t) { t.kill(); });
    gsap.globalTimeline.clear();
    gsap.set('[data-rise], [data-drift], .step, .feature, .swap__screen, .phone-par, .phone-tilt', {
      clearProps: 'all'
    });
    gsap.set('.swap__screen:not(:first-child)', { autoAlpha: 0 });
  });
})();
