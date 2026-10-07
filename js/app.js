/* =========================================================
   JG — Global Application Controller
   File: frontend/js/app.js
   ========================================================= */

(function () {
  "use strict";

  /* ---------------------------------------------------------
     Shortcuts
  --------------------------------------------------------- */

  var CONFIG = window.JG_CONFIG || {};
  var STORAGE = CONFIG.STORAGE_KEYS || {};

  var $ = function (selector, parent) {
    return (parent || document).querySelector(selector);
  };

  var $$ = function (selector, parent) {
    return Array.prototype.slice.call(
      (parent || document).querySelectorAll(selector)
    );
  };

  /* ---------------------------------------------------------
     Safe Storage
  --------------------------------------------------------- */

  var storage = {
    get: function (key, fallback) {
      try {
        var value = localStorage.getItem(key);

        if (value === null) {
          return fallback;
        }

        try {
          return JSON.parse(value);
        } catch (error) {
          return value;
        }
      } catch (error) {
        return fallback;
      }
    },

    set: function (key, value) {
      try {
        localStorage.setItem(
          key,
          typeof value === "string"
            ? value
            : JSON.stringify(value)
        );

        return true;
      } catch (error) {
        return false;
      }
    },

    remove: function (key) {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        // Ignore storage errors.
      }
    }
  };

  /* ---------------------------------------------------------
     JG Application State
  --------------------------------------------------------- */

  var state = {
    theme: storage.get(
      STORAGE.THEME || "jg_theme",
      "dark"
    ),

    language: storage.get(
      STORAGE.LANGUAGE || "jg_language",
      "en"
    ),

    user: storage.get(
      STORAGE.USER || "jg_user",
      null
    ),

    authenticated: Boolean(
      storage.get(
        STORAGE.AUTH || "jg_auth",
        false
      )
    )
  };

  /* ---------------------------------------------------------
     Theme
  --------------------------------------------------------- */

  function applyTheme(theme) {
    theme = theme === "light" ? "light" : "dark";

    state.theme = theme;

    document.documentElement.setAttribute(
      "data-theme",
      theme
    );

    document.body.classList.toggle(
      "light-mode",
      theme === "light"
    );

    document.body.classList.toggle(
      "dark-mode",
      theme === "dark"
    );

    storage.set(
      STORAGE.THEME || "jg_theme",
      theme
    );

    updateThemeButtons();
  }

  function toggleTheme() {
    applyTheme(
      state.theme === "dark"
        ? "light"
        : "dark"
    );
  }

  function updateThemeButtons() {
    var buttons = $$(
      "[data-theme-toggle], #themeButton, .theme-toggle"
    );

    buttons.forEach(function (button) {
      var isDark = state.theme === "dark";

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

      var icon = button.querySelector(
        "[data-theme-icon]"
      );

      if (icon) {
        icon.textContent = isDark
          ? "☀️"
          : "🌙";
      }
    });
  }

  /* ---------------------------------------------------------
     Mobile Navigation
  --------------------------------------------------------- */

  function setupMobileNavigation() {
    var menuButtons = $$(
      "[data-menu-toggle], #menuButton, .menu-toggle"
    );

    var nav = $(
      "[data-mobile-menu], .mobile-menu, .main-nav"
    );

    menuButtons.forEach(function (button) {
      button.addEventListener(
        "click",
        function () {
          if (!nav) {
            return;
          }

          var opened =
            nav.classList.toggle("open");

          button.setAttribute(
            "aria-expanded",
            opened ? "true" : "false"
          );
        }
      );
    });

    $$("nav a, .main-nav a").forEach(
      function (link) {
        link.addEventListener(
          "click",
          function () {
            if (nav) {
              nav.classList.remove("open");
            }

            menuButtons.forEach(
              function (button) {
                button.setAttribute(
                  "aria-expanded",
                  "false"
                );
              }
            );
          }
        );
      }
    );
  }

  /* ---------------------------------------------------------
     Bottom Navigation
  --------------------------------------------------------- */

  function setupBottomNavigation() {
    $$("[data-nav]").forEach(
      function (button) {
        button.addEventListener(
          "click",
          function () {
            var target =
              button.getAttribute("data-nav");

            if (!target) {
              return;
            }

            navigate(target);
          }
        );
      }
    );
  }

  /* ---------------------------------------------------------
     Navigation
  --------------------------------------------------------- */

  function navigate(target) {
    if (!target) {
      return;
    }

    var routes =
      CONFIG.ROUTES || {};

    var routeMap = {
      home: routes.HOME || "index.html",
      learn: routes.LEARN || "learn.html",
      skills: routes.SKILLS || "skills.html",
      course: routes.COURSE || "course.html",
      lesson: routes.LESSON || "lesson.html",
      exam: routes.EXAM || "exam.html",
      certificate:
        routes.CERTIFICATE || "certificate.html",
      verify:
        routes.VERIFY || "verify.html",
      work: routes.WORK || "work.html",
      ai: routes.AI || "ai.html",
      premium:
        routes.PREMIUM || "premium.html",
      account:
        routes.ACCOUNT || "account.html",
      login:
        routes.LOGIN || "login.html",
      signup:
        routes.SIGNUP || "signup.html"
    };

    var destination =
      routeMap[target] || target;

    window.location.href = destination;
  }

  /* ---------------------------------------------------------
     Data Navigation
  --------------------------------------------------------- */

  function setupDataLinks() {
    $$("[data-route]").forEach(
      function (element) {
        element.addEventListener(
          "click",
          function (event) {
            var route =
              element.getAttribute(
                "data-route"
              );

            if (!route) {
              return;
            }

            event.preventDefault();

            navigate(route);
          }
        );
      }
    );
  }

  /* ---------------------------------------------------------
     Modal System
  --------------------------------------------------------- */

  function openModal(modal) {
    if (!modal) {
      return;
    }

    modal.classList.add("active");
    modal.classList.add("open");

    modal.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.classList.add(
      "modal-open"
    );
  }

  function closeModal(modal) {
    if (!modal) {
      return;
    }

    modal.classList.remove("active");
    modal.classList.remove("open");

    modal.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.classList.remove(
      "modal-open"
    );
  }

  function setupModals() {
    $$("[data-modal-open]").forEach(
      function (button) {
        button.addEventListener(
          "click",
          function () {
            var id =
              button.getAttribute(
                "data-modal-open"
              );

            var modal = document.getElementById(
              id
            );

            openModal(modal);
          }
        );
      }
    );

    $$("[data-modal-close]").forEach(
      function (button) {
        button.addEventListener(
          "click",
          function () {
            var modal =
              button.closest(".modal") ||
              button.closest(
                "[role='dialog']"
              );

            closeModal(modal);
          }
        );
      }
    );

    $$(".modal").forEach(
      function (modal) {
        modal.addEventListener(
          "click",
          function (event) {
            if (
              event.target === modal &&
              modal.hasAttribute(
                "data-close-outside"
              )
            ) {
              closeModal(modal);
            }
          }
        );
      }
    );

    document.addEventListener(
      "keydown",
      function (event) {
        if (event.key !== "Escape") {
          return;
        }

        $$(".modal.active, .modal.open")
          .forEach(function (modal) {
            closeModal(modal);
          });
      }
    );
  }

  /* ---------------------------------------------------------
     Button Loading State
  --------------------------------------------------------- */

  function setButtonLoading(
    button,
    loading,
    loadingText
  ) {
    if (!button) {
      return;
    }

    if (loading) {
      if (
        !button.dataset.originalText
      ) {
        button.dataset.originalText =
          button.innerHTML;
      }

      button.disabled = true;

      button.innerHTML =
        loadingText ||
        "Please wait...";
    } else {
      button.disabled = false;

      if (
        button.dataset.originalText
      ) {
        button.innerHTML =
          button.dataset.originalText;
      }
    }
  }

  /* ---------------------------------------------------------
     Toast Notifications
  --------------------------------------------------------- */

  function toast(
    message,
    type,
    duration
  ) {
    type = type || "info";
    duration =
      duration === undefined
        ? 3500
        : duration;

    var container = $(
      "#jgToastContainer"
    );

    if (!container) {
      container =
        document.createElement("div");

      container.id =
        "jgToastContainer";

      container.className =
        "toast-container";

      document.body.appendChild(
        container
      );
    }

    var item =
      document.createElement("div");

    item.className =
      "toast toast-" + type;

    item.setAttribute(
      "role",
      "status"
    );

    item.textContent = message;

    container.appendChild(item);

    window.setTimeout(
      function () {
        item.classList.add(
          "toast-hide"
        );

        window.setTimeout(
          function () {
            if (item.parentNode) {
              item.parentNode.removeChild(
                item
              );
            }
          },
          300
        );
      },
      duration
    );
  }

  /* ---------------------------------------------------------
     Active Navigation
  --------------------------------------------------------- */

  function markActiveNavigation() {
    var current =
      window.location.pathname
        .split("/")
        .pop() || "index.html";

    $$(
      "nav a, .bottom-nav a, [data-page]"
    ).forEach(function (element) {
      var href =
        element.getAttribute("href");

      var page =
        element.getAttribute(
          "data-page"
        );

      var matches =
        href === current ||
        page === current;

      element.classList.toggle(
        "active",
        matches
      );

      if (matches) {
        element.setAttribute(
          "aria-current",
          "page"
        );
      }
    });
  }

  /* ---------------------------------------------------------
     Authentication UI
  --------------------------------------------------------- */

  function updateAuthenticationUI() {
    var loggedIn =
      state.authenticated;

    $$("[data-auth-only]").forEach(
      function (element) {
        element.hidden = !loggedIn;
      }
    );

    $$("[data-guest-only]").forEach(
      function (element) {
        element.hidden = loggedIn;
      }
    );

    $$("[data-user-name]").forEach(
      function (element) {
        var name =
          state.user &&
          (
            state.user.firstName ||
            state.user.name ||
            state.user.email
          );

        element.textContent =
          name || "JG User";
      }
    );
  }

  /* ---------------------------------------------------------
     Logout
  --------------------------------------------------------- */

  function logout() {
    state.authenticated = false;
    state.user = null;

    storage.remove(
      STORAGE.AUTH || "jg_auth"
    );

    storage.remove(
      STORAGE.USER || "jg_user"
    );

    storage.remove(
      STORAGE.SESSION || "jg_session"
    );

    updateAuthenticationUI();

    toast(
      "You have been signed out.",
      "success"
    );

    window.setTimeout(
      function () {
        navigate("login");
      },
      500
    );
  }

  function setupLogout() {
    $$(
      "[data-logout], #logoutButton"
    ).forEach(function (button) {
      button.addEventListener(
        "click",
        function (event) {
          event.preventDefault();
          logout();
        }
      );
    });
  }

  /* ---------------------------------------------------------
     External / Work Links
  --------------------------------------------------------- */

  function setupExternalLinks() {
    $$(
      'a[target="_blank"]'
    ).forEach(function (link) {
      link.setAttribute(
        "rel",
        "noopener noreferrer"
      );
    });
  }

  /* ---------------------------------------------------------
     Smooth Scroll
  --------------------------------------------------------- */

  function setupSmoothScroll() {
    $$(
      'a[href^="#"]'
    ).forEach(function (link) {
      link.addEventListener(
        "click",
        function (event) {
          var id =
            link.getAttribute("href");

          if (
            !id ||
            id === "#" ||
            id.length < 2
          ) {
            return;
          }

          var target =
            document.querySelector(id);

          if (!target) {
            return;
          }

          event.preventDefault();

          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      );
    });
  }

  /* ---------------------------------------------------------
     Theme Button Events
  --------------------------------------------------------- */

  function setupTheme() {
    $$(
      "[data-theme-toggle], #themeButton, .theme-toggle"
    ).forEach(function (button) {
      button.addEventListener(
        "click",
        function (event) {
          event.preventDefault();
          toggleTheme();
        }
      );
    });

    applyTheme(state.theme);
  }

  /* ---------------------------------------------------------
     Page Reveal
  --------------------------------------------------------- */

  function setupPageReveal() {
    var elements = $$(
      ".reveal, .fade-in, [data-reveal]"
    );

    if (
      !("IntersectionObserver" in window)
    ) {
      elements.forEach(
        function (element) {
          element.classList.add(
            "visible"
          );
        }
      );

      return;
    }

    var observer =
      new IntersectionObserver(
        function (entries) {
          entries.forEach(
            function (entry) {
              if (
                entry.isIntersecting
              ) {
                entry.target.classList.add(
                  "visible"
                );

                observer.unobserve(
                  entry.target
                );
              }
            }
          );
        },
        {
          threshold: 0.08
        }
      );

    elements.forEach(
      function (element) {
        observer.observe(element);
      }
    );
  }

  /* ---------------------------------------------------------
     Prevent Accidental Double Submit
  --------------------------------------------------------- */

  function setupForms() {
    $$("form").forEach(
      function (form) {
        form.addEventListener(
          "submit",
          function () {
            form.classList.add(
              "is-submitting"
            );
          }
        );
      }
    );
  }

  /* ---------------------------------------------------------
     PWA / Service Worker
  --------------------------------------------------------- */

  function registerServiceWorker() {
    if (
      !CONFIG.FEATURES ||
      !CONFIG.FEATURES.PWA
    ) {
      return;
    }

    if (
      !("serviceWorker" in navigator)
    ) {
      return;
    }

    /*
      Service worker registration is enabled
      only when the file exists.

      GitHub Pages / HTTPS can use this.
    */
    window.addEventListener(
      "load",
      function () {
        navigator.serviceWorker
          .register("sw.js")
          .then(function () {
            console.info(
              "JG service worker registered."
            );
          })
          .catch(function () {
            /*
              Silent failure during development.
            */
          });
      }
    );
  }

  /* ---------------------------------------------------------
     Global Click Handler
  --------------------------------------------------------- */

  function setupGlobalActions() {
    document.addEventListener(
      "click",
      function (event) {
        var button =
          event.target.closest(
            "[data-action]"
          );

        if (!button) {
          return;
        }

        var action =
          button.getAttribute(
            "data-action"
          );

        switch (action) {
          case "theme":
            event.preventDefault();
            toggleTheme();
            break;

          case "logout":
            event.preventDefault();
            logout();
            break;

          case "back":
            event.preventDefault();
            window.history.back();
            break;

          case "home":
            event.preventDefault();
            navigate("home");
            break;

          case "learn":
            event.preventDefault();
            navigate("learn");
            break;

          case "skills":
            event.preventDefault();
            navigate("skills");
            break;

          case "work":
            event.preventDefault();
            navigate("work");
            break;

          case "ai":
            event.preventDefault();
            navigate("ai");
            break;

          case "premium":
            event.preventDefault();
            navigate("premium");
            break;

          case "account":
            event.preventDefault();
            navigate("account");
            break;

          default:
            break;
        }
      }
    );
  }

  /* ---------------------------------------------------------
     Public JG Application API
  --------------------------------------------------------- */

  window.JG_APP = {
    state: state,

    navigate: navigate,

    toast: toast,

    openModal: openModal,

    closeModal: closeModal,

    toggleTheme: toggleTheme,

    setTheme: applyTheme,

    logout: logout,

    setButtonLoading:
      setButtonLoading,

    storage: storage,

    getUser: function () {
      return state.user;
    },

    isAuthenticated:
      function () {
        return state.authenticated;
      },

    setUser: function (user) {
      state.user = user || null;

      storage.set(
        STORAGE.USER || "jg_user",
        state.user
      );

      updateAuthenticationUI();
    },

    setAuthenticated:
      function (value) {
        state.authenticated =
          Boolean(value);

        storage.set(
          STORAGE.AUTH || "jg_auth",
          state.authenticated
        );

        updateAuthenticationUI();
      }
  };

  /* ---------------------------------------------------------
     Initialize JG
  --------------------------------------------------------- */

  function initialize() {
    setupTheme();
    setupMobileNavigation();
    setupBottomNavigation();
    setupDataLinks();
    setupModals();
    setupLogout();
    setupExternalLinks();
    setupSmoothScroll();
    setupPageReveal();
    setupForms();
    setupGlobalActions();
    markActiveNavigation();
    updateAuthenticationUI();
    registerServiceWorker();

    document.documentElement.classList.add(
      "jg-ready"
    );

    document.body.classList.add(
      "jg-app-ready"
    );
  }

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      initialize
    );
  } else {
    initialize();
  }
})();
