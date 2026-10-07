/* =========================================================
   JG — Global Frontend Configuration
   File: frontend/js/config.js
   ========================================================= */

(function () {
  "use strict";

  window.JG_CONFIG = {
    /* -----------------------------
       App Information
    ----------------------------- */
    APP_NAME: "JG",
    APP_FULL_NAME: "JG — Find Skills. Find Opportunities.",
    APP_VERSION: "1.0.0",

    /* -----------------------------
       Environment
       Change to "production" later
       when the live backend is ready.
    ----------------------------- */
    ENVIRONMENT: "development",

    /* -----------------------------
       Backend API
       
       LOCAL DEVELOPMENT:
       http://localhost:3000/api

       When the real backend is deployed,
       replace this with the secure HTTPS
       backend URL.

       Example:
       https://api.your-jg-domain.com/api
    ----------------------------- */
    API_BASE_URL: "http://localhost:3000/api",

    /* -----------------------------
       API Settings
    ----------------------------- */
    API_TIMEOUT_MS: 20000,

    ENABLE_API: true,

    /*
      Allows the frontend to remain usable
      during development when the backend
      is not connected yet.

      This does NOT replace the real backend.
    */
    ENABLE_DEMO_FALLBACKS: true,

    /* -----------------------------
       Frontend URLs
       
       Leave empty until the real
       production domains are selected.
    ----------------------------- */
    FRONTEND_URL: "",

    ADMIN_URL: "",

    /* -----------------------------
       Storage Keys
       
       Do NOT store passwords,
       API keys, payment secrets,
       or other sensitive credentials
       in localStorage.
    ----------------------------- */
    STORAGE_KEYS: {
      THEME: "jg_theme",
      USER: "jg_user",
      AUTH: "jg_auth",
      SESSION: "jg_session",
      ONBOARDING: "jg_onboarding",
      LANGUAGE: "jg_language",
      NOTIFICATIONS: "jg_notifications",
      SAVED_OPPORTUNITIES: "jg_saved_opportunities",
      LEARNING_PROGRESS: "jg_learning_progress"
    },

    /* -----------------------------
       Application Routes
    ----------------------------- */
    ROUTES: {
      HOME: "index.html",
      LEARN: "learn.html",
      SKILLS: "skills.html",
      COURSE: "course.html",
      LESSON: "lesson.html",
      EXAM: "exam.html",
      CERTIFICATE: "certificate.html",
      VERIFY: "verify.html",
      WORK: "work.html",
      AI: "ai.html",
      PREMIUM: "premium.html",
      ACCOUNT: "account.html",
      LOGIN: "login.html",
      SIGNUP: "signup.html",

      ADMIN: {
        HOME: "admin/index.html",
        LOGIN: "admin/login.html",
        DASHBOARD: "admin/dashboard.html",
        ADMINS: "admin/admins.html",
        USERS: "admin/users.html",
        CONTENT: "admin/content.html",
        OPPORTUNITIES: "admin/opportunities.html",
        PREMIUM_ADS: "admin/premium-ads.html",
        AI_CONTROL: "admin/ai-control.html",
        SETTINGS: "admin/settings.html",
        AUDIT: "admin/audit.html",
        EXPORT: "admin/export.html"
      }
    },

    /* -----------------------------
       Feature Flags
       
       These allow features to be
       enabled gradually as the
       backend is completed.
    ----------------------------- */
    FEATURES: {
      AI: true,
      COURSES: true,
      LESSONS: true,
      EXAMS: true,
      CERTIFICATES: true,
      WORK: true,
      PREMIUM: true,
      ADVERTISEMENTS: true,
      ACCOUNT: true,
      ADMIN: true,
      PWA: true
    },

    /* -----------------------------
       Security / UI Settings
    ----------------------------- */
    SECURITY: {
      REQUIRE_HTTPS_IN_PRODUCTION: true,
      REQUEST_TIMEOUT_MS: 20000
    },

    /* -----------------------------
       Pagination Defaults
    ----------------------------- */
    PAGINATION: {
      DEFAULT_PAGE: 1,
      DEFAULT_LIMIT: 20,
      MAX_LIMIT: 100
    },

    /* -----------------------------
       Helper: Build API URL
    ----------------------------- */
    getApiUrl: function (path) {
      var base = this.API_BASE_URL || "";
      var cleanBase = base.replace(/\/+$/, "");
      var cleanPath = String(path || "").replace(/^\/+/, "");

      if (!cleanPath) {
        return cleanBase;
      }

      return cleanBase + "/" + cleanPath;
    },

    /* -----------------------------
       Helper: Check Production
    ----------------------------- */
    isProduction: function () {
      return this.ENVIRONMENT === "production";
    },

    /* -----------------------------
       Helper: Check Development
    ----------------------------- */
    isDevelopment: function () {
      return this.ENVIRONMENT === "development";
    }
  };

  /* ---------------------------------
     Freeze important configuration
     where supported.
  --------------------------------- */
  try {
    Object.freeze(window.JG_CONFIG.STORAGE_KEYS);
    Object.freeze(window.JG_CONFIG.ROUTES.ADMIN);
    Object.freeze(window.JG_CONFIG.ROUTES);
    Object.freeze(window.JG_CONFIG.FEATURES);
    Object.freeze(window.JG_CONFIG.SECURITY);
    Object.freeze(window.JG_CONFIG.PAGINATION);
  } catch (error) {
    // Safe fallback for older browsers.
  }

  /* ---------------------------------
     Development information
  --------------------------------- */
  if (
    window.JG_CONFIG.isDevelopment() &&
    typeof console !== "undefined"
  ) {
    console.info(
      "JG frontend loaded — version " +
        window.JG_CONFIG.APP_VERSION
    );
  }
})();
