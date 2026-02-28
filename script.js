const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function setActiveNav() {
  const sections = $$('section[id]');
  const y = window.scrollY + 120;

  let activeId = sections[0]?.id;
  for (const s of sections) {
    const top = s.offsetTop;
    if (top <= y) activeId = s.id;
  }

  $$('a[data-nav]').forEach((a) => {
    a.removeAttribute('aria-current');
    if (a.getAttribute('href') === `#${activeId}`) a.setAttribute('aria-current', 'page');
  });
}

function initTopbarScroll() {
  const topbar = $('.topbar');
  const onScroll = () => {
    if (window.scrollY > 10) topbar.classList.add('is-scrolled');
    else topbar.classList.remove('is-scrolled');
    setActiveNav();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initMobileNav() {
  const btn = $('#menuBtn');
  const panel = $('#mobilePanel');

  if (!btn || !panel) return;

  const close = () => {
    panel.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    const icon = btn.querySelector('i');
    if (icon) {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }
  };

  btn.addEventListener('click', () => {
    const isOpen = panel.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(isOpen));
    const icon = btn.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-bars', !isOpen);
      icon.classList.toggle('fa-times', isOpen);
    }
  });

  $$('#mobilePanel a').forEach((a) => a.addEventListener('click', close));
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}

function initSmoothScroll() {
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function initVideoFallback() {
  const fallbacks = document.querySelectorAll('.video-fallback');
  
  fallbacks.forEach(fallback => {
    const thumbnail = fallback.querySelector('.video-thumbnail');
    const videoId = fallback.dataset.videoId;
    
    if (!thumbnail || !videoId) return;
    
    thumbnail.addEventListener('click', () => {
      // Open YouTube in new tab (guaranteed to work)
      window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank', 'noopener,noreferrer');
    });
  });
}

function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  // Observe all animated elements
  document.querySelectorAll('.card, .section-header, .about-grid, .form').forEach(el => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initTopbarScroll();
  initMobileNav();
  initSmoothScroll();
  initVideoFallback();
  initScrollAnimations();
});
