import './style.css';

// ============================================
// PHX.CX — Main Application Logic
// ============================================

// --- Theme Management ---
const ThemeManager = {
  init() {
    const saved = localStorage.getItem('phx-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'dark'); // Default dark
    this.set(theme);
    this.bindToggle();
  },

  set(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('phx-theme', theme);
    this.updateIcon(theme);
  },

  toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    this.set(current === 'dark' ? 'light' : 'dark');
  },

  updateIcon(theme) {
    const moon = document.getElementById('theme-icon-moon');
    const sun = document.getElementById('theme-icon-sun');
    if (moon && sun) {
      moon.style.display = theme === 'dark' ? 'none' : 'block';
      sun.style.display = theme === 'dark' ? 'block' : 'none';
    }
  },

  bindToggle() {
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', () => this.toggle());
    }
  }
};

// --- Mobile Navigation ---
const MobileNav = {
  init() {
    this.hamburger = document.getElementById('hamburger');
    this.menu = document.getElementById('mobile-menu');
    this.links = document.querySelectorAll('.mobile-link');
    this.isOpen = false;

    if (this.hamburger) {
      this.hamburger.addEventListener('click', () => this.toggle());
    }

    // Close on link click
    this.links.forEach(link => {
      link.addEventListener('click', () => this.close());
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.close();
    });
  },

  toggle() {
    this.isOpen = !this.isOpen;
    this.hamburger.classList.toggle('active', this.isOpen);
    this.menu.classList.toggle('show', this.isOpen);

    if (this.isOpen) {
      this.menu.classList.add('active');
      document.body.style.overflow = 'hidden';
    } else {
      this.menu.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  close() {
    this.isOpen = false;
    this.hamburger.classList.remove('active');
    this.menu.classList.remove('show', 'active');
    document.body.style.overflow = '';
  }
};

// --- Scroll Reveal Animation ---
const ScrollReveal = {
  init() {
    this.elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            this.observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
      }
    );

    this.elements.forEach(el => this.observer.observe(el));
  }
};

// --- Active Nav Link Highlighting ---
const NavHighlighter = {
  init() {
    this.sections = document.querySelectorAll('section[id]');
    this.navLinks = document.querySelectorAll('.nav__links a[href^="#"]');

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.setActive(entry.target.id);
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: `-${getComputedStyle(document.documentElement).getPropertyValue('--nav-height')} 0px -40% 0px`
      }
    );

    this.sections.forEach(section => this.observer.observe(section));
  },

  setActive(id) {
    this.navLinks.forEach(link => {
      link.style.color = link.getAttribute('href') === `#${id}`
        ? 'var(--text-primary)'
        : '';
    });
  }
};

// --- Smooth Scroll with Offset ---
const SmoothScroll = {
  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'));
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }
};

// --- Nav Background on Scroll ---
const NavScroll = {
  init() {
    const nav = document.getElementById('nav');
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 20) {
            nav.style.borderBottomColor = 'var(--border)';
          } else {
            nav.style.borderBottomColor = 'transparent';
          }
          ticking = false;
        });
        ticking = true;
      }
    });
  }
};



// --- Typewriter Effect ---
const Typewriter = {
  init() {
    const el = document.querySelector('.hero__name');
    if (!el) return;
    
    el.innerHTML = '';
    const text1 = "Damon ";
    const text2 = "Phoenix.";
    
    const normalText = document.createTextNode('');
    const accentSpan = document.createElement('span');
    accentSpan.className = 'hero__name-accent';
    
    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    cursor.textContent = '|';
    
    el.appendChild(normalText);
    el.appendChild(accentSpan);
    el.appendChild(cursor);
    
    const baseSpeed = () => Math.floor(Math.random() * (160 - 60 + 1) + 60);
    const extraPauseForChar = (ch) => {
      if (ch === ' ') return Math.floor(Math.random() * (420 - 180 + 1) + 180);
      if (ch === '.' || ch === ',' || ch === '!' || ch === '?' || ch === ':') {
        return Math.floor(Math.random() * (600 - 280 + 1) + 280);
      }
      return 0;
    };

    const shouldHesitate = () => Math.random() < 0.09;
    const hesitation = () => Math.floor(Math.random() * (520 - 220 + 1) + 220);

    const typeWord = (text, node, callback) => {
      let i = 0;
      const type = () => {
        if (i < text.length) {
          const ch = text.charAt(i);
          if (node.nodeType === Node.TEXT_NODE) {
            node.nodeValue += ch;
          } else {
            node.textContent += ch;
          }
          i++;
          const delay = baseSpeed() + extraPauseForChar(ch) + (shouldHesitate() ? hesitation() : 0);
          setTimeout(type, delay);
        } else if (callback) {
          callback();
        }
      };
      type();
    };

    // Wait a bit before typing starts for visual effect
    setTimeout(() => {
      typeWord(text1, normalText, () => {
        typeWord(text2, accentSpan, () => {
          cursor.classList.add('blink');
        });
      });
    }, 400); 
  }
};

