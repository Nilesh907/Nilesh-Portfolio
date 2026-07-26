// ===========================
// NILESH SEN — PORTFOLIO JS
// ===========================

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---- NAV SCROLL EFFECT ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.borderBottomColor = window.scrollY > 40 ? '#242435' : 'transparent';
});

// ---- HAMBURGER MENU ----
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

hamburger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('open', menuOpen);
  const spans = hamburger.querySelectorAll('span');
  if (menuOpen) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

function closeMobile() {
  menuOpen = false;
  mobileMenu.classList.remove('open');
  hamburger.querySelectorAll('span').forEach(s => {
    s.style.transform = '';
    s.style.opacity = '';
  });
}

// ---- SMOOTH SCROLL ----
document.addEventListener('click', (e) => {
  const link = e.target.closest('a');
  if (!link) return;
  const href = link.getAttribute('href');
  if (!href) return;
  if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http:') || href.startsWith('https://')) return;
  if (href.startsWith('#')) {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    closeMobile();
  }
});

// ---- ACTIVE NAV HIGHLIGHT ----
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 130) current = s.id;
  });
  navLinks.forEach(l => {
    l.style.color = l.getAttribute('href') === `#${current}` ? 'var(--accent)' : '';
  });
});

// ---- SCROLL REVEAL — non-project elements only ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ---- PROJECT CARD STACK ANIMATION — projects section only ----
const stackObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('stack-visible');
      stackObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.project-block').forEach(card => stackObserver.observe(card));

// ---- CLOSE MOBILE MENU ON OUTSIDE CLICK ----
document.addEventListener('click', (e) => {
  if (menuOpen && !mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
    closeMobile();
  }
});

// ---- AUTO CURRENT YEAR ----
const yearEl = document.getElementById('currentYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---- SCROLL PROGRESS BAR ----
const scrollProgress = document.getElementById('scrollProgress');
function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? scrollTop / docHeight : 0;
  scrollProgress.style.transform = `scaleX(${pct})`;
}
if (scrollProgress) {
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();
}

// ---- HERO CURSOR SPOTLIGHT (desktop only, respects reduced motion) ----
const heroSection = document.getElementById('hero');
const heroSpotlight = document.getElementById('heroSpotlight');
if (heroSection && heroSpotlight && !prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
  let ticking = false;
  heroSection.addEventListener('mousemove', (e) => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const rect = heroSection.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      heroSpotlight.style.setProperty('--x', `${x}%`);
      heroSpotlight.style.setProperty('--y', `${y}%`);
      ticking = false;
    });
  });
}

// ---- HERO TYPEWRITER (cycles through role titles) ----
const typedRoleEl = document.getElementById('typedRole');
if (typedRoleEl) {
  const roles = ['Building Secure REST APIs', 'Authentication Systems', 'Database Design', 'Role-Based Access Control'];
  if (prefersReducedMotion) {
    typedRoleEl.textContent = roles[0];
  } else {
    let roleIndex = 0, charIndex = roles[0].length, deleting = true; // start by deleting the HTML default text, then type fresh
    typedRoleEl.textContent = roles[0];

    function tick() {
      const current = roles[roleIndex];
      if (deleting) {
        charIndex--;
        typedRoleEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          setTimeout(tick, 400);
          return;
        }
        setTimeout(tick, 40);
      } else {
        const next = roles[roleIndex];
        charIndex++;
        typedRoleEl.textContent = next.slice(0, charIndex);
        if (charIndex === next.length) {
          deleting = true;
          setTimeout(tick, 1800);
          return;
        }
        setTimeout(tick, 70);
      }
    }
    setTimeout(tick, 1600);
  }
}

// ---- CONTACT FORM (static site — opens a pre-filled mailto link) ----
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('cf-name').value.trim();
    const email = document.getElementById('cf-email').value.trim();
    const message = document.getElementById('cf-message').value.trim();
    if (!name || !email || !message) return;

    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:nileshsen873@gmail.com?subject=${subject}&body=${body}`;

    if (formNote) formNote.textContent = 'Opening your email app…';
  });
}

// ---- MAGNETIC BUTTONS (subtle pull toward cursor, desktop only) ----
if (!prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
  const magneticStrength = 0.25;
  const maxOffset = 6;
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      const mx = Math.max(-maxOffset, Math.min(maxOffset, relX * magneticStrength));
      const my = Math.max(-maxOffset, Math.min(maxOffset, relY * magneticStrength));
      btn.style.setProperty('--mx', `${mx}px`);
      btn.style.setProperty('--my', `${my}px`);
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.setProperty('--mx', '0px');
      btn.style.setProperty('--my', '0px');
    });
  });
}