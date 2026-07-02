/* =================================================================
   VIRAJ BARAWKAR — PORTFOLIO SCRIPT
   Modular vanilla JS: each feature is a small self-contained function
   ================================================================= */
(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------
     LOADER
     --------------------------------------------------------------- */
  function initLoader() {
    const loader = document.getElementById('loader');
    const progress = document.getElementById('loaderProgress');
    if (!loader || !progress) return;

    let pct = 0;
    const tick = () => {
      pct += Math.random() * 18;
      if (pct >= 100) {
        pct = 100;
        progress.style.width = pct + '%';
        setTimeout(() => {
          loader.classList.add('is-hidden');
          document.body.style.overflow = '';
        }, 350);
        return;
      }
      progress.style.width = pct + '%';
      setTimeout(tick, 120);
    };
    document.body.style.overflow = 'hidden';
    setTimeout(tick, 200);

    window.addEventListener('load', () => {
      // safety net in case something above never fires
      setTimeout(() => {
        loader.classList.add('is-hidden');
        document.body.style.overflow = '';
      }, 2200);
    });
  }

  /* ---------------------------------------------------------------
     CURSOR
     --------------------------------------------------------------- */
  function initCursor() {
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    let dotX = 0, dotY = 0, ringX = 0, ringY = 0;
    let targetX = 0, targetY = 0;

    window.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      dotX = targetX;
      dotY = targetY;
      dot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
    });

    const animateRing = () => {
      ringX += (targetX - ringX) * 0.16;
      ringY += (targetY - ringY) * 0.16;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateRing);
    };
    requestAnimationFrame(animateRing);

    const interactive = document.querySelectorAll('a, button, .filter-btn, input, textarea');
    interactive.forEach((el) => {
      el.addEventListener('mouseenter', () => ring.classList.add('is-active'));
      el.addEventListener('mouseleave', () => ring.classList.remove('is-active'));
    });
  }

  /* ---------------------------------------------------------------
     THEME TOGGLE (dark default, persisted)
     --------------------------------------------------------------- */
  function initTheme() {
    const toggle = document.getElementById('themeToggle');
    const root = document.documentElement;
    const stored = localStorage.getItem('vb-theme');
    if (stored === 'light') {
      root.setAttribute('data-theme', 'light');
      toggle && toggle.setAttribute('aria-pressed', 'true');
    }
    if (!toggle) return;
    toggle.addEventListener('click', () => {
      const isLight = root.getAttribute('data-theme') === 'light';
      if (isLight) {
        root.removeAttribute('data-theme');
        localStorage.setItem('vb-theme', 'dark');
        toggle.setAttribute('aria-pressed', 'false');
      } else {
        root.setAttribute('data-theme', 'light');
        localStorage.setItem('vb-theme', 'light');
        toggle.setAttribute('aria-pressed', 'true');
      }
    });
  }

  /* ---------------------------------------------------------------
     NAV: scroll state, burger menu, active link highlight
     --------------------------------------------------------------- */
  function initNav() {
    const nav = document.getElementById('nav');
    const burger = document.getElementById('navBurger');
    const navLinks = document.querySelectorAll('.nav-link');
    if (!nav) return;

    const onScroll = () => {
      nav.classList.toggle('is-scrolled', window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    if (burger) {
      burger.addEventListener('click', () => {
        const expanded = burger.getAttribute('aria-expanded') === 'true';
        burger.setAttribute('aria-expanded', String(!expanded));
        nav.classList.toggle('is-open', !expanded);
      });
      navLinks.forEach((link) => {
        link.addEventListener('click', () => {
          burger.setAttribute('aria-expanded', 'false');
          nav.classList.remove('is-open');
        });
      });
    }

    // active section highlight
    const sections = Array.from(navLinks)
      .map((l) => document.querySelector(l.getAttribute('href')))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((l) => {
              l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
            });
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
  }

  /* ---------------------------------------------------------------
     TYPING ANIMATION
     --------------------------------------------------------------- */
  function initTyping() {
    const el = document.getElementById('typedRole');
    if (!el) return;
    const words = ['Artificial Intelligence', 'Machine Learning', 'Web Development', 'Public Speaking'];
    if (prefersReducedMotion) {
      el.textContent = words[0];
      return;
    }

    let wordIndex = 0, charIndex = 0, deleting = false;

    const type = () => {
      const word = words[wordIndex];
      if (!deleting) {
        charIndex++;
        el.textContent = word.slice(0, charIndex);
        if (charIndex === word.length) {
          deleting = true;
          return setTimeout(type, 1600);
        }
      } else {
        charIndex--;
        el.textContent = word.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
        }
      }
      setTimeout(type, deleting ? 35 : 65);
    };
    type();
  }

  /* ---------------------------------------------------------------
     REVEAL ON SCROLL
     --------------------------------------------------------------- */
  function initReveal() {
    const items = document.querySelectorAll('[data-reveal]');
    if (!items.length) return;

    if (prefersReducedMotion) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            const delay = (entry.target.dataset.revealIndex || 0) * 60;
            setTimeout(() => entry.target.classList.add('is-visible'), delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );

    // stagger siblings inside the same parent grid slightly
    const groups = {};
    items.forEach((el) => {
      const parentKey = el.parentElement ? el.parentElement.className : 'root';
      groups[parentKey] = groups[parentKey] || 0;
      el.dataset.revealIndex = groups[parentKey]++;
      observer.observe(el);
    });
  }

  /* ---------------------------------------------------------------
     ANIMATED COUNTERS (hero stats + achievements)
     --------------------------------------------------------------- */
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const animate = (el) => {
      const target = parseInt(el.dataset.count, 10) || 0;
      if (prefersReducedMotion) {
        el.textContent = target;
        return;
      }
      const duration = 1400;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      };
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => observer.observe(el));
  }

  /* ---------------------------------------------------------------
     ANIMATED SKILL BARS
     --------------------------------------------------------------- */
  function initSkillBars() {
    const bars = document.querySelectorAll('.skill-bar-fill');
    if (!bars.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const level = entry.target.dataset.level || 0;
            entry.target.style.width = level + '%';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    bars.forEach((b) => observer.observe(b));
  }

  /* ---------------------------------------------------------------
     PROJECT FILTERING
     --------------------------------------------------------------- */
  function initProjectFilter() {
    const buttons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.project-card');
    if (!buttons.length) return;

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const filter = btn.dataset.filter;
        cards.forEach((card) => {
          const match = filter === 'all' || card.dataset.category === filter;
          card.classList.toggle('is-filtered-out', !match);
        });
      });
    });
  }

  /* ---------------------------------------------------------------
     MAGNETIC BUTTONS
     --------------------------------------------------------------- */
  function initMagnetic() {
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches || prefersReducedMotion) return;
    const items = document.querySelectorAll('[data-magnetic]');
    items.forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  /* ---------------------------------------------------------------
     BUTTON RIPPLE
     --------------------------------------------------------------- */
  function initRipple() {
    document.querySelectorAll('.btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const rect = btn.getBoundingClientRect();
        btn.style.setProperty('--rx', `${e.clientX - rect.left}px`);
        btn.style.setProperty('--ry', `${e.clientY - rect.top}px`);
        btn.classList.remove('is-rippling');
        // force reflow to restart animation
        void btn.offsetWidth;
        btn.classList.add('is-rippling');
      });
    });
  }

  /* ---------------------------------------------------------------
     SCROLL PROGRESS BAR
     --------------------------------------------------------------- */
  function initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = pct + '%';
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  }

  /* ---------------------------------------------------------------
     BACK TO TOP
     --------------------------------------------------------------- */
  function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('is-visible', window.scrollY > 700);
    }, { passive: true });
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------------------------------------------------------------
     FLOATING PARTICLES (canvas)
     --------------------------------------------------------------- */
  function initParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas || prefersReducedMotion) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let width, height;

    const colors = ['rgba(212,175,55,0.5)', 'rgba(139,92,246,0.45)', 'rgba(0,229,255,0.4)'];

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const count = Math.min(60, Math.floor((width * height) / 26000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.6 + 0.6,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
  }

  /* ---------------------------------------------------------------
     HERO MOUSE PARALLAX ON BLOBS
     --------------------------------------------------------------- */
  function initParallax() {
    if (prefersReducedMotion) return;
    const blobs = document.querySelectorAll('.blob');
    if (!blobs.length) return;
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      blobs.forEach((blob, i) => {
        const strength = (i + 1) * 8;
        blob.style.translate = `${x * strength}px ${y * strength}px`;
      });
    });
  }

  /* ---------------------------------------------------------------
     CONTACT FORM (client-side only, no backend wired up)
     --------------------------------------------------------------- */
  function initContactForm() {
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    const label = document.getElementById('submitLabel');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = (data.get('name') || '').toString().trim();
      const email = (data.get('email') || '').toString().trim();
      const message = (data.get('message') || '').toString().trim();

      if (!name || !email || !message) {
        status.textContent = 'Please fill in every field before sending.';
        status.style.color = '#ff6b6b';
        return;
      }

      label.textContent = 'Sending…';
      setTimeout(() => {
        label.textContent = 'Send Message';
        status.style.color = '';
        status.textContent = `Thanks, ${name.split(' ')[0]} — your message is drafted. Connect a form backend to deliver it.`;
        form.reset();
      }, 900);
    });
  }

  /* ---------------------------------------------------------------
     MISC: footer year
     --------------------------------------------------------------- */
  function initMisc() {
    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
  }

  /* ---------------------------------------------------------------
     INIT
     --------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initCursor();
    initTheme();
    initNav();
    initTyping();
    initReveal();
    initCounters();
    initSkillBars();
    initProjectFilter();
    initMagnetic();
    initRipple();
    initScrollProgress();
    initBackToTop();
    initParticles();
    initParallax();
    initContactForm();
    initMisc();
  });
})();
