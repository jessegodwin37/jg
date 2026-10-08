/* =========================================================
   JG CONFIGURATION
   ========================================================= */

window.JG_CONFIG = Object.freeze({

  APP_NAME: "JG",

  APP_FULL_NAME:
    "JG — Find Skills. Find Opportunities.",

  APP_VERSION: "2.0.0",

  ENVIRONMENT: "production",

  SITE_URL:
    "https://jessegodwin37.github.io/jg/",

  SUPABASE_URL:
    "https://klujwtajblqmxlbyzmvf.supabase.co",

  /*
   * Public browser key only.
   *
   * Never place a Supabase service-role key here.
   */
  SUPABASE_ANON_KEY:
    "sb_publishable_3izSsPLqY3_TR9ouARYjvQ_VBShNEGc",

  STORAGE_PREFIX:
    "jg_",

  THEME_KEY:
    "jg-theme",

  USER_KEY:
    "jg-user",

  ONBOARDING_KEY:
    "jg-onboarding-complete",

  DEFAULT_THEME:
    "dark",

  ROUTES: Object.freeze({
    HOME: "index.html",
    LEARN: "learn.html",
    SKILLS: "skills.html",
    WORK: "work.html",
    AI: "ai.html",
    ACCOUNT: "account.html",
    COURSE: "course.html",
    LESSON: "lesson.html",
    EXAM: "exam.html",
    FINAL_PROJECT: "final-project.html",
    CERTIFICATE: "certificate.html",
    VERIFY: "verify.html",
    PREMIUM: "premium.html",
    ENROLLMENT: "enrollment.html",
    LOGIN: "login.html",
    SIGNUP: "signup.html"
  }),

  LIMITS: Object.freeze({
    SEARCH_LENGTH: 100,
    AI_MESSAGE_LENGTH: 4000,
    DISPLAY_NAME_LENGTH: 60
  })

});
