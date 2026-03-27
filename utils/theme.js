const ThemeManager = (() => {
  const getStoredTheme = () => localStorage.getItem(THEME_KEY) || THEME_LIGHT;

  const applyTheme = (theme) => {
    const root = document.documentElement;
    if (theme === THEME_DARK) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    updateToggleIcon(theme);
  };

  const updateToggleIcon = (theme) => {
    const sunIcons = document.querySelectorAll(".theme-icon-sun");
    const moonIcons = document.querySelectorAll(".theme-icon-moon");
    sunIcons.forEach(icon => {
      icon.style.display = theme === THEME_DARK ? "block" : "none";
    });
    moonIcons.forEach(icon => {
      icon.style.display = theme === THEME_DARK ? "none" : "block";
    });
  };

  const initTheme = () => {
    const theme = getStoredTheme();
    applyTheme(theme);
  };

  const toggleTheme = () => {
    const current = getStoredTheme();
    const next = current === THEME_DARK ? THEME_LIGHT : THEME_DARK;
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  };

  const getCurrentTheme = () => getStoredTheme();

  return { initTheme, toggleTheme, getCurrentTheme };
})();
