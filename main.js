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

  // Het zichtbare adres (boekingen@daddy.nl) is een vanity-adres.
  // De mail wordt bezorgd op het echte adres uit data-mailto.
  function mailTarget() {
    var real = linkEl && linkEl.getAttribute('data-mailto');
    return (real || emailEl.textContent).trim();
  }

  function updateMailto() {
    var addr = mailTarget();
    var isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addr);

    if (isValid) {
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
    var addr = mailTarget();
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
      var addr = mailTarget();
      var isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addr);

      if (isValid) {
        window.location.href = 'mailto:' + addr;
      } else {
        copyBtn.click();
      }
    });
  }

  /* ------------------------------------------
     3. CURSOR GLOW (desktop only)
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
     4. PARALLAX SCROLLING
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
     5. SKILL TREE SCROLL ANIMATION
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
     6. FADE-IN ON SCROLL (IntersectionObserver)
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
