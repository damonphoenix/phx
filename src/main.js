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
    const text2 = "Phoenix";
    
    const normalText = document.createTextNode('');
    const accentSpan = document.createElement('span');
    accentSpan.className = 'hero__name-accent';
    
    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    cursor.textContent = '|';
    
    el.appendChild(normalText);
    el.appendChild(accentSpan);
    el.appendChild(cursor);
    
    const typeSpeed = () => Math.floor(Math.random() * (120 - 40 + 1) + 40);
    
    const typeWord = (text, node, callback) => {
      let i = 0;
      const type = () => {
        if (i < text.length) {
          if (node.nodeType === Node.TEXT_NODE) {
            node.nodeValue += text.charAt(i);
          } else {
            node.textContent += text.charAt(i);
          }
          i++;
          setTimeout(type, typeSpeed());
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
          }
          ticking = false;
        });
        ticking = true;
      }
    });
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
});
