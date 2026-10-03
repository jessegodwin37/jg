/* =========================================================
   JG — FIND SKILLS. FIND WORK.
   GLOBAL APPLICATION JAVASCRIPT
   Frontend Foundation v2.1
   ========================================================= */

(() => {
  "use strict";

  /* =======================================================
     CONFIGURATION
     ======================================================= */

  const JG_CONFIG = {
    version: "2.1.0",
    themeKey: "jg-theme",
    mobileBreakpoint: 1024
  };

  /* =======================================================
     DOM HELPERS
     ======================================================= */

  const $ = (selector, scope = document) => {
    try {
      return scope.querySelector(selector);
    } catch {
      return null;
    }
  };

  const $$ = (selector, scope = document) => {
    try {
      return Array.from(scope.querySelectorAll(selector));
    } catch {
      return [];
    }
  };

  /* =======================================================
     SAFE STORAGE
     ======================================================= */

  const storage = {
    get(key) {
      try {
        return window.localStorage.getItem(key);
      } catch {
        return null;
      }
    },

    set(key, value) {
      try {
        window.localStorage.setItem(key, value);
        return true;
      } catch {
        return false;
      }
    },

    remove(key) {
      try {
        window.localStorage.removeItem(key);
        return true;
      } catch {
        return false;
      }
    }
  };

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
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }

    return "light";
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
    const isDark = theme === "dark";

    $$("[data-theme-toggle]").forEach(button => {
      button.setAttribute(
        "aria-label",
        isDark
          ? "Switch to light mode"
          : "Switch to dark mode"
      );

      button.setAttribute(
        "title",
        isDark
          ? "Switch to light mode"
          : "Switch to dark mode"
      );

      const icon = $(
        "[data-theme-icon]",
        button
      );

      if (icon) {
        icon.textContent = isDark ? "☀" : "☾";
      }
    });
  }

  function toggleTheme() {
    const current =
      document.documentElement.getAttribute("data-theme") ||
      getSavedTheme();

    applyTheme(
      current === "dark" ? "light" : "dark",
      true
    );
  }

  function initTheme() {
    applyTheme(
      getSavedTheme(),
      false
    );

    if (!window.matchMedia) {
      return;
    }

    const media = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    const handleSystemThemeChange = event => {
      const saved = storage.get(
        JG_CONFIG.themeKey
      );

      if (!saved) {
        applyTheme(
          event.matches ? "dark" : "light",
          false
        );
      }
    };

    if (
      typeof media.addEventListener ===
      "function"
    ) {
      media.addEventListener(
        "change",
        handleSystemThemeChange
      );
    } else if (
      typeof media.addListener ===
      "function"
    ) {
      media.addListener(
        handleSystemThemeChange
      );
    }
  }

  function initThemeButtons() {
    $$("[data-theme-toggle]").forEach(button => {
      button.addEventListener(
        "click",
        event => {
          event.preventDefault();
          toggleTheme();
        }
      );
    });
  }

  /* =======================================================
     MOBILE NAVIGATION
     ======================================================= */

  function initMobileNavigation() {
    const menuButton =
      $("[data-mobile-menu]") ||
      $(".mobile-menu-btn") ||
      $(".menu-toggle");

    const nav =
      $("[data-main-nav]") ||
      $(".nav") ||
      $(".main-nav");

    if (!menuButton || !nav) {
      return;
    }

    menuButton.setAttribute(
      "aria-expanded",
      "false"
    );

    menuButton.setAttribute(
      "aria-label",
      "Open navigation menu"
    );

    const closeMenu = () => {
      nav.classList.remove("open");
      nav.classList.remove("active");

      menuButton.setAttribute(
        "aria-expanded",
        "false"
      );

      menuButton.setAttribute(
        "aria-label",
        "Open navigation menu"
      );
    };

    const openMenu = () => {
      nav.classList.add("open");

      menuButton.setAttribute(
        "aria-expanded",
        "true"
      );

      menuButton.setAttribute(
        "aria-label",
        "Close navigation menu"
      );
    };

    menuButton.addEventListener(
      "click",
      event => {
        event.preventDefault();
        event.stopPropagation();

        const isOpen =
          nav.classList.contains("open");

        if (isOpen) {
          closeMenu();
        } else {
          openMenu();
        }
      }
    );

    $$("a", nav).forEach(link => {
      link.addEventListener(
        "click",
        () => {
          if (
            window.innerWidth <=
            JG_CONFIG.mobileBreakpoint
          ) {
            closeMenu();
          }
        }
      );
    });

    document.addEventListener(
      "click",
      event => {
        if (
          window.innerWidth >
          JG_CONFIG.mobileBreakpoint
        ) {
          return;
        }

        if (
          !nav.contains(event.target) &&
          !menuButton.contains(event.target)
        ) {
          closeMenu();
        }
      }
    );

    window.addEventListener(
      "resize",
      () => {
        if (
          window.innerWidth >
          JG_CONFIG.mobileBreakpoint
        ) {
          closeMenu();
        }
      }
    );
  }

  /* =======================================================
     ACTIVE NAVIGATION
     ======================================================= */

  function getCurrentPage() {
    let path =
      window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

    if (!path || path === "/") {
      path = "index.html";
    }

    return path;
  }

  function normalizeHref(href) {
    if (!href) {
      return "";
    }

    try {
      const url = new URL(
        href,
        window.location.href
      );

      return url.pathname
        .split("/")
        .pop()
        .toLowerCase() || "index.html";
    } catch {
      return href
        .split("#")[0]
        .split("?")[0]
        .split("/")
        .pop()
        .toLowerCase();
    }
  }

  function initActiveNavigation() {
    const currentPage =
      getCurrentPage();

    $$(
      "[data-nav-link], .nav a, .main-nav a"
    ).forEach(link => {
      const href =
        link.getAttribute("href") || "";

      if (
        !href ||
        href === "#" ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("javascript:")
      ) {
        return;
      }

      if (
        href.startsWith("http://") ||
        href.startsWith("https://")
      ) {
        try {
          const linkURL = new URL(href);

          if (
            linkURL.origin !==
            window.location.origin
          ) {
            return;
          }
        } catch {
          return;
        }
      }

      const targetPage =
        normalizeHref(href);

      const isActive =
        targetPage === currentPage;

      link.classList.toggle(
        "active",
        isActive
      );

      if (isActive) {
        link.setAttribute(
          "aria-current",
          "page"
        );
      } else {
        link.removeAttribute(
          "aria-current"
        );
      }
    });
  }

  /* =======================================================
     HEADER SCROLL STATE
     ======================================================= */

  function initHeaderScroll() {
    const header =
      $(".site-header") ||
      $("header");

    if (!header) {
      return;
    }

    const updateHeader = () => {
      header.classList.toggle(
        "scrolled",
        window.scrollY > 12
      );
    };

    updateHeader();

    window.addEventListener(
      "scroll",
      updateHeader,
      { passive: true }
    );
  }

  /* =======================================================
     SMOOTH ANCHORS
     ======================================================= */

  function initSmoothAnchors() {
    $$('a[href^="#"]').forEach(link => {
      link.addEventListener(
        "click",
        event => {
          const href =
            link.getAttribute("href");

          if (
            !href ||
            href === "#"
          ) {
            return;
          }

          const target =
            document.querySelector(href);

          if (!target) {
            return;
          }

          event.preventDefault();

          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

          try {
            history.pushState(
              null,
              "",
              href
            );
          } catch {
            // Ignore history errors.
          }
        }
      );
    });
  }

  /* =======================================================
     PASSWORD VISIBILITY
     ======================================================= */

  function initPasswordToggles() {
    $$("[data-password-toggle]").forEach(button => {
      button.addEventListener(
        "click",
        event => {
          event.preventDefault();

          const targetSelector =
            button.getAttribute(
              "data-password-toggle"
            );

          let input = null;

          if (targetSelector) {
            input = $(
              targetSelector
            );
          }

          if (!input) {
            const wrapper =
              button.closest(
                ".password-field, .input-group, .form-group"
              );

            if (wrapper) {
              input = $(
                'input[type="password"], input[type="text"]',
                wrapper
              );
            }
          }

          if (!input) {
            return;
          }

          const isPassword =
            input.type === "password";

          input.type =
            isPassword
              ? "text"
              : "password";

          button.setAttribute(
            "aria-label",
            isPassword
              ? "Hide password"
              : "Show password"
          );
        }
      );
    });
  }

  /* =======================================================
     FORM SAFETY
     ======================================================= */

  function initFormProtection() {
    $$("form").forEach(form => {
      form.addEventListener(
        "submit",
        event => {
          if (
            form.dataset.processing ===
            "true"
          ) {
            event.preventDefault();
            return;
          }

          form.dataset.processing = "true";

          window.setTimeout(() => {
            form.dataset.processing = "false";
          }, 2500);
        }
      );
    });
  }

  /* =======================================================
     CURRENT YEAR
     ======================================================= */

  function initCurrentYear() {
    const year =
      new Date().getFullYear();

    $$("[data-current-year]").forEach(
      element => {
        element.textContent = year;
      }
    );

    const currentYear =
      $("#currentYear");

    if (currentYear) {
      currentYear.textContent = year;
    }
  }

  /* =======================================================
     IMAGE OPTIMIZATION
     ======================================================= */

  function initImages() {
    $$("img").forEach(image => {
      if (
        !image.hasAttribute("loading")
      ) {
        image.setAttribute(
          "loading",
          "lazy"
        );
      }

      if (
        !image.hasAttribute("decoding")
      ) {
        image.setAttribute(
          "decoding",
          "async"
        );
      }

      image.addEventListener(
        "error",
        () => {
          image.classList.add(
            "image-error"
          );
        },
        { once: true }
      );
    });
  }

  /* =======================================================
     ONLINE / OFFLINE STATUS
     ======================================================= */

  function updateConnectionStatus() {
    document.documentElement.classList.toggle(
      "is-offline",
      !navigator.onLine
    );
  }

  function initConnectionStatus() {
    updateConnectionStatus();

    window.addEventListener(
      "online",
      updateConnectionStatus
    );

    window.addEventListener(
      "offline",
      updateConnectionStatus
    );
  }

  /* =======================================================
     TOAST SYSTEM
     ======================================================= */

  function getToastContainer() {
    let container =
      $("#jgToastContainer");

    if (container) {
      return container;
    }

    container =
      document.createElement("div");

    container.id =
      "jgToastContainer";

    container.className =
      "toast-container";

    container.setAttribute(
      "aria-live",
      "polite"
    );

    container.setAttribute(
      "aria-atomic",
      "true"
    );

    document.body.appendChild(
      container
    );

    return container;
  }

  function showToast(
    message,
    type = "info",
    duration = 3500
  ) {
    if (!message) {
      return;
    }

    const container =
      getToastContainer();

    const toast =
      document.createElement("div");

    toast.className =
      `toast toast-${escapeHTML(type)}`;

    toast.setAttribute(
      "role",
      "status"
    );

    const text =
      document.createElement("span");

    text.textContent =
      message;

    const close =
      document.createElement("button");

    close.type = "button";
    close.className =
      "toast-close";
    close.setAttribute(
      "aria-label",
      "Close notification"
    );
    close.textContent = "×";

    toast.appendChild(text);
    toast.appendChild(close);

    container.appendChild(
      toast
    );

    requestAnimationFrame(() => {
      toast.classList.add(
        "show"
      );
    });

    const removeToast = () => {
      toast.classList.remove(
        "show"
      );

      window.setTimeout(() => {
        toast.remove();
      }, 250);
    };

    close.addEventListener(
      "click",
      removeToast
    );

    window.setTimeout(
      removeToast,
      duration
    );
  }

  /* =======================================================
     COPY TO CLIPBOARD
     ======================================================= */

  async function copyText(text) {
    if (!text) {
      return false;
    }

    try {
      if (
        navigator.clipboard &&
        window.isSecureContext
      ) {
        await navigator.clipboard.writeText(
          text
        );

        return true;
      }
    } catch {
      // Continue to fallback.
    }

    try {
      const textarea =
        document.createElement("textarea");

      textarea.value = text;
      textarea.setAttribute(
        "readonly",
        ""
      );

      textarea.style.position =
        "fixed";
      textarea.style.opacity =
        "0";

      document.body.appendChild(
        textarea
      );

      textarea.select();

      const successful =
        document.execCommand(
          "copy"
        );

      textarea.remove();

      return successful;
    } catch {
      return false;
    }
  }

  function initCopyButtons() {
    $$("[data-copy]").forEach(button => {
      button.addEventListener(
        "click",
        async event => {
          event.preventDefault();

          const value =
            button.getAttribute(
              "data-copy"
            );

          if (!value) {
            return;
          }

          const success =
            await copyText(value);

          showToast(
            success
              ? "Copied successfully."
              : "Unable to copy.",
            success
              ? "success"
              : "error"
          );
        }
      );
    });
  }

  /* =======================================================
     REVEAL ANIMATIONS
     ======================================================= */

  function initRevealAnimations() {
    const elements =
      $$("[data-reveal]");

    if (
      !elements.length
    ) {
      return;
    }

    if (
      !("IntersectionObserver" in window)
    ) {
      elements.forEach(
        element => {
          element.classList.add(
            "is-visible"
          );
        }
      );

      return;
    }

    const observer =
      new IntersectionObserver(
        entries => {
          entries.forEach(
            entry => {
              if (
                entry.isIntersecting
              ) {
                entry.target.classList.add(
                  "is-visible"
                );

                observer.unobserve(
                  entry.target
                );
              }
            }
          );
        },
        {
          threshold: 0.08,
          rootMargin:
            "0px 0px -40px 0px"
        }
      );

    elements.forEach(
      element => {
        observer.observe(
          element
        );
      }
    );
  }

  /* =======================================================
     SCROLL TO TOP
     ======================================================= */

  function initScrollTop() {
    const button =
      $("[data-scroll-top]");

    if (!button) {
      return;
    }

    const update = () => {
      button.classList.toggle(
        "show",
        window.scrollY > 500
      );
    };

    button.addEventListener(
      "click",
      event => {
        event.preventDefault();

        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      }
    );

    update();

    window.addEventListener(
      "scroll",
      update,
      { passive: true }
    );
  }

  /* =======================================================
     EXTERNAL LINKS
     ======================================================= */

  function initExternalLinks() {
    $$("a[href]").forEach(link => {
      const href =
        link.getAttribute("href");

      if (!href) {
        return;
      }

      if (
        href.startsWith("http://") ||
        href.startsWith("https://")
      ) {
        try {
          const url =
            new URL(
              href,
              window.location.href
            );

          if (
            url.origin !==
            window.location.origin
          ) {
            link.setAttribute(
              "target",
              "_blank"
            );

            link.setAttribute(
              "rel",
              "noopener noreferrer"
            );
          }
        } catch {
          // Ignore malformed external URLs.
        }
      }
    });
  }

  /* =======================================================
     BUTTON LOADING STATE
     ======================================================= */

  function setButtonLoading(
    button,
    loading = true
  ) {
    if (!button) {
      return;
    }

    if (loading) {
      if (
        !button.dataset.originalText
      ) {
        button.dataset.originalText =
          button.textContent;
      }

      button.disabled = true;
      button.classList.add(
        "is-loading"
      );

      button.setAttribute(
        "aria-busy",
        "true"
      );
    } else {
      button.disabled = false;
      button.classList.remove(
        "is-loading"
      );

      button.removeAttribute(
        "aria-busy"
      );

      if (
        button.dataset.originalText
      ) {
        button.textContent =
          button.dataset.originalText;

        delete button.dataset
          .originalText;
      }
    }
  }

  /* =======================================================
     UI STATE HELPER
     ======================================================= */

  function setUIState(
    element,
    state
  ) {
    if (!element) {
      return;
    }

    element.classList.remove(
      "is-loading",
      "is-success",
      "is-error",
      "is-empty"
    );

    if (state) {
      element.classList.add(
        `is-${state}`
      );
    }
  }

  /* =======================================================
     ACCESSIBILITY
     ======================================================= */

  function initAccessibility() {
    $$("button").forEach(button => {
      if (
        !button.getAttribute(
          "type"
        )
      ) {
        button.setAttribute(
          "type",
          "button"
        );
      }
    });

    $$("a[href]").forEach(link => {
      const text =
        link.textContent.trim();

      if (
        !text &&
        !link.getAttribute(
          "aria-label"
        )
      ) {
        link.setAttribute(
          "aria-label",
          "Open link"
        );
      }
    });
  }

  /* =======================================================
     GLOBAL KEYBOARD HELP
     ======================================================= */

  function initKeyboardSupport() {
    document.addEventListener(
      "keydown",
      event => {
        if (
          event.key === "Escape"
        ) {
          const nav =
            $("[data-main-nav]") ||
            $(".nav") ||
            $(".main-nav");

          const menuButton =
            $("[data-mobile-menu]") ||
            $(".mobile-menu-btn") ||
            $(".menu-toggle");

          if (nav) {
            nav.classList.remove(
              "open"
            );

            nav.classList.remove(
              "active"
            );
          }

          if (menuButton) {
            menuButton.setAttribute(
              "aria-expanded",
              "false"
            );

            menuButton.setAttribute(
              "aria-label",
              "Open navigation menu"
            );
          }
        }
      }
    );
  }

  /* =======================================================
     RUNTIME CSS
     ======================================================= */

  function injectRuntimeCSS() {
    if (
      document.getElementById(
        "jg-runtime-css"
      )
    ) {
      return;
    }

    const style =
      document.createElement("style");

    style.id =
      "jg-runtime-css";

    style.textContent = `
      .toast-container {
        position: fixed;
        right: 18px;
        bottom: 18px;
        z-index: 99999;
        display: grid;
        gap: 10px;
        width: min(380px, calc(100vw - 36px));
        pointer-events: none;
      }

      .toast {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 13px 14px;
        border: 1px solid var(--border, #e5e7eb);
        border-radius: 14px;
        background: var(--surface, #ffffff);
        color: var(--text, #111827);
        box-shadow: 0 18px 45px rgba(15, 23, 42, 0.16);
        transform: translateY(12px);
        opacity: 0;
        transition:
          opacity .22s ease,
          transform .22s ease;
        pointer-events: auto;
        font-size: .92rem;
      }

      .toast.show {
        transform: translateY(0);
        opacity: 1;
      }

      .toast-success {
        border-color: rgba(16, 185, 129, .35);
      }

      .toast-error {
        border-color: rgba(239, 68, 68, .35);
      }

      .toast-close {
        width: 30px;
        height: 30px;
        border: 0;
        border-radius: 9px;
        background: transparent;
        color: inherit;
        cursor: pointer;
        font-size: 20px;
        line-height: 1;
        flex: 0 0 auto;
      }

      .toast-close:hover {
        background: rgba(127, 127, 127, .12);
      }

      .is-loading {
        cursor: wait !important;
      }

      button.is-loading {
        opacity: .7;
      }

      [data-reveal] {
        opacity: 0;
        transform: translateY(18px);
        transition:
          opacity .5s ease,
          transform .5s ease;
      }

      [data-reveal].is-visible {
        opacity: 1;
        transform: translateY(0);
      }

      .image-error {
        opacity: .6;
      }

      @media (prefers-reduced-motion: reduce) {
        [data-reveal],
        [data-reveal].is-visible,
        .toast {
          transition: none !important;
          transform: none !important;
        }
      }

      @media (max-width: 640px) {
        .toast-container {
          right: 12px;
          bottom: 12px;
          width: calc(100vw - 24px);
        }
      }
    `;

    document.head.appendChild(
      style
    );
  }

  /* =======================================================
     SECURITY NOTES
     ======================================================= */

  function securityGuard() {
    /*
      Frontend security rules:

      1. Never place API keys in this file.
      2. Never store passwords in localStorage.
      3. Never store NIN values in localStorage.
      4. Never trust frontend premium status.
      5. Never treat frontend payment confirmation as verified.
      6. Authentication must eventually be handled by backend.
      7. Payment verification must eventually be handled by backend.
      8. AI API requests must eventually go through a secure backend.
    */
  }

  /* =======================================================
     GLOBAL JG API
     ======================================================= */

  function createGlobalAPI() {
    window.JG = {
      version:
        JG_CONFIG.version,

      config:
        Object.freeze({
          ...JG_CONFIG
        }),

      storage,

      utils: {
        $,
        $$,
        escapeHTML,
        copyText
      },

      theme: {
        get: () =>
          document.documentElement
            .getAttribute(
              "data-theme"
            ),

        set: theme =>
          applyTheme(
            theme,
            true
          ),

        toggle:
          toggleTheme
      },

      ui: {
        toast:
          showToast,

        setState:
          setUIState,

        setLoading:
          setButtonLoading
      }
    };
  }

  /* =======================================================
     INITIALIZATION
     ======================================================= */

  function init() {
    try {
      createGlobalAPI();

      initTheme();
      initThemeButtons();

      initMobileNavigation();
      initActiveNavigation();
      initHeaderScroll();

      initSmoothAnchors();
      initPasswordToggles();

      initFormProtection();
      initCurrentYear();

      initImages();
      initConnectionStatus();

      initCopyButtons();
      initRevealAnimations();

      initScrollTop();
      initExternalLinks();

      initAccessibility();
      initKeyboardSupport();

      injectRuntimeCSS();
      securityGuard();

      document.documentElement.classList.add(
        "jg-ready"
      );

      window.dispatchEvent(
        new CustomEvent(
          "jg:ready",
          {
            detail: {
              version:
                JG_CONFIG.version,
              page:
                getCurrentPage()
            }
          }
        )
      );
    } catch (error) {
      /*
        Do not allow one optional UI feature
        to break the entire application.
      */

      console.error(
        "JG initialization error:",
        error
      );

      document.documentElement.classList.add(
        "jg-ready"
      );
    }
  }

  /* =======================================================
     START
     ======================================================= */

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once: true }
    );
  } else {
    init();
  }

})();
