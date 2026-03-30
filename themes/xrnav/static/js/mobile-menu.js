/**
 * Mobile Menu — hamburger toggle with Escape key + focus management
 */
(function () {
  'use strict';

  function init() {
    var toggle = document.querySelector('.mobile-menu-toggle');
    var nav = document.getElementById('primary-nav');
    if (!toggle || !nav) return;

    function openMenu() {
      nav.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      // Focus the first link in the nav
      var firstLink = nav.querySelector('a');
      if (firstLink) firstLink.focus();
    }

    function closeMenu() {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }

    function isOpen() {
      return nav.classList.contains('is-open');
    }

    toggle.addEventListener('click', function () {
      if (isOpen()) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Escape key closes menu and returns focus to toggle
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) {
        closeMenu();
      }
    });

    // Close menu when focus leaves the nav (Tab past last item)
    nav.addEventListener('focusout', function (e) {
      // Use setTimeout to let the new focus target settle
      setTimeout(function () {
        if (isOpen() && !nav.contains(document.activeElement) && document.activeElement !== toggle) {
          closeMenu();
        }
      }, 0);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
