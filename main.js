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

  // ---- Hero parallax (subtle) ----
  const heroMedia = document.querySelector('.hero__media');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (heroMedia && !reduceMotion) {
    let ticking = false;
    const update = () => {
      const y = Math.min(window.scrollY, window.innerHeight);
      heroMedia.style.transform = 'translate3d(0,' + (y * 0.18) + 'px,0)';
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  // ---- Lightbox (for [data-lightbox] tiles) ----
  const lbTriggers = Array.from(document.querySelectorAll('[data-lightbox]'));
  if (lbTriggers.length) {
    const items = lbTriggers.map(el => {
      const innerImg = el.querySelector('img');
      return {
        src: el.getAttribute('data-src') || (innerImg && (innerImg.currentSrc || innerImg.src)) || '',
        alt: el.getAttribute('data-alt') || (innerImg && innerImg.alt) || '',
        caption: el.getAttribute('data-caption') || ''
      };
    });

    // Allow only safe relative/absolute http(s) image paths to prevent
    // javascript:/data: URLs from being injected via data-src.
    const safeSrc = (s) => {
      if (typeof s !== 'string') return '';
      const trimmed = s.trim();
      if (/^\s*javascript:/i.test(trimmed)) return '';
      if (/^\s*data:/i.test(trimmed)) return '';
      return trimmed;
    };

    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Powiększone zdjęcie realizacji');
    lb.innerHTML = `
      <button type="button" class="lightbox__close" aria-label="Zamknij">×</button>
      <button type="button" class="lightbox__btn lightbox__prev" aria-label="Poprzednie zdjęcie">‹</button>
      <button type="button" class="lightbox__btn lightbox__next" aria-label="Następne zdjęcie">›</button>
      <div class="lightbox__stage">
        <img class="lightbox__img" alt="" />
        <span class="lightbox__caption"></span>
      </div>
    `;
    document.body.appendChild(lb);

    const imgEl = lb.querySelector('.lightbox__img');
    const capEl = lb.querySelector('.lightbox__caption');
    let idx = 0;
    let lastFocus = null;

    const render = () => {
      const it = items[idx];
      imgEl.src = safeSrc(it.src);
      imgEl.alt = it.alt;
      capEl.textContent = it.caption || ('Realizacja ' + (idx + 1) + ' / ' + items.length);
    };
    const open = (i, originEl) => {
      idx = i;
      lastFocus = originEl || document.activeElement;
      render();
      lb.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      lb.querySelector('.lightbox__close').focus();
    };
    const close = () => {
      lb.classList.remove('is-open');
      document.body.style.overflow = '';
      if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    };
    const next = () => { idx = (idx + 1) % items.length; render(); };
    const prev = () => { idx = (idx - 1 + items.length) % items.length; render(); };

    lbTriggers.forEach((el, i) => {
      // make non-anchor elements act like buttons
      if (el.tagName !== 'A' && el.tagName !== 'BUTTON') {
        el.setAttribute('role', 'button');
        el.setAttribute('tabindex', '0');
      }
      el.addEventListener('click', (e) => {
        e.preventDefault();
        open(i, el);
      });
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i, el); }
      });
    });

    lb.querySelector('.lightbox__close').addEventListener('click', close);
    lb.querySelector('.lightbox__next').addEventListener('click', next);
    lb.querySelector('.lightbox__prev').addEventListener('click', prev);
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    });
  }

  // ---- Cookie consent ----
  const CONSENT_KEY = 'meblove_cookie_consent_v1';
  const DEFAULTS = { necessary: true, analytics: false, marketing: false };

  const readConsent = () => {
    try {
      const raw = localStorage.getItem(CONSENT_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return { ...DEFAULTS, ...(parsed.prefs || {}) };
    } catch (_) { return null; }
  };
  const writeConsent = (prefs) => {
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify({
        prefs: { ...DEFAULTS, ...prefs, necessary: true },
        savedAt: new Date().toISOString(),
        version: 1
      }));
    } catch (_) { /* ignore */ }
  };

  const buildConsentDom = () => {
    const wrap = document.createElement('div');
    wrap.className = 'cookie';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-live', 'polite');
    wrap.setAttribute('aria-label', 'Pliki cookies');
    wrap.innerHTML = `
      <div class="cookie__panel cookie__panel--banner" data-view="banner" role="region">
        <div class="cookie__body">
          <h3 class="cookie__title">Szanujemy Twoją prywatność</h3>
          <p class="cookie__text">Używamy plików cookies, aby strona działała poprawnie i żebyśmy mogli ją ulepszać. Możesz zaakceptować wszystkie, odrzucić opcjonalne lub samodzielnie wybrać kategorie. Szczegóły w <a href="polityka-prywatnosci.html">polityce prywatności</a>.</p>
        </div>
        <div class="cookie__actions">
          <button type="button" class="btn btn--ghost cookie__btn" data-action="reject">Odrzuć wszystkie</button>
          <button type="button" class="btn btn--ghost cookie__btn" data-action="settings">Wybierz</button>
          <button type="button" class="btn btn--primary cookie__btn" data-action="accept">Akceptuj wszystkie</button>
        </div>
      </div>

      <div class="cookie__panel cookie__panel--settings" data-view="settings" hidden>
        <div class="cookie__body">
          <h3 class="cookie__title">Ustawienia plików cookies</h3>
          <p class="cookie__text">Wybierz, na które kategorie cookies się zgadzasz. Cookies niezbędne są wymagane do działania strony i nie można ich wyłączyć.</p>
          <ul class="cookie__list">
            <li class="cookie__item">
              <label class="cookie__row">
                <span class="cookie__row-head">
                  <span class="cookie__row-name">Niezbędne</span>
                  <span class="cookie__switch cookie__switch--locked" aria-hidden="true">
                    <input type="checkbox" checked disabled />
                    <span class="cookie__slider"></span>
                  </span>
                </span>
                <span class="cookie__row-desc">Konieczne do działania strony – m.in. zapamiętanie Twoich preferencji cookies.</span>
              </label>
            </li>
            <li class="cookie__item">
              <label class="cookie__row">
                <span class="cookie__row-head">
                  <span class="cookie__row-name">Analityczne</span>
                  <span class="cookie__switch">
                    <input type="checkbox" data-cat="analytics" />
                    <span class="cookie__slider"></span>
                  </span>
                </span>
                <span class="cookie__row-desc">Pomagają nam zrozumieć, jak korzystasz ze strony, żebyśmy mogli ją ulepszać.</span>
              </label>
            </li>
            <li class="cookie__item">
              <label class="cookie__row">
                <span class="cookie__row-head">
                  <span class="cookie__row-name">Marketingowe</span>
                  <span class="cookie__switch">
                    <input type="checkbox" data-cat="marketing" />
                    <span class="cookie__slider"></span>
                  </span>
                </span>
                <span class="cookie__row-desc">Pozwalają dopasować przekaz i mierzyć skuteczność działań – obecnie nieużywane.</span>
              </label>
            </li>
          </ul>
        </div>
        <div class="cookie__actions">
          <button type="button" class="btn btn--ghost cookie__btn" data-action="reject">Odrzuć wszystkie</button>
          <button type="button" class="btn btn--ghost cookie__btn" data-action="save">Zapisz wybór</button>
          <button type="button" class="btn btn--primary cookie__btn" data-action="accept">Akceptuj wszystkie</button>
        </div>
      </div>
    `;
    return wrap;
  };

  let consentEl = null;
  const showView = (view) => {
    if (!consentEl) return;
    consentEl.querySelectorAll('[data-view]').forEach(p => {
      p.hidden = p.getAttribute('data-view') !== view;
    });
  };
  const setSwitches = (prefs) => {
    if (!consentEl) return;
    consentEl.querySelectorAll('input[data-cat]').forEach(inp => {
      inp.checked = !!prefs[inp.getAttribute('data-cat')];
    });
  };
  const collectSwitches = () => {
    const prefs = { ...DEFAULTS };
    if (!consentEl) return prefs;
    consentEl.querySelectorAll('input[data-cat]').forEach(inp => {
      prefs[inp.getAttribute('data-cat')] = inp.checked;
    });
    return prefs;
  };
  const closeConsent = () => {
    if (!consentEl) return;
    consentEl.classList.remove('is-visible');
    setTimeout(() => { if (consentEl && consentEl.parentNode) consentEl.parentNode.removeChild(consentEl); consentEl = null; }, 250);
  };
  const openConsent = (view) => {
    if (consentEl) { showView(view || 'banner'); return; }
    consentEl = buildConsentDom();
    document.body.appendChild(consentEl);
    const existing = readConsent() || DEFAULTS;
    setSwitches(existing);
    showView(view || 'banner');
    requestAnimationFrame(() => consentEl && consentEl.classList.add('is-visible'));

    consentEl.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const action = btn.getAttribute('data-action');
      if (action === 'accept') {
        writeConsent({ necessary: true, analytics: true, marketing: true });
        closeConsent();
      } else if (action === 'reject') {
        writeConsent({ necessary: true, analytics: false, marketing: false });
        closeConsent();
      } else if (action === 'settings') {
        showView('settings');
      } else if (action === 'save') {
        writeConsent(collectSwitches());
        closeConsent();
      }
    });
  };

  // First-visit banner
  if (!readConsent()) {
    // Slight delay so the page paints first.
    setTimeout(() => openConsent('banner'), 350);
  }

  // Re-open from anywhere via [data-cookie-settings] link/button
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-cookie-settings]');
    if (!trigger) return;
    e.preventDefault();
    openConsent('settings');
  });

  // Expose for advanced use
  window.MebloveCookies = {
    open: () => openConsent('banner'),
    openSettings: () => openConsent('settings'),
    get: readConsent,
    reset: () => { try { localStorage.removeItem(CONSENT_KEY); } catch(_){} openConsent('banner'); }
  };
})();