// --- Parallax Subtle Effect on Hero ---
const HeroParallax = {
  init() {
    const hero = document.querySelector('.hero__content');
    const scrollIndicator = document.querySelector('.hero__scroll-indicator');
    if (!hero) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY;
          const rate = scrolled * 0.3;
          if (scrolled < window.innerHeight) {
            hero.style.transform = `translateY(${rate}px)`;
            hero.style.opacity = 1 - (scrolled / window.innerHeight) * 0.6;
            
            if (scrollIndicator) {
              const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
              const scrollProgress = scrolled / maxScroll;
              scrollIndicator.style.opacity = Math.max(0, Math.min(1, 1 - (scrollProgress / 0.5)));
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    });
  }
};

// --- Animated Blobs Background (Hero & Contact) ---
const BgCanvas = {
  init() {
    this.initCanvas('hero-canvas');
    this.initCanvas('contact-canvas');
  },

  initCanvas(id) {
    const canvas = document.getElementById(id);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height, orbs, rafId;

    const ORB_DEFS = {
      dark: [
        { r: 0.52, color: [41,  151, 255], alpha: 0.13, speed: 0.8 },
        { r: 0.42, color: [94,  92,  230], alpha: 0.10, speed: 1.1 },
        { r: 0.38, color: [90,  200, 250], alpha: 0.09, speed: 0.9 },
        { r: 0.30, color: [52,  211, 153], alpha: 0.07, speed: 1.2 },
        { r: 0.28, color: [167, 139, 250], alpha: 0.08, speed: 1.0 },
      ],
      light: [
        { r: 0.52, color: [0,   113, 227], alpha: 0.22, speed: 0.8 },
        { r: 0.42, color: [88,  86,  214], alpha: 0.18, speed: 1.1 },
        { r: 0.38, color: [52,  170, 220], alpha: 0.18, speed: 0.9 },
        { r: 0.30, color: [16,  185, 129], alpha: 0.15, speed: 1.2 },
        { r: 0.28, color: [139, 92,  246], alpha: 0.15, speed: 1.0 },
      ],
    };

    function resize() {
      width  = canvas.width  = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    }

    function isDark() {
      return document.documentElement.getAttribute('data-theme') !== 'light';
    }

    function buildOrbs() {
      const defs = isDark() ? ORB_DEFS.dark : ORB_DEFS.light;
      orbs = defs.map(d => ({
        x:     Math.random() * width,
        y:     Math.random() * height,
        vx:    (Math.random() - 0.5) * 0.35,
        vy:    (Math.random() - 0.5) * 0.35,
        baseRadius: Math.min(width, height) * d.r,
        radius: Math.min(width, height) * d.r,
        color:  d.color,
        baseAlpha: d.alpha,
        alpha:  d.alpha,
        speed:  d.speed,
        phase:  Math.random() * Math.PI * 2
      }));
    }

    function tick(time) {
      ctx.clearRect(0, 0, width, height);

      orbs.forEach(o => {
        o.x += o.vx;
        o.y += o.vy;
        
        if (o.x < -o.baseRadius)        o.x = width  + o.baseRadius;
        if (o.x > width  + o.baseRadius) o.x = -o.baseRadius;
        if (o.y < -o.baseRadius)        o.y = height + o.baseRadius;
        if (o.y > height + o.baseRadius) o.y = -o.baseRadius;

        // Pulse animation
        const pulse = Math.sin((time * 0.001 * o.speed) + o.phase);
        o.alpha = o.baseAlpha + (pulse * 0.04);
        o.radius = o.baseRadius + (pulse * (o.baseRadius * 0.15));

        const [r, g, b] = o.color;
        const grad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, Math.max(0, o.radius));
        grad.addColorStop(0,   `rgba(${r},${g},${b},${Math.max(0, o.alpha)})`);
        grad.addColorStop(0.5, `rgba(${r},${g},${b},${Math.max(0, o.alpha * 0.4)})`);
        grad.addColorStop(1,   `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(o.x, o.y, Math.max(0, o.radius), 0, Math.PI * 2);
        ctx.fill();
      });

      rafId = requestAnimationFrame(tick);
    }

    const parentEl = canvas.parentElement;
    const visObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          if (!rafId) rafId = requestAnimationFrame(tick);
        } else {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      });
    }, { threshold: 0 });
    if (parentEl) visObserver.observe(parentEl);

    const mutObs = new MutationObserver(buildOrbs);
    mutObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    window.addEventListener('resize', () => { resize(); buildOrbs(); });

    resize();
    buildOrbs();
    rafId = requestAnimationFrame(tick);
  }
};

// --- Initialize Everything ---
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  MobileNav.init();
  ScrollReveal.init();
  NavHighlighter.init();
  SmoothScroll.init();
  NavScroll.init();
  HeroParallax.init();
  Typewriter.init();
  BgCanvas.init();
});
