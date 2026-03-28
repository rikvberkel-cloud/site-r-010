/* ============================================
   R-010 — main.js
   ============================================ */

(function () {
  'use strict';

  /* ------------------------------------------
     1. MAILTO LINK — automatisch aan/uit
     ------------------------------------------
     Als het mailadres een geldig formaat heeft,
     wordt de mailto: link actief. Anders niet.
  */
  const emailEl = document.getElementById('emailAddress');
  const linkEl = document.getElementById('emailLink');

  function updateMailto() {
    const addr = emailEl.textContent.trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addr);
    // TODO: vervang boekingen@r-010.nl door het echte mailadres in index.html
    const isPlaceholder = addr === 'boekingen@r-010.nl';

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
  const copyBtn = document.getElementById('copyBtn');

  copyBtn.addEventListener('click', function () {
    const addr = emailEl.textContent.trim();
    navigator.clipboard.writeText(addr).then(function () {
      copyBtn.textContent = 'Gekopieerd!';
      copyBtn.classList.add('btn--copied');
      setTimeout(function () {
        copyBtn.textContent = 'Kopieer mailadres';
        copyBtn.classList.remove('btn--copied');
      }, 2000);
    }).catch(function () {
      // Fallback voor oudere browsers
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
     3. FADE-IN ON SCROLL (IntersectionObserver)
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
    // Geen observer? Alles direct zichtbaar
    document.querySelectorAll('.fade-in').forEach(function (el) {
      el.classList.add('fade-in--visible');
    });
  }
})();
