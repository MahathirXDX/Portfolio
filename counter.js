/* ==========================================================================
   counter.js
   Animates a number from 0 up to a target value once it scrolls into view.
   Usage: animateCounter(el, 50, { suffix: '+', duration: 1600 });
   ========================================================================== */

function animateCounter(el, target, opts = {}) {
  const duration = opts.duration ?? 1600;
  const suffix = opts.suffix ?? '';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion) {
    el.textContent = target + suffix;
    return;
  }

  const start = performance.now();
  const from = 0;

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function frame(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutExpo(progress);
    const value = Math.round(from + (target - from) * eased);
    el.textContent = value + suffix;

    if (progress < 1) {
      requestAnimationFrame(frame);
    } else {
      el.textContent = target + suffix;
    }
  }

  requestAnimationFrame(frame);
}

/**
 * Watches a set of counter elements and triggers each one exactly once
 * when it enters the viewport.
 * @param {NodeListOf<HTMLElement>|HTMLElement[]} elements
 */
function observeCounters(elements) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10) || 0;
        const suffix = el.dataset.suffix || '';
        animateCounter(el, target, { suffix });
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.4 });

  elements.forEach((el) => observer.observe(el));
}
