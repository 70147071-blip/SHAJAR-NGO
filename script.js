window.addEventListener('DOMContentLoaded', () => {
  ThemeManager.initTheme();

  if (typeof initHomePage === 'function') {
    initHomePage();
  }
});