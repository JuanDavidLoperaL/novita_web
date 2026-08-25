document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.card').forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('is-scrolled', window.scrollY > 50);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('is-open');
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
    });
    mobileNav.querySelectorAll('a, button').forEach((el) => {
      el.addEventListener('click', () => {
        mobileNav.classList.remove('is-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  document.querySelectorAll('[data-carousel]').forEach((root) => {
    const viewport = root.querySelector('.carousel-viewport');
    const slides = Array.from(root.querySelectorAll('.carousel-slide'));
    const prevBtn = root.querySelector('.carousel-arrow-prev');
    const nextBtn = root.querySelector('.carousel-arrow-next');
    const dotsWrap = root.querySelector('.carousel-dots');
    if (!viewport || !slides.length) return;

    const dots = slides.map((slide, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', `Ir al testimonio ${index + 1}`);
      dot.addEventListener('click', () => {
        slide.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      });
      dotsWrap.appendChild(dot);
      return dot;
    });

    const setActiveDot = () => {
      const viewportLeft = viewport.getBoundingClientRect().left;
      let closestIndex = 0;
      let closestDistance = Infinity;
      slides.forEach((slide, index) => {
        const distance = Math.abs(slide.getBoundingClientRect().left - viewportLeft);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });
      dots.forEach((dot, index) => dot.classList.toggle('is-active', index === closestIndex));
    };

    let scrollFrame;
    viewport.addEventListener(
      'scroll',
      () => {
        cancelAnimationFrame(scrollFrame);
        scrollFrame = requestAnimationFrame(setActiveDot);
      },
      { passive: true }
    );

    prevBtn?.addEventListener('click', () => {
      viewport.scrollBy({ left: -viewport.clientWidth * 0.9, behavior: 'smooth' });
    });
    nextBtn?.addEventListener('click', () => {
      viewport.scrollBy({ left: viewport.clientWidth * 0.9, behavior: 'smooth' });
    });

    setActiveDot();
  });

  const navLinks = Array.from(document.querySelectorAll('.navbar-link, .mobile-nav-link'));
  const navSections = Array.from(document.querySelectorAll('main > section[id]'));
  if (navLinks.length && navSections.length && 'IntersectionObserver' in window) {
    const setActiveLink = (id) => {
      navLinks.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
      });
    };
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          setActiveLink(visible.target.id);
        }
      },
      { rootMargin: '-160px 0px -60% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    navSections.forEach((section) => sectionObserver.observe(section));
    setActiveLink(navSections[0].id);
  }

  const revealTargets = document.querySelectorAll('.reveal');
  if (revealTargets.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealTargets.forEach((el) => observer.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }
});
