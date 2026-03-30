/**
 * Theme Switcher — Default / Dark / High Contrast
 * Persists selection in localStorage under key "theme"
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'theme';
  var THEMES = ['default', 'dark', 'hc'];
  var BUTTON_IDS = {
    default: 'defaultTheme',
    dark: 'bwTheme',
    hc: 'hcTheme'
  };

  function applyTheme(theme) {
    if (THEMES.indexOf(theme) === -1) {
      theme = 'default';
    }
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      // localStorage unavailable — degrade silently
    }
    updateButtons(theme);
  }

  function updateButtons(activeTheme) {
    THEMES.forEach(function (t) {
      var btn = document.getElementById(BUTTON_IDS[t]);
      if (!btn) return;
      var isActive = t === activeTheme;
      btn.setAttribute('aria-pressed', String(isActive));
      btn.classList.toggle('theme-btn--active', isActive);
    });
  }

  function init() {
    var saved = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      // localStorage unavailable
    }
    applyTheme(saved || 'default');

    THEMES.forEach(function (t) {
      var btn = document.getElementById(BUTTON_IDS[t]);
      if (!btn) return;
      btn.addEventListener('click', function () {
        applyTheme(t);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
