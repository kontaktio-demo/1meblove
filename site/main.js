/* ═══════════════════════════════════════════════
   MEBLOVE — Main JS
   ─ Nav scroll state
   ─ Active nav link detection
   ─ Mobile menu
   ─ Scroll-triggered fade-in
   ─ Accordion
   ─ Filter tabs (nasze-meble.html)
   ─ Swatch selector
   ─ Horizontal drag scroll (materials track)
   ─ Scroll progress bar
   ─ Unsplash image mapping for .placeholder-img
   ─ Reveal / parallax for hero + split sections
   ─ Animated stat counters
   ─ Cookie consent banner (accept all / necessary only / customise)
   ═══════════════════════════════════════════════ */

(() => {
  'use strict';

  // ─── 1. Unsplash image pool ──────────────────────
  // Each bucket is picked based on the dominant colour
  // in the element's inline background gradient.
  const UNSPLASH = {
    walnut: [ // dark wood, walnut, moody
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=1400&q=80',
    ],
    oak: [ // warm oak, dining, orange-brown
      'https://images.unsplash.com/photo-1449247613801-ab06418e2861?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1400&q=80',
    ],
    light: [ // light bedroom / sofa / beige
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=80',
    ],
    dark: [ // very dark moody interior
      'https://images.unsplash.com/photo-1558211583-d26f610c1eb1?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1400&q=80',
    ],
    neutral: [ // built-ins, neutral beige interiors, shelves
      'https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1400&q=80',
    ],
    marble: [
      'https://images.unsplash.com/photo-1615875605825-5eb9bb5d52ac?auto=format&fit=crop&w=1400&q=80',
    ],
    linen: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1400&q=80',
    ],
    workshop: [
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=1400&q=80',
    ],
  };

  const pickBucket = (style) => {
    const s = (style || '').toLowerCase();
    if (s.includes('#6b4226') || s.includes('#3e2010') || s.includes('#5c3a1e') || s.includes('#2e1408') || s.includes('#8c5830')) return 'walnut';
    if (s.includes('#c8925c') || s.includes('#a06b3a') || s.includes('#a06838') || s.includes('#704828') || s.includes('#8c6030')) return 'oak';
    if (s.includes('#1a1714') || s.includes('#3a3330')) return 'dark';
    if (s.includes('#c4a882') || s.includes('#8c7858') || s.includes('#a09070') || s.includes('#786850') || s.includes('#b0a088') || s.includes('#908060')) return 'neutral';
    if (s.includes('#e8e4df') || s.includes('#cfcbc4') || s.includes('#e8e3dc')) return 'marble';
    if (s.includes('#eae4d8') || s.includes('#d4ccbe')) return 'linen';
    if (s.includes('#d8ccbe') || s.includes('#d4c4a8') || s.includes('#a89e90') || s.includes('#e0d0b8') || s.includes('#c0b098') || s.includes('#b8a890') || s.includes('#907860') || s.includes('#d0c8b8') || s.includes('#a8a090')) return 'light';
    return 'neutral';
  };

  const mapImages = () => {
    const counters = {};
    document.querySelectorAll('.placeholder-img').forEach((el) => {
      // Respect explicit override
      const override = el.dataset.img;
      // Skip material swatches
      const cls = el.className || '';
      if (cls.includes('swatch-')) return;

      let bucket;
      if (el.dataset.bucket && UNSPLASH[el.dataset.bucket]) {
        bucket = el.dataset.bucket;
      } else {
        bucket = pickBucket(el.getAttribute('style') || '');
      }
      const pool = UNSPLASH[bucket];
      counters[bucket] = (counters[bucket] || 0);
      const url = override || pool[counters[bucket] % pool.length];
      counters[bucket]++;

      // Preserve original gradient colours as an overlay for brand consistency
      const orig = (el.getAttribute('style') || '').match(/linear-gradient\([^)]+\)/);
      const overlay = orig ? `linear-gradient(135deg, rgba(15,14,13,.12), rgba(15,14,13,.28))` : `linear-gradient(135deg, rgba(15,14,13,.05), rgba(15,14,13,.2))`;

      el.style.background = `${overlay}, url("${url}") center/cover no-repeat, var(--surface-2)`;
      // Remove stripes overlay
      el.classList.add('placeholder-img--photo');
    });
  };

  // ─── 2. Cookie consent ───────────────────────────
  const COOKIE_KEY = 'meblove_cookie_consent_v1';

  const readConsent = () => {
    try { return JSON.parse(localStorage.getItem(COOKIE_KEY)); } catch (_) { return null; }
  };
  const writeConsent = (obj) => {
    obj.ts = Date.now();
    localStorage.setItem(COOKIE_KEY, JSON.stringify(obj));
  };

  const applyConsent = (c) => {
    // Hook for analytics / marketing scripts — currently a no-op.
    // When analytics is integrated later, guard its init with c.analytics === true.
    document.documentElement.dataset.cookieAnalytics = c.analytics ? '1' : '0';
    document.documentElement.dataset.cookieMarketing = c.marketing ? '1' : '0';
  };

  const cookieBannerHTML = `
    <div class="cookie-banner" role="dialog" aria-live="polite" aria-label="Informacja o plikach cookies">
      <div class="cookie-banner__inner">
        <div class="cookie-banner__text">
          <p class="cookie-banner__title">Szanujemy Twoją prywatność</p>
          <p class="cookie-banner__desc">
            Używamy plików cookies, aby strona działała sprawnie, żebyśmy mogli analizować ruch
            i (jeśli się zgodzisz) pokazywać Ci odpowiednie treści.
            Szczegóły znajdziesz w <a href="polityka-prywatnosci.html">Polityce prywatności</a>.
          </p>
        </div>
        <div class="cookie-banner__actions">
          <button type="button" class="btn btn-outline" data-cookie-action="reject">Tylko niezbędne</button>
          <button type="button" class="btn btn-ghost" data-cookie-action="customise">Dostosuj</button>
          <button type="button" class="btn btn-primary" data-cookie-action="accept">Akceptuj wszystkie</button>
        </div>
      </div>
    </div>

    <div class="cookie-modal" role="dialog" aria-modal="true" aria-label="Ustawienia plików cookies" hidden>
      <div class="cookie-modal__backdrop" data-cookie-action="close"></div>
      <div class="cookie-modal__card">
        <div class="cookie-modal__head">
          <h2 class="cookie-modal__title">Ustawienia plików cookies</h2>
          <button type="button" class="cookie-modal__close" data-cookie-action="close" aria-label="Zamknij">×</button>
        </div>
        <p class="cookie-modal__intro">
          Wybierz, na jakie kategorie plików cookies się zgadzasz.
          Zgodę możesz w każdej chwili zmienić lub wycofać.
        </p>

        <div class="cookie-option">
          <div>
            <p class="cookie-option__name">Niezbędne</p>
            <p class="cookie-option__desc">Konieczne do prawidłowego działania strony (np. pamiętanie Twojego wyboru zgody). Zawsze włączone.</p>
          </div>
          <label class="cookie-toggle"><input type="checkbox" checked disabled><span></span></label>
        </div>

        <div class="cookie-option">
          <div>
            <p class="cookie-option__name">Analityczne</p>
            <p class="cookie-option__desc">Pomagają nam zrozumieć, jak korzystasz ze strony, żebyśmy mogli ją ulepszać.</p>
          </div>
          <label class="cookie-toggle"><input type="checkbox" data-cookie-cat="analytics"><span></span></label>
        </div>

        <div class="cookie-option">
          <div>
            <p class="cookie-option__name">Marketingowe</p>
            <p class="cookie-option__desc">Używane do dopasowania treści i reklam do Twoich zainteresowań.</p>
          </div>
          <label class="cookie-toggle"><input type="checkbox" data-cookie-cat="marketing"><span></span></label>
        </div>

        <div class="cookie-modal__actions">
          <button type="button" class="btn btn-outline" data-cookie-action="reject">Odrzuć wszystkie</button>
          <button type="button" class="btn btn-primary" data-cookie-action="save">Zapisz wybór</button>
          <button type="button" class="btn btn-ghost" data-cookie-action="accept">Akceptuj wszystkie</button>
        </div>
      </div>
    </div>
  `;

  const initCookies = () => {
    const host = document.createElement('div');
    host.innerHTML = cookieBannerHTML;
    while (host.firstChild) document.body.appendChild(host.firstChild);

    const banner = document.querySelector('.cookie-banner');
    const modal  = document.querySelector('.cookie-modal');
    const already = readConsent();

    const showBanner = () => banner.classList.add('is-visible');
    const hideBanner = () => banner.classList.remove('is-visible');
    const openModal  = () => {
      // Reflect current state in toggles
      const current = readConsent() || {};
      modal.querySelectorAll('[data-cookie-cat]').forEach(cb => {
        cb.checked = !!current[cb.dataset.cookieCat];
      });
      modal.hidden = false;
      requestAnimationFrame(() => modal.classList.add('is-visible'));
      document.body.style.overflow = 'hidden';
    };
    const closeModal = () => {
      modal.classList.remove('is-visible');
      document.body.style.overflow = '';
      setTimeout(() => { modal.hidden = true; }, 250);
    };

    const finalise = (c) => {
      writeConsent(c);
      applyConsent(c);
      hideBanner();
      closeModal();
    };

    if (already) {
      applyConsent(already);
    } else {
      // Slight delay so hero animations can start first
      setTimeout(showBanner, 700);
    }

    document.addEventListener('click', (e) => {
      const a = e.target.closest('[data-cookie-action]');
      if (!a) return;
      const action = a.dataset.cookieAction;
      if (action === 'accept')    finalise({ necessary: true, analytics: true,  marketing: true  });
      if (action === 'reject')    finalise({ necessary: true, analytics: false, marketing: false });
      if (action === 'customise') openModal();
      if (action === 'close')     closeModal();
      if (action === 'save') {
        const c = { necessary: true };
        modal.querySelectorAll('[data-cookie-cat]').forEach(cb => { c[cb.dataset.cookieCat] = cb.checked; });
        finalise(c);
      }
    });

    // Expose a way to reopen preferences from footer / privacy policy
    window.mebloveOpenCookieSettings = () => {
      banner.classList.remove('is-visible');
      openModal();
    };
  };

  // ─── 3. DOM Ready ────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {

    // Scroll progress bar
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);
    const onScrollProgress = () => {
      const h = document.documentElement;
      const pct = (h.scrollTop) / ((h.scrollHeight - h.clientHeight) || 1);
      bar.style.transform = `scaleX(${Math.min(Math.max(pct, 0), 1)})`;
    };
    window.addEventListener('scroll', onScrollProgress, { passive: true });
    onScrollProgress();

    // Nav scroll state
    const nav = document.querySelector('.nav');
    if (nav) {
      const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    // Active nav link
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav__link[data-page]').forEach(link => {
      if (link.dataset.page === currentPath) link.classList.add('active');
    });

    // Mobile burger menu
    const burger = document.querySelector('.nav__burger');
    const drawer = document.querySelector('.nav__drawer');
    if (burger && drawer) {
      burger.addEventListener('click', () => {
        const open = burger.classList.toggle('open');
        drawer.classList.toggle('open', open);
        document.body.style.overflow = open ? 'hidden' : '';
      });
      drawer.querySelectorAll('.nav__link, .btn').forEach(link => {
        link.addEventListener('click', () => {
          burger.classList.remove('open');
          drawer.classList.remove('open');
          document.body.style.overflow = '';
        });
      });
    }

    // Scroll-triggered fade-in
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

    // Animated counters (stat-item__num with data-count)
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const duration = 1400;
        const start = performance.now();
        const step = (now) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          const v = Math.round(target * eased);
          el.textContent = v + suffix;
          if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        counterObserver.unobserve(el);
      });
    }, { threshold: 0.4 });
    document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

    // Accordion
    document.querySelectorAll('.accordion__trigger').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.accordion__item');
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.accordion__item.open').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    });

    // Filter tabs with DOM filtering
    document.querySelectorAll('.filters').forEach(group => {
      const btns = group.querySelectorAll('.filter-btn');
      btns.forEach(btn => {
        btn.addEventListener('click', () => {
          btns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const filter = (btn.dataset.filter || btn.textContent.trim().toLowerCase()).toLowerCase();
          const scope = group.closest('section') || document;
          const cards = scope.parentElement ? scope.parentElement.querySelectorAll('[data-cat]') : document.querySelectorAll('[data-cat]');
          // Fallback: query in document for items with data-cat
          const items = document.querySelectorAll('[data-cat]');
          items.forEach(item => {
            const cats = (item.dataset.cat || '').toLowerCase();
            const show = filter === 'wszystko' || cats.split(/\s+/).includes(filter);
            item.style.display = show ? '' : 'none';
          });
        });
      });
    });

    // Colour swatch selector
    document.querySelectorAll('.swatch-row').forEach(row => {
      row.querySelectorAll('.swatch').forEach(swatch => {
        swatch.addEventListener('click', () => {
          row.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
          swatch.classList.add('active');
        });
      });
    });

    // Horizontal drag-scroll
    document.querySelectorAll('.materials-track').forEach(track => {
      let isDown = false, startX, scrollLeft;
      track.addEventListener('mousedown', e => {
        isDown = true;
        startX = e.pageX - track.offsetLeft;
        scrollLeft = track.scrollLeft;
        track.style.userSelect = 'none';
      });
      const stop = () => { isDown = false; track.style.userSelect = ''; };
      track.addEventListener('mouseleave', stop);
      track.addEventListener('mouseup', stop);
      track.addEventListener('mousemove', e => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - track.offsetLeft;
        track.scrollLeft = scrollLeft - (x - startX) * 1.2;
      });
    });

    // Simple parallax on elements with .parallax
    const parallaxEls = document.querySelectorAll('.parallax');
    if (parallaxEls.length && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const onPar = () => {
        parallaxEls.forEach(el => {
          const rect = el.getBoundingClientRect();
          const winH = window.innerHeight;
          if (rect.bottom < 0 || rect.top > winH) return;
          const progress = (rect.top + rect.height / 2 - winH / 2) / winH;
          el.style.transform = `translate3d(0, ${progress * -24}px, 0)`;
        });
      };
      window.addEventListener('scroll', onPar, { passive: true });
      onPar();
    }

    // Map images, inject cookie banner
    mapImages();
    initCookies();

    // Form feedback (no backend) — just prevent actual submission
    const form = document.querySelector('.form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        if (!btn) return;
        const original = btn.textContent;
        btn.textContent = 'Dziękujemy — odpiszemy wkrótce ✓';
        btn.disabled = true;
        form.reset();
        setTimeout(() => { btn.textContent = original; btn.disabled = false; }, 4000);
      });
    }

  });
})();
