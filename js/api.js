/* =========================================================
   JG — API Client
   File: frontend/js/api.js

   IMPORTANT:
   - No secret/API key belongs in this file.
   - Authentication/payment/AI secrets stay on the backend.
   ========================================================= */

(function () {
  "use strict";

  var CONFIG = window.JG_CONFIG || {};

  var API_BASE_URL =
    CONFIG.API_BASE_URL ||
    "http://localhost:3000/api";

  var TIMEOUT =
    CONFIG.API_TIMEOUT_MS || 20000;

  /* ---------------------------------------------------------
     Helpers
  --------------------------------------------------------- */

  function buildUrl(path) {
    var base = API_BASE_URL.replace(/\/+$/, "");
    var cleanPath = String(path || "").replace(
      /^\/+/,
      ""
    );

    return cleanPath
      ? base + "/" + cleanPath
      : base;
  }

  function getToken() {
    try {
      var key =
        (CONFIG.STORAGE_KEYS &&
          CONFIG.STORAGE_KEYS.AUTH) ||
        "jg_auth_token";

      return localStorage.getItem(key) || "";
    } catch (error) {
      return "";
    }
  }

  function createHeaders(options) {
    var headers = {
      Accept: "application/json"
    };

    if (
      options &&
      options.body !== undefined &&
      options.body !== null &&
      !(options.body instanceof FormData)
    ) {
      headers["Content-Type"] =
        "application/json";
    }

    var token = getToken();

    if (token) {
      headers.Authorization =
        "Bearer " + token;
    }

    return headers;
  }

  function createTimeoutSignal(
    controller
  ) {
    return window.setTimeout(
      function () {
        controller.abort();
      },
      TIMEOUT
    );
  }

  /* ---------------------------------------------------------
     Main Request Function
  --------------------------------------------------------- */

  async function request(
    path,
    options
  ) {
    options = options || {};

    if (
      CONFIG.ENABLE_API === false
    ) {
      throw new Error(
        "JG API is currently disabled."
      );
    }

    var controller =
      new AbortController();

    var timeoutId =
      createTimeoutSignal(controller);

    var fetchOptions = {
      method:
        options.method || "GET",

      headers:
        createHeaders(options),

      credentials:
        options.credentials ||
        "include",

      signal:
        controller.signal
    };

    if (
      options.body !== undefined &&
      options.body !== null
    ) {
      fetchOptions.body =
        options.body instanceof FormData
          ? options.body
          : JSON.stringify(
              options.body
            );
    }

    try {
      var response =
        await fetch(
          buildUrl(path),
          fetchOptions
        );

      var contentType =
        response.headers.get(
          "content-type"
        ) || "";

      var data;

      if (
        contentType.indexOf(
          "application/json"
        ) !== -1
      ) {
        data =
          await response.json();
      } else {
        data =
          await response.text();
      }

      if (!response.ok) {
        var message =
          data &&
          typeof data === "object" &&
          data.message
            ? data.message
            : "JG API request failed.";

        var error =
          new Error(message);

        error.status =
          response.status;

        error.data = data;

        throw error;
      }

      return data;
    } catch (error) {
      if (
        error.name === "AbortError"
      ) {
        throw new Error(
          "The JG server took too long to respond."
        );
      }

      throw error;
    } finally {
      window.clearTimeout(
        timeoutId
      );
    }
  }

  /* ---------------------------------------------------------
     GET
  --------------------------------------------------------- */

  function get(
    path,
    options
  ) {
    return request(
      path,
      Object.assign(
        {},
        options || {},
        {
          method: "GET"
        }
      )
    );
  }

  /* ---------------------------------------------------------
     POST
  --------------------------------------------------------- */

  function post(
    path,
    body,
    options
  ) {
    return request(
      path,
      Object.assign(
        {},
        options || {},
        {
          method: "POST",
          body: body
        }
      )
    );
  }

  /* ---------------------------------------------------------
     PUT
  --------------------------------------------------------- */

  function put(
    path,
    body,
    options
  ) {
    return request(
      path,
      Object.assign(
        {},
        options || {},
        {
          method: "PUT",
          body: body
        }
      )
    );
  }

  /* ---------------------------------------------------------
     PATCH
  --------------------------------------------------------- */

  function patch(
    path,
    body,
    options
  ) {
    return request(
      path,
      Object.assign(
        {},
        options || {},
        {
          method: "PATCH",
          body: body
        }
      )
    );
  }

  /* ---------------------------------------------------------
     DELETE
  --------------------------------------------------------- */

  function del(
    path,
    options
  ) {
    return request(
      path,
      Object.assign(
        {},
        options || {},
        {
          method: "DELETE"
        }
      )
    );
  }

  /* =========================================================
     AUTHENTICATION
     ========================================================= */

  function signup(userData) {
    return post(
      "/auth/signup",
      userData
    );
  }

  function login(credentials) {
    return post(
      "/auth/login",
      credentials
    );
  }

  function logout() {
    return post(
      "/auth/logout"
    );
  }

  function currentUser() {
    return get(
      "/auth/me"
    );
  }

  function forgotPassword(email) {
    return post(
      "/auth/forgot-password",
      {
        email: email
      }
    );
  }

  function resetPassword(data) {
    return post(
      "/auth/reset-password",
      data
    );
  }

  /* =========================================================
     PROFILE
     ========================================================= */

  function getProfile() {
    return get(
      "/profile"
    );
  }

  function updateProfile(data) {
    return put(
      "/profile",
      data
    );
  }

  /* =========================================================
     COURSES
     ========================================================= */

  function getCourses(params) {
    var query =
      new URLSearchParams(
        params || {}
      ).toString();

    return get(
      "/courses" +
        (query ? "?" + query : "")
    );
  }

  function getCourse(courseId) {
    return get(
      "/courses/" +
        encodeURIComponent(
          courseId
        )
    );
  }

  function getCourseLessons(
    courseId
  ) {
    return get(
      "/courses/" +
        encodeURIComponent(
          courseId
        ) +
        "/lessons"
    );
  }

  function getLesson(lessonId) {
    return get(
      "/lessons/" +
        encodeURIComponent(
          lessonId
        )
    );
  }

  /* =========================================================
     LEARNING PROGRESS
     ========================================================= */

  function getProgress(
    courseId
  ) {
    return get(
      "/progress/" +
        encodeURIComponent(
          courseId
        )
    );
  }

  function updateProgress(
    data
  ) {
    return post(
      "/progress",
      data
    );
  }

  /* =========================================================
     EXAMS
     ========================================================= */

  function getExam(
    courseId
  ) {
    return get(
      "/exams/" +
        encodeURIComponent(
          courseId
        )
    );
  }

  function submitExam(
    examId,
    answers
  ) {
    return post(
      "/exams/" +
        encodeURIComponent(
          examId
        ) +
        "/submit",
      {
        answers: answers
      }
    );
  }

  /* =========================================================
     CERTIFICATES
     ========================================================= */

  function getCertificate(
    certificateId
  ) {
    return get(
      "/certificates/" +
        encodeURIComponent(
          certificateId
        )
    );
  }

  function verifyCertificate(
    certificateId
  ) {
    return get(
      "/certificates/verify/" +
        encodeURIComponent(
          certificateId
        )
    );
  }

  /* =========================================================
     OPPORTUNITIES / FIND WORK
     ========================================================= */

  function getOpportunities(
    params
  ) {
    var query =
      new URLSearchParams(
        params || {}
      ).toString();

    return get(
      "/opportunities" +
        (query ? "?" + query : "")
    );
  }

  function getOpportunity(
    opportunityId
  ) {
    return get(
      "/opportunities/" +
        encodeURIComponent(
          opportunityId
        )
    );
  }

  function saveOpportunity(
    opportunityId
  ) {
    return post(
      "/opportunities/" +
        encodeURIComponent(
          opportunityId
        ) +
        "/save"
    );
  }

  function unsaveOpportunity(
    opportunityId
  ) {
    return del(
      "/opportunities/" +
        encodeURIComponent(
          opportunityId
        ) +
        "/save"
    );
  }

  function getSavedOpportunities() {
    return get(
      "/opportunities/saved"
    );
  }

  /* =========================================================
     JG AI
     ========================================================= */

  function jgAiChat(
    message,
    options
  ) {
    options = options || {};

    return post(
      "/jg-ai/chat",
      {
        message: message,

        conversationId:
          options.conversationId ||
          null,

        context:
          options.context ||
          null
      }
    );
  }

  /* =========================================================
     PREMIUM
     ========================================================= */

  function premiumPlans() {
    return get(
      "/premium/plans"
    );
  }

  function getPremiumPlan(
    planId
  ) {
    return get(
      "/premium/plans/" +
        encodeURIComponent(
          planId
        )
    );
  }

  function myPremium() {
    return get(
      "/premium/me"
    );
  }

  function subscribePremium(
    planId
  ) {
    return post(
      "/premium/subscribe/" +
        encodeURIComponent(
          planId
        )
    );
  }

  /* =========================================================
     ADVERTISEMENTS
     ========================================================= */

  function adPlacements() {
    return get(
      "/ads/placements"
    );
  }

  /* =========================================================
     HEALTH
     ========================================================= */

  function health() {
    return get(
      "/health"
    );
  }

  function readiness() {
    return get(
      "/health/ready"
    );
  }

  /* =========================================================
     ADMIN
     ========================================================= */

  function adminDashboard() {
    return get(
      "/admin/dashboard"
    );
  }

  function adminUsers(params) {
    var query =
      new URLSearchParams(
        params || {}
      ).toString();

    return get(
      "/admin/users" +
        (query ? "?" + query : "")
    );
  }

  function adminCourses(params) {
    var query =
      new URLSearchParams(
        params || {}
      ).toString();

    return get(
      "/admin/courses" +
        (query ? "?" + query : "")
    );
  }

  function adminOpportunities(
    params
  ) {
    var query =
      new URLSearchParams(
        params || {}
      ).toString();

    return get(
      "/admin/opportunities" +
        (query ? "?" + query : "")
    );
  }

  function adminAuditLogs(
    params
  ) {
    var query =
      new URLSearchParams(
        params || {}
      ).toString();

    return get(
      "/admin/audit" +
        (query ? "?" + query : "")
    );
  }

  /* =========================================================
     PUBLIC JG API
     ========================================================= */

  window.JG_API = {
    request: request,

    get: get,
    post: post,
    put: put,
    patch: patch,
    delete: del,

    /* Authentication */
    signup: signup,
    login: login,
    logout: logout,
    currentUser: currentUser,
    forgotPassword:
      forgotPassword,
    resetPassword:
      resetPassword,

    /* Profile */
    getProfile:
      getProfile,
    updateProfile:
      updateProfile,

    /* Learning */
    getCourses:
      getCourses,
    getCourse:
      getCourse,
    getCourseLessons:
      getCourseLessons,
    getLesson:
      getLesson,
    getProgress:
      getProgress,
    updateProgress:
      updateProgress,

    /* Exams */
    getExam:
      getExam,
    submitExam:
      submitExam,

    /* Certificates */
    getCertificate:
      getCertificate,
    verifyCertificate:
      verifyCertificate,

    /* Work */
    getOpportunities:
      getOpportunities,
    getOpportunity:
      getOpportunity,
    saveOpportunity:
      saveOpportunity,
    unsaveOpportunity:
      unsaveOpportunity,
    getSavedOpportunities:
      getSavedOpportunities,

    /* JG AI */
    jgAiChat:
      jgAiChat,

    /* Premium */
    premiumPlans:
      premiumPlans,
    getPremiumPlan:
      getPremiumPlan,
    myPremium:
      myPremium,
    subscribePremium:
      subscribePremium,

    /* Ads */
    adPlacements:
      adPlacements,

    /* Health */
    health:
      health,
    readiness:
      readiness,

    /* Admin */
    adminDashboard:
      adminDashboard,
    adminUsers:
      adminUsers,
    adminCourses:
      adminCourses,
    adminOpportunities:
      adminOpportunities,
    adminAuditLogs:
      adminAuditLogs
  };

})();
