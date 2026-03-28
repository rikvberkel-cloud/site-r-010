/* ============================================
   R-010 — main.js
   ============================================ */

(function () {
  'use strict';

  /* ------------------------------------------
     1. MAILTO LINK — automatisch aan/uit
     ------------------------------------------ */
  var emailEl = document.getElementById('emailAddress');
  var linkEl = document.getElementById('emailLink');

  function updateMailto() {
    var addr = emailEl.textContent.trim();
    var isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addr);
    // TODO: vervang boekingen@r-010.nl door het echte mailadres in index.html
    var isPlaceholder = addr === 'boekingen@r-010.nl';

    if (isValid && !isPlaceholder) {
      linkEl.href = 'mailto:' + addr;
      linkEl.removeAttribute('aria-disabled');
    } else {
      linkEl.href = '#';
      linkEl.setAttribute('aria-disabled', 'true');
    }
  }

  updateMailto();

  /* ------------------------------------------
     2. KOPIEER MAILADRES
     ------------------------------------------ */
  var copyBtn = document.getElementById('copyBtn');

  copyBtn.addEventListener('click', function () {
    var addr = emailEl.textContent.trim();
    navigator.clipboard.writeText(addr).then(function () {
      copyBtn.textContent = 'Gekopieerd!';
      copyBtn.classList.add('btn--copied');
      setTimeout(function () {
        copyBtn.textContent = 'Kopieer mailadres';
        copyBtn.classList.remove('btn--copied');
      }, 2000);
    }).catch(function () {
      var ta = document.createElement('textarea');
      ta.value = addr;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      copyBtn.textContent = 'Gekopieerd!';
      copyBtn.classList.add('btn--copied');
      setTimeout(function () {
        copyBtn.textContent = 'Kopieer mailadres';
        copyBtn.classList.remove('btn--copied');
      }, 2000);
    });
  });

  /* ------------------------------------------
     2b. CTA CONTACT BUTTON (copies email)
     ------------------------------------------ */
  var ctaContact = document.getElementById('ctaContact');

  if (ctaContact) {
    ctaContact.addEventListener('click', function () {
      var addr = emailEl.textContent.trim();
      var isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addr);
      var isPlaceholder = addr === 'boekingen@r-010.nl';

      if (isValid && !isPlaceholder) {
        window.location.href = 'mailto:' + addr;
      } else {
        navigator.clipboard.writeText(addr).then(function () {
          ctaContact.textContent = 'Mailadres gekopieerd!';
          ctaContact.classList.add('btn--copied');
          setTimeout(function () {
            ctaContact.textContent = 'Boek R-010';
            ctaContact.classList.remove('btn--copied');
          }, 2000);
        }).catch(function () {
          copyBtn.click();
        });
      }
    });
  }

  /* ------------------------------------------
     3. CAROUSEL
     ------------------------------------------ */
  var track = document.getElementById('carouselTrack');
  var prevBtn = document.getElementById('carouselPrev');
  var nextBtn = document.getElementById('carouselNext');
  var dotsContainer = document.getElementById('carouselDots');
  var slides = track ? track.querySelectorAll('.carousel__slide') : [];
  var current = 0;

  function buildDots() {
    if (!dotsContainer || slides.length < 2) return;
    for (var i = 0; i < slides.length; i++) {
      var dot = document.createElement('button');
      dot.className = 'carousel__dot' + (i === 0 ? ' carousel__dot--active' : '');
      dot.setAttribute('aria-label', 'Ga naar foto ' + (i + 1));
      dot.dataset.index = i;
      dot.addEventListener('click', function () {
        goTo(parseInt(this.dataset.index));
      });
      dotsContainer.appendChild(dot);
    }
  }

  function goTo(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    current = index;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    var dots = dotsContainer.querySelectorAll('.carousel__dot');
    for (var i = 0; i < dots.length; i++) {
      dots[i].classList.toggle('carousel__dot--active', i === current);
    }
  }

  if (slides.length > 0) {
    buildDots();
    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); });

    // Swipe support (touch)
    var startX = 0;
    track.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
    }, { passive: true });
    track.addEventListener('touchend', function (e) {
      var diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        goTo(diff > 0 ? current + 1 : current - 1);
      }
    }, { passive: true });
  }

  /* ------------------------------------------
     4. LIGHTBOX
     ------------------------------------------ */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.hidden = false;
    // Force reflow then add visible class for transition
    lightbox.offsetHeight;
    lightbox.classList.add('lightbox--visible');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('lightbox--visible');
    document.body.style.overflow = '';
    setTimeout(function () {
      lightbox.hidden = true;
      lightboxImg.src = '';
    }, 300);
  }

  // Click on photo frames with data-lightbox
  document.querySelectorAll('[data-lightbox]').forEach(function (el) {
    el.addEventListener('click', function () {
      var src = this.getAttribute('data-lightbox');
      var img = this.querySelector('img');
      // Only open if image is loaded (not fallback)
      if (img && !this.classList.contains('photo-frame--fallback')) {
        openLightbox(src, img.alt);
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  // Close on backdrop click
  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox && !lightbox.hidden) {
      closeLightbox();
    }
  });

  /* ------------------------------------------
     5. CURSOR GLOW (desktop only)
     ------------------------------------------ */
  var cursorGlow = document.getElementById('cursorGlow');
  var isTouch = window.matchMedia('(hover: none)').matches;

  if (cursorGlow && !isTouch) {
    var glowX = 0, glowY = 0, currentX = 0, currentY = 0;
    var glowActive = false;

    document.addEventListener('mousemove', function (e) {
      glowX = e.clientX;
      glowY = e.clientY;
      if (!glowActive) {
        glowActive = true;
        cursorGlow.classList.add('cursor-glow--visible');
        updateGlow();
      }
    });

    document.addEventListener('mouseleave', function () {
      glowActive = false;
      cursorGlow.classList.remove('cursor-glow--visible');
    });

    function updateGlow() {
      if (!glowActive) return;
      currentX += (glowX - currentX) * 0.15;
      currentY += (glowY - currentY) * 0.15;
      cursorGlow.style.transform = 'translate(' + (currentX - 160) + 'px,' + (currentY - 160) + 'px)';
      requestAnimationFrame(updateGlow);
    }
  }

  /* ------------------------------------------
     6. PARALLAX SCROLLING
     ------------------------------------------ */
  var parallaxSections = document.querySelectorAll('[data-parallax]');

  if (parallaxSections.length > 0 && !isTouch) {
    var ticking = false;

    function updateParallax() {
      var scrollY = window.scrollY;
      parallaxSections.forEach(function (section) {
        var speed = parseFloat(section.getAttribute('data-parallax'));
        var rect = section.getBoundingClientRect();
        var offset = (scrollY - section.offsetTop) * speed;
        var content = section.querySelector('.hero__content, .container');
        if (content) {
          content.style.transform = 'translateY(' + offset + 'px)';
        }
      });
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  /* ------------------------------------------
     7. SKILL TREE SCROLL ANIMATION
     ------------------------------------------ */
  var skillTree = document.querySelector('.skill-tree--animate');

  if (skillTree && 'IntersectionObserver' in window) {
    var skillObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('skill-tree--visible');
          skillObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    skillObserver.observe(skillTree);
  } else if (skillTree) {
    skillTree.classList.add('skill-tree--visible');
  }

  /* ------------------------------------------
     8. FADE-IN ON SCROLL (IntersectionObserver)
     ------------------------------------------ */
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in--visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.fade-in').forEach(function (el) {
      observer.observe(el);
    });
  } else {
    document.querySelectorAll('.fade-in').forEach(function (el) {
      el.classList.add('fade-in--visible');
    });
  }
})();
