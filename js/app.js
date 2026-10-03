/* =========================================================
   JG — FIND SKILLS. FIND WORK.
   GLOBAL APPLICATION JAVASCRIPT
   Frontend foundation
   ========================================================= */

(() => {
  "use strict";

  /* =======================================================
     CONFIGURATION
     ======================================================= */

  const JG_CONFIG = {
    version: "2.0.0",
    themeKey: "jg-theme",
    mobileBreakpoint: 1024
  };

  /* =======================================================
     SAFE STORAGE
     ======================================================= */

  const storage = {
    get(key) {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },

    set(key, value) {
      try {
        localStorage.setItem(key, value);
        return true;
      } catch {
        return false;
      }
    },

    remove(key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch {
        return false;
      }
    }
  };

  /* =======================================================
     DOM HELPERS
     ======================================================= */

  const $ = (selector, scope = document) =>
    scope.querySelector(selector);

  const $$ = (selector, scope = document) =>
    Array.from(scope.querySelectorAll(selector));

  /* =======================================================
     HTML ESCAPING
     ======================================================= */

  function escapeHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /* =======================================================
     THEME SYSTEM
     ======================================================= */

  function getSystemTheme() {
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function getSavedTheme() {
    const saved = storage.get(JG_CONFIG.themeKey);

    if (saved === "dark" || saved === "light") {
      return saved;
    }

    return getSystemTheme();
  }

  function applyTheme(theme, save = true) {
    const safeTheme = theme === "dark" ? "dark" : "light";

    document.documentElement.setAttribute(
      "data-theme",
      safeTheme
    );

    if (save) {
      storage.set(JG_CONFIG.themeKey, safeTheme);
    }

    updateThemeControls(safeTheme);
  }

  function updateThemeControls(theme) {
    const darkMode = theme === "dark";

    $$("[data-theme-toggle]").forEach(button => {
      button.setAttribute(
        "aria-label",
        darkMode
          ? "Switch to light mode"
          : "Switch to dark mode"
      );

      button.setAttribute(
        "title",
        darkMode
          ? "Switch to light mode"
          : "Switch to dark mode"
      );

      const icon = button.querySelector(
        "[data-theme-icon]"
      );

      if (icon) {
        icon.textContent = darkMode ? "☀" : "☾";
      }
    });
  }

  function toggleTheme() {
    const current =
      document.documentElement.getAttribute("data-theme") ||
      "light";

    applyTheme(
      current === "dark" ? "light" : "dark"
    );
  }

  function initTheme() {
    applyTheme(getSavedTheme(), false);

    if (window.matchMedia) {
      const media =
        window.matchMedia("(prefers-color-scheme: dark)");

      const systemThemeChanged = event => {
        if (!storage.get(JG_CONFIG.themeKey)) {
          applyTheme(
            event.matches ? "dark" : "light",
            false
          );
        }
      };

      if (typeof media.addEventListener === "function") {
        media.addEventListener(
          "change",
          systemThemeChanged
        );
      } else if (
        typeof media.addListener === "function"
      ) {
        media.addListener(systemThemeChanged);
      }
    }
  }

  function initThemeButtons() {
    $$("[data-theme-toggle]").forEach(button => {
      button.addEventListener("click", toggleTheme);
    });
  }

  /* =======================================================
     MOBILE NAVIGATION
     ======================================================= */

  function initMobileNavigation() {
    const menuButton =
      $("[data-mobile-menu]") ||
      $(".mobile-menu-btn");

    const nav =
      $("[data-main-nav]") ||
      $(".nav");

    if (!menuButton || !nav) {
      return;
    }

    menuButton.setAttribute(
      "aria-expanded",
      "false"
    );

    menuButton.addEventListener("click", () => {
      const isOpen =
        nav.classList.toggle("open");

      menuButton.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

      menuButton.setAttribute(
        "aria-label",
        isOpen
          ? "Close navigation menu"
          : "Open navigation menu"
      );
    });

    $$("a", nav).forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");

        menuButton.setAttribute(
          "aria-expanded",
          "false"
        );

        menuButton.setAttribute(
          "aria-label",
          "Open navigation menu"
        );
      });
    });

    document.addEventListener("click", event => {
      if (
        window.innerWidth <=
        JG_CONFIG.mobileBreakpoint
      ) {
        if (
          !nav.contains(event.target) &&
          !menuButton.contains(event.target)
        ) {
          nav.classList.remove("open");

          menuButton.setAttribute(
            "aria-expanded",
            "false"
          );
        }
      }
    });

    window.addEventListener("resize", () => {
      if (
        window.innerWidth >
        JG_CONFIG.mobileBreakpoint
      ) {
        nav.classList.remove("open");

        menuButton.setAttribute(
          "aria-expanded",
          "false"
        );
      }
    });
  }

  /* =======================================================
     ACTIVE NAVIGATION
     ======================================================= */

  function getCurrentPage() {
    const path =
      window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

    return path || "index.html";
  }

  function initActiveNavigation() {
    const currentPage =
      getCurrentPage();

    $$("[data-nav-link], .nav a").forEach(link => {
      const href =
        link.getAttribute("href") || "";

      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("http")
      ) {
        return;
      }

      const
