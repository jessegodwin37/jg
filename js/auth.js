/* =========================================================
   JG — Authentication Controller
   File: frontend/js/auth.js

   IMPORTANT:
   - Passwords are NEVER stored in localStorage.
   - Real authentication is handled by the backend.
   - This file controls the frontend authentication state.
   ========================================================= */

(function () {
  "use strict";

  var CONFIG = window.JG_CONFIG || {};
  var API = window.JG_API || {};
  var APP = window.JG_APP || {};

  var STORAGE =
    CONFIG.STORAGE_KEYS || {
      AUTH: "jg_auth",
      USER: "jg_user",
      SESSION: "jg_session"
    };

  /* ---------------------------------------------------------
     Safe Storage
  --------------------------------------------------------- */

  function storageGet(key, fallback) {
    try {
      var value =
        localStorage.getItem(key);

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
  }

  function storageSet(key, value) {
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
  }

  function storageRemove(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      // Ignore storage errors.
    }
  }

  /* ---------------------------------------------------------
     Authentication State
  --------------------------------------------------------- */

  var state = {
    authenticated: Boolean(
      storageGet(
        STORAGE.AUTH,
        false
      )
    ),

    user: storageGet(
      STORAGE.USER,
      null
    )
  };

  /* ---------------------------------------------------------
     Sanitize User Data
  --------------------------------------------------------- */

  function sanitizeUser(user) {
    if (!user || typeof user !== "object") {
      return null;
    }

    /*
      Only safe profile information is retained
      on the frontend.

      Passwords, API keys, secret tokens and
      other sensitive backend fields are excluded.
    */

    return {
      id: user.id || null,

      firstName:
        user.firstName ||
        user.first_name ||
        "",

      lastName:
        user.lastName ||
        user.last_name ||
        "",

      name:
        user.name ||
        "",

      email:
        user.email ||
        "",

      role:
        user.role ||
        "USER",

      avatar:
        user.avatar ||
        "",

      premium:
        Boolean(
          user.premium ||
          user.isPremium
        ),

      emailVerified:
        Boolean(
          user.emailVerified ||
          user.email_verified
        )
    };
  }

  /* ---------------------------------------------------------
     Save Authentication State
  --------------------------------------------------------- */

  function saveState(
    user,
    authenticated
  ) {
    state.user =
      sanitizeUser(user);

    state.authenticated =
      Boolean(authenticated);

    storageSet(
      STORAGE.AUTH,
      state.authenticated
    );

    if (state.user) {
      storageSet(
        STORAGE.USER,
        state.user
      );
    } else {
      storageRemove(
        STORAGE.USER
      );
    }

    /*
      Keep the global application controller
      synchronized.
    */

    if (
      APP &&
      typeof APP.setUser ===
        "function"
    ) {
      APP.setUser(state.user);
    }

    if (
      APP &&
      typeof APP.setAuthenticated ===
        "function"
    ) {
      APP.setAuthenticated(
        state.authenticated
      );
    }
  }

  /* ---------------------------------------------------------
     Clear Authentication
  --------------------------------------------------------- */

  function clearState() {
    state.user = null;
    state.authenticated = false;

    storageRemove(
      STORAGE.AUTH
    );

    storageRemove(
      STORAGE.USER
    );

    storageRemove(
      STORAGE.SESSION
    );

    if (
      APP &&
      typeof APP.setUser ===
        "function"
    ) {
      APP.setUser(null);
    }

    if (
      APP &&
      typeof APP.setAuthenticated ===
        "function"
    ) {
      APP.setAuthenticated(
        false
      );
    }
  }

  /* ---------------------------------------------------------
     Check Authentication
  --------------------------------------------------------- */

  function isAuthenticated() {
    return Boolean(
      state.authenticated
    );
  }

  /* ---------------------------------------------------------
     Get Current User
  --------------------------------------------------------- */

  function getUser() {
    return state.user;
  }

  /* ---------------------------------------------------------
     Login
  --------------------------------------------------------- */

  async function login(
    email,
    password
  ) {
    if (!email || !password) {
      throw new Error(
        "Email and password are required."
      );
    }

    if (
      typeof API.login !==
      "function"
    ) {
      throw new Error(
        "JG account service is not connected."
      );
    }

    var response =
      await API.login({
        email: String(
          email
        ).trim(),
        password: password
      });

    /*
      Expected backend response may contain:
        {
          user: {...},
          authenticated: true
        }

      The exact backend implementation
      can be upgraded later without changing
      the public page structure.
    */

    var user =
      response &&
      response.user
        ? response.user
        : response;

    saveState(
      user,
      true
    );

    return {
      success: true,
      user: state.user,
      response: response
    };
  }

  /* ---------------------------------------------------------
     Signup
  --------------------------------------------------------- */

  async function signup(
    userData
  ) {
    if (
      !userData ||
      typeof userData !==
        "object"
    ) {
      throw new Error(
        "Account information is required."
      );
    }

    if (
      !userData.email ||
      !userData.password
    ) {
      throw new Error(
        "Email and password are required."
      );
    }

    if (
      typeof API.signup !==
      "function"
    ) {
      throw new Error(
        "JG account service is not connected."
      );
    }

    var response =
      await API.signup(
        userData
      );

    var user =
      response &&
      response.user
        ? response.user
        : response;

    /*
      Some systems require email verification
      before a user becomes authenticated.

      Therefore the backend response decides
      whether the new account is immediately
      authenticated.
    */

    var authenticated =
      Boolean(
        response &&
        response.authenticated
      );

    if (authenticated) {
      saveState(
        user,
        true
      );
    } else {
      state.user =
        sanitizeUser(user);

      state.authenticated =
        false;

      if (state.user) {
        storageSet(
          STORAGE.USER,
          state.user
        );
      }
    }

    return {
      success: true,
      authenticated:
        authenticated,
      user:
        state.user,
      response:
        response
    };
  }

  /* ---------------------------------------------------------
     Logout
  --------------------------------------------------------- */

  async function logout(
    redirect
  ) {
    /*
      Try to invalidate the server-side
      session first.
    */

    try {
      if (
        typeof API.logout ===
        "function"
      ) {
        await API.logout();
      }
    } catch (error) {
      /*
        Even if the server request fails,
        local authentication state must still
        be cleared.
      */
    }

    clearState();

    if (
      redirect !== false
    ) {
      window.location.href =
        (
          CONFIG.ROUTES &&
          CONFIG.ROUTES.LOGIN
        ) ||
        "login.html";
    }

    return {
      success: true
    };
  }

  /* ---------------------------------------------------------
     Refresh Current User
  --------------------------------------------------------- */

  async function refresh() {
    if (
      typeof API.currentUser !==
      "function"
    ) {
      return null;
    }

    try {
      var response =
        await API.currentUser();

      var user =
        response &&
        response.user
          ? response.user
          : response;

      if (user) {
        saveState(
          user,
          true
        );

        return state.user;
      }

      clearState();

      return null;
    } catch (error) {
      /*
        Do not immediately destroy local
        UI state for temporary network errors.
      */

      return null;
    }
  }

  /* ---------------------------------------------------------
     Forgot Password
  --------------------------------------------------------- */

  async function forgotPassword(
    email
  ) {
    if (!email) {
      throw new Error(
        "Enter your email address."
      );
    }

    if (
      typeof API.forgotPassword !==
      "function"
    ) {
      throw new Error(
        "Password recovery service is not connected."
      );
    }

    return API.forgotPassword(
      String(email).trim()
    );
  }

  /* ---------------------------------------------------------
     Reset Password
  --------------------------------------------------------- */

  async function resetPassword(
    data
  ) {
    if (
      !data ||
      !data.token ||
      !data.password
    ) {
      throw new Error(
        "A valid reset token and new password are required."
      );
    }

    if (
      typeof API.resetPassword !==
      "function"
    ) {
      throw new Error(
        "Password reset service is not connected."
      );
    }

    return API.resetPassword(
      data
    );
  }

  /* ---------------------------------------------------------
     Require Authentication
  --------------------------------------------------------- */

  function requireAuth(
    redirect
  ) {
    if (
      isAuthenticated()
    ) {
      return true;
    }

    if (
      redirect !== false
    ) {
      var loginPage =
        (
          CONFIG.ROUTES &&
          CONFIG.ROUTES.LOGIN
        ) ||
        "login.html";

      var current =
        window.location.href;

      var separator =
        loginPage.indexOf("?") ===
        -1
          ? "?"
          : "&";

      window.location.href =
        loginPage +
        separator +
        "redirect=" +
        encodeURIComponent(
          current
        );
    }

    return false;
  }

  /* ---------------------------------------------------------
     Require Owner
  --------------------------------------------------------- */

  function requireOwner(
    redirect
  ) {
    var user =
      getUser();

    var role =
      user &&
      String(
        user.role || ""
      ).toUpperCase();

    if (
      role === "OWNER"
    ) {
      return true;
    }

    if (
      redirect !== false
    ) {
      window.location.href =
        (
          CONFIG.ROUTES &&
          CONFIG.ROUTES.ADMIN &&
          CONFIG.ROUTES.ADMIN.LOGIN
        ) ||
        "admin/login.html";
    }

    return false;
  }

  /* ---------------------------------------------------------
     Require Admin
  --------------------------------------------------------- */

  function requireAdmin(
    redirect
  ) {
    var user =
      getUser();

    var role =
      user &&
      String(
        user.role || ""
      ).toUpperCase();

    var allowed =
      role === "OWNER" ||
      role === "ADMIN";

    if (allowed) {
      return true;
    }

    if (
      redirect !== false
    ) {
      window.location.href =
        (
          CONFIG.ROUTES &&
          CONFIG.ROUTES.ADMIN &&
          CONFIG.ROUTES.ADMIN.LOGIN
        ) ||
        "admin/login.html";
    }

    return false;
  }

  /* ---------------------------------------------------------
     Role / Permission Helpers
  --------------------------------------------------------- */

  function hasRole(
    role
  ) {
    var user =
      getUser();

    if (!user) {
      return false;
    }

    return (
      String(
        user.role || ""
      ).toUpperCase() ===
      String(
        role || ""
      ).toUpperCase()
    );
  }

  function hasAnyRole(
    roles
  ) {
    if (
      !Array.isArray(roles)
    ) {
      return false;
    }

    for (
      var i = 0;
      i < roles.length;
      i++
    ) {
      if (
        hasRole(
          roles[i]
        )
      ) {
        return true;
      }
    }

    return false;
  }

  /* ---------------------------------------------------------
     Protect Current Page
  --------------------------------------------------------- */

  function protectPage() {
    var requirement =
      document.body.getAttribute(
        "data-auth-required"
      );

    if (
      requirement === "true"
    ) {
      requireAuth();
    }

    if (
      requirement === "admin"
    ) {
      requireAdmin();
    }

    if (
      requirement === "owner"
    ) {
      requireOwner();
    }
  }

  /* ---------------------------------------------------------
     Update Authentication Elements
  --------------------------------------------------------- */

  function updateUI() {
    var authenticated =
      isAuthenticated();

    $$(
      "[data-authenticated]"
    ).forEach(
      function (element) {
        element.hidden =
          !authenticated;
      }
    );

    $$(
      "[data-not-authenticated]"
    ).forEach(
      function (element) {
        element.hidden =
          authenticated;
      }
    );

    $$(
      "[data-user-name]"
    ).forEach(
      function (element) {
        var user =
          getUser();

        element.textContent =
          user &&
          (
            user.firstName ||
            user.name ||
            user.email
          )
            ? (
                user.firstName ||
                user.name ||
                user.email
              )
            : "JG User";
      }
    );

    $$(
      "[data-user-email]"
    ).forEach(
      function (element) {
        element.textContent =
          getUser() &&
          getUser().email
            ? getUser().email
            : "";
      }
    );

    $$(
      "[data-user-role]"
    ).forEach(
      function (element) {
        element.textContent =
          getUser() &&
          getUser().role
            ? getUser().role
            : "USER";
      }
    );
  }

  /* ---------------------------------------------------------
     Bind Logout Buttons
  --------------------------------------------------------- */

  function bindLogoutButtons() {
    document
      .querySelectorAll(
        "[data-auth-logout]"
      )
      .forEach(
        function (button) {
          button.addEventListener(
            "click",
            function (
              event
            ) {
              event.preventDefault();
              logout();
            }
          );
        }
      );
  }

  /* ---------------------------------------------------------
     Public Authentication API
  --------------------------------------------------------- */

  window.JG_AUTH = {
    state: state,

    login:
      login,

    signup:
      signup,

    logout:
      logout,

    refresh:
      refresh,

    forgotPassword:
      forgotPassword,

    resetPassword:
      resetPassword,

    isAuthenticated:
      isAuthenticated,

    getUser:
      getUser,

    requireAuth:
      requireAuth,

    requireOwner:
      requireOwner,

    requireAdmin:
      requireAdmin,

    hasRole:
      hasRole,

    hasAnyRole:
      hasAnyRole,

    clear:
      clearState,

    updateUI:
      updateUI
  };

  /* ---------------------------------------------------------
     Initialize
  --------------------------------------------------------- */

  function initialize() {
    updateUI();
    bindLogoutButtons();
    protectPage();

    /*
      Only attempt a server refresh when the
      frontend already believes the user is
      authenticated.
    */

    if (
      state.authenticated
    ) {
      refresh().then(
        function () {
          updateUI();
        }
      );
    }
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
