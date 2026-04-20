/* Meblove – minimal interactions
   - sticky nav scroll state
   - mobile drawer toggle
   - active link highlight
   - reveal-on-scroll (IntersectionObserver) with safety fallback
   - current year in footer
*/

// Mark the document as JS-enabled as early as possible so that
// the .reveal CSS rules (which hide content) only kick in with JS.
document.documentElement.classList.add('js');

(() => {
  'use strict';

  // ---- Nav scroll state ----
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // ---- Mobile drawer ----
    const burger = nav.querySelector('.nav__burger');
    if (burger) {
      burger.addEventListener('click', () => {
        const open = nav.classList.toggle('is-open');
        burger.setAttribute('aria-expanded', String(open));
        document.body.style.overflow = open ? 'hidden' : '';
      });
      nav.querySelectorAll('.nav__drawer a').forEach(a => {
        a.addEventListener('click', () => {
          nav.classList.remove('is-open');
          burger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });
    }

    // ---- Active link ----
    const path = (location.pathname.split('/').pop() || 'index.html')
      .replace(/\.html$/, '')
      .toLowerCase() || 'index';
    nav.querySelectorAll('.nav__link[data-page]').forEach(a => {
      const page = a.getAttribute('data-page').toLowerCase();
      if (page === path) a.classList.add('is-active');
    });
  }

  // ---- Reveal on scroll ----
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = document.querySelectorAll('.reveal');
  const showAll = () => targets.forEach(el => el.classList.add('is-in'));

  if (reduce || !('IntersectionObserver' in window)) {
    showAll();
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(el => io.observe(el));
    // Safety net: if anything is still hidden after 1.5s (e.g. headless
    // screenshots, prerender, etc.), reveal it so content is never lost.
    setTimeout(showAll, 1500);
  }

  // ---- Footer year ----
  const yr = document.getElementById('year');
  if (yr) yr.textContent = String(new Date().getFullYear());
})();

