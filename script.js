/* ══════════════════════════════════════
   RAXOTECH — script.js
   Animaciones JS:
   1. Scroll reveal (IntersectionObserver)
   2. Active nav link on scroll
   3. Typing effect en hero title
   4. Scroll progress bar
   5. Cursor glow (desktop)
   6. Hamburger menu
   ══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────
     1. SCROLL PROGRESS BAR
  ───────────────────────────────────── */
  const progressBar = document.createElement('div');
  progressBar.id = 'progress-bar';
  document.body.prepend(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop    = window.scrollY;
    const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPct    = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = scrollPct + '%';
  }, { passive: true });


  /* ─────────────────────────────────────
     2. REVEAL ON SCROLL (IntersectionObserver)
  ───────────────────────────────────── */
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // No unobserve — keep visible once triggered
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => revealObserver.observe(el));


  /* ─────────────────────────────────────
     3. ACTIVE NAV LINK ON SCROLL
  ───────────────────────────────────── */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');
  const navH      = parseInt(getComputedStyle(document.documentElement)
                      .getPropertyValue('--nav-h')) || 70;

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.dataset.section === id || link.getAttribute('href') === `#${id}`
          );
        });
      }
    });
  }, {
    rootMargin: `-${navH}px 0px -55% 0px`,
    threshold: 0
  });

  sections.forEach(sec => sectionObserver.observe(sec));


  /* ─────────────────────────────────────
     4. HAMBURGER MENU
  ───────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinksContainer = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    navLinksContainer.classList.toggle('open', open);
  });

  // Close menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinksContainer.classList.remove('open');
    });
  });


  /* ─────────────────────────────────────
     5. TYPING EFFECT — hero title
  ───────────────────────────────────── */
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    // Save full text, clear it
    const fullText = 'Hola, soy Raxotech!';
    heroTitle.innerHTML = '';

    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    heroTitle.appendChild(cursor);

    let charIndex = 0;
    const typingSpeed = 60; // ms per character

    function typeChar() {
      if (charIndex < fullText.length) {
        const char = fullText[charIndex];
        const span = document.createElement('span');

        // Highlight "Raxotech" portion
        if (charIndex >= 10 && charIndex <= 17) {
          span.style.color = 'var(--purple-dark)';
          span.style.fontWeight = '900';
        }

        span.textContent = char;
        heroTitle.insertBefore(span, cursor);
        charIndex++;
        setTimeout(typeChar, typingSpeed);
      } else {
        // Remove blinking cursor after typing
        setTimeout(() => {
          cursor.style.display = 'none';
        }, 1500);
      }
    }

    // Delay start so page load animation finishes first
    setTimeout(typeChar, 600);
  }


  /* ─────────────────────────────────────
     6. CURSOR GLOW (desktop only)
  ───────────────────────────────────── */
  const isDesktop = window.matchMedia('(pointer: fine)').matches;

  if (isDesktop) {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

    let mouseX = -100, mouseY = -100;
    let currentX = -100, currentY = -100;
    let animId;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    function animateCursor() {
      // Smooth lag follow
      currentX += (mouseX - currentX) * 0.18;
      currentY += (mouseY - currentY) * 0.18;
      glow.style.left = currentX + 'px';
      glow.style.top  = currentY + 'px';
      animId = requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Hide on leave, show on enter
    document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { glow.style.opacity = '0.25'; });
  }


  /* ─────────────────────────────────────
     7. NAVBAR SCROLL SHADOW
  ───────────────────────────────────── */
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.3)';
    } else {
      navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.25)';
    }
  }, { passive: true });


  /* ─────────────────────────────────────
     8. SMOOTH SCROLL OFFSET (fix anchor + navbar)
  ───────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId  = anchor.getAttribute('href').slice(1);
      const target    = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ─────────────────────────────────────
     9. SKILL ITEMS HOVER PULSE
  ───────────────────────────────────── */
  document.querySelectorAll('.skill-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.textShadow = '0 0 12px rgba(107,63,160,0.3)';
    });
    item.addEventListener('mouseleave', () => {
      item.style.textShadow = '';
    });
  });


  /* ─────────────────────────────────────
     10. THUMBNAIL CARDS — tilt on hover
  ───────────────────────────────────── */
  document.querySelectorAll('.thumb-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -6;
      const rotateY = ((x - cx) / cx) *  6;
      card.style.transform = `perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

});
