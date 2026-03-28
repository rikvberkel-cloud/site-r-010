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
     4. FADE-IN ON SCROLL (IntersectionObserver)
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
