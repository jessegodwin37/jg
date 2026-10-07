/* =========================================================
   JG — UI Utilities
   File: frontend/js/ui.js

   Handles:
   - Toasts
   - Alerts
   - Loading states
   - Modals
   - Dropdowns
   - Tabs
   - Password visibility
   - Progress bars
   - Empty states
   - Safe HTML escaping
   - UI helpers
   ========================================================= */

(function () {
  "use strict";

  /* ---------------------------------------------------------
     Basic Helpers
  --------------------------------------------------------- */

  var $ = function (selector, parent) {
    return (parent || document).querySelector(
      selector
    );
  };

  var $$ = function (selector, parent) {
    return Array.prototype.slice.call(
      (parent || document).querySelectorAll(
        selector
      )
    );
  };

  /* ---------------------------------------------------------
     HTML Escape
  --------------------------------------------------------- */

  function escapeHTML(value) {
    if (
      value === null ||
      value === undefined
    ) {
      return "";
    }

    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /* ---------------------------------------------------------
     Toast Container
  --------------------------------------------------------- */

  function getToastContainer() {
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

    return container;
  }

  /* ---------------------------------------------------------
     Toast
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
        : Number(duration);

    var container =
      getToastContainer();

    var item =
      document.createElement("div");

    item.className =
      "toast toast-" + type;

    item.setAttribute(
      "role",
      "status"
    );

    item.textContent =
      String(message || "");

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

    return item;
  }

  /* ---------------------------------------------------------
     Alert
  --------------------------------------------------------- */

  function showAlert(
    container,
    message,
    type
  ) {
    if (!container) {
      return null;
    }

    type = type || "info";

    container.innerHTML =
      '<div class="alert alert-' +
      escapeHTML(type) +
      '" role="alert">' +
      escapeHTML(message) +
      "</div>";

    return container.firstElementChild;
  }

  function clearAlert(
    container
  ) {
    if (container) {
      container.innerHTML = "";
    }
  }

  /* ---------------------------------------------------------
     Loading
  --------------------------------------------------------- */

  function showLoading(
    element,
    text
  ) {
    if (!element) {
      return;
    }

    if (
      !element.dataset.originalContent
    ) {
      element.dataset.originalContent =
        element.innerHTML;
    }

    element.disabled = true;

    element.classList.add(
      "loading"
    );

    element.innerHTML =
      '<span class="jg-spinner" aria-hidden="true"></span>' +
      '<span>' +
      escapeHTML(
        text || "Please wait..."
      ) +
      "</span>";
  }

  function hideLoading(
    element
  ) {
    if (!element) {
      return;
    }

    element.disabled = false;

    element.classList.remove(
      "loading"
    );

    if (
      element.dataset.originalContent
    ) {
      element.innerHTML =
        element.dataset.originalContent;

      delete element.dataset
        .originalContent;
    }
  }

  /* ---------------------------------------------------------
     Full Page Loader
  --------------------------------------------------------- */

  function showPageLoader(
    message
  ) {
    var loader =
      $("#jgPageLoader");

    if (!loader) {
      loader =
        document.createElement("div");

      loader.id =
        "jgPageLoader";

      loader.className =
        "page-loader";

      loader.innerHTML =
        '<div class="page-loader-content">' +
        '<span class="jg-spinner"></span>' +
        '<span class="page-loader-text"></span>' +
        "</div>";

      document.body.appendChild(
        loader
      );
    }

    var text =
      $(".page-loader-text", loader);

    if (text) {
      text.textContent =
        message || "Loading...";
    }

    loader.classList.add(
      "active"
    );

    loader.setAttribute(
      "aria-hidden",
      "false"
    );
  }

  function hidePageLoader() {
    var loader =
      $("#jgPageLoader");

    if (!loader) {
      return;
    }

    loader.classList.remove(
      "active"
    );

    loader.setAttribute(
      "aria-hidden",
      "true"
    );
  }

  /* ---------------------------------------------------------
     Modal
  --------------------------------------------------------- */

  function openModal(
    modal
  ) {
    if (
      typeof modal ===
      "string"
    ) {
      modal =
        document.getElementById(
          modal
        );
    }

    if (!modal) {
      return;
    }

    modal.classList.add(
      "active"
    );

    modal.classList.add(
      "open"
    );

    modal.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.classList.add(
      "modal-open"
    );
  }

  function closeModal(
    modal
  ) {
    if (
      typeof modal ===
      "string"
    ) {
      modal =
        document.getElementById(
          modal
        );
    }

    if (!modal) {
      return;
    }

    modal.classList.remove(
      "active"
    );

    modal.classList.remove(
      "open"
    );

    modal.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.classList.remove(
      "modal-open"
    );
  }

  function closeAllModals() {
    $$(".modal").forEach(
      function (modal) {
        closeModal(modal);
      }
    );
  }

  /* ---------------------------------------------------------
     Dropdowns
  --------------------------------------------------------- */

  function closeDropdowns() {
    $$(
      ".dropdown.open, .dropdown.active"
    ).forEach(
      function (dropdown) {
        dropdown.classList.remove(
          "open"
        );

        dropdown.classList.remove(
          "active"
        );
      }
    );
  }

  function setupDropdowns() {
    $$(
      "[data-dropdown-toggle]"
    ).forEach(
      function (button) {
        button.addEventListener(
          "click",
          function (event) {
            event.stopPropagation();

            var id =
              button.getAttribute(
                "data-dropdown-toggle"
              );

            var dropdown =
              document.getElementById(
                id
              );

            if (!dropdown) {
              return;
            }

            var isOpen =
              dropdown.classList.contains(
                "open"
              );

            closeDropdowns();

            if (!isOpen) {
              dropdown.classList.add(
                "open"
              );

              dropdown.classList.add(
                "active"
              );
            }
          }
        );
      }
    );

    document.addEventListener(
      "click",
      function () {
        closeDropdowns();
      }
    );
  }

  /* ---------------------------------------------------------
     Tabs
  --------------------------------------------------------- */

  function activateTab(
    tab,
    group
  ) {
    if (!tab) {
      return;
    }

    var target =
      tab.getAttribute(
        "data-tab"
      );

    if (!target) {
      return;
    }

    var scope =
      group ||
      tab.closest(
        "[data-tabs]"
      ) ||
      document;

    $$(
      "[data-tab]",
      scope
    ).forEach(
      function (item) {
        item.classList.toggle(
          "active",
          item === tab
        );

        item.setAttribute(
          "aria-selected",
          item === tab
            ? "true"
            : "false"
        );
      }
    );

    $$(
      "[data-tab-panel]",
      scope
    ).forEach(
      function (panel) {
        var matches =
          panel.getAttribute(
            "data-tab-panel"
          ) === target;

        panel.hidden =
          !matches;

        panel.classList.toggle(
          "active",
          matches
        );
      }
    );
  }

  function setupTabs() {
    $$("[data-tabs]").forEach(
      function (group) {
        $$(
          "[data-tab]",
          group
        ).forEach(
          function (tab) {
            tab.addEventListener(
              "click",
              function () {
                activateTab(
                  tab,
                  group
                );
              }
            );
          }
        );

        var initial =
          $(
            "[data-tab].active",
            group
          ) ||
          $(
            "[data-tab]",
            group
          );

        if (initial) {
          activateTab(
            initial,
            group
          );
        }
      }
    );
  }

  /* ---------------------------------------------------------
     Password Visibility
  --------------------------------------------------------- */

  function togglePassword(
    input,
    button
  ) {
    if (!input) {
      return;
    }

    var isPassword =
      input.type === "password";

    input.type =
      isPassword
        ? "text"
        : "password";

    if (button) {
      button.setAttribute(
        "aria-label",
        isPassword
          ? "Hide password"
          : "Show password"
      );

      button.setAttribute(
        "title",
        isPassword
          ? "Hide password"
          : "Show password"
      );

      var icon =
        $(
          "[data-password-icon]",
          button
        );

      if (icon) {
        icon.textContent =
          isPassword
            ? "🙈"
            : "👁️";
      }
    }
  }

  function setupPasswordToggles() {
    $$(
      "[data-password-toggle]"
    ).forEach(
      function (button) {
        button.addEventListener(
          "click",
          function () {
            var targetId =
              button.getAttribute(
                "data-password-toggle"
              );

            var input =
              document.getElementById(
                targetId
              );

            togglePassword(
              input,
              button
            );
          }
        );
      }
    );
  }

  /* ---------------------------------------------------------
     Progress Bars
  --------------------------------------------------------- */

  function setProgress(
    element,
    value
  ) {
    if (!element) {
      return;
    }

    var number =
      Number(value);

    if (
      !Number.isFinite(number)
    ) {
      number = 0;
    }

    number =
      Math.max(
        0,
        Math.min(
          100,
          number
        )
      );

    var bar =
      $(".progress-bar", element) ||
      $(
        "[data-progress-bar]",
        element
      );

    if (bar) {
      bar.style.width =
        number + "%";
    }

    element.setAttribute(
      "aria-valuenow",
      String(number)
    );

    var label =
      $(
        "[data-progress-value]",
        element
      );

    if (label) {
      label.textContent =
        Math.round(number) +
        "%";
    }
  }

  function setupProgressBars() {
    $$(
      "[data-progress]"
    ).forEach(
      function (element) {
        setProgress(
          element,
          element.getAttribute(
            "data-progress"
          )
        );
      }
    );
  }

  /* ---------------------------------------------------------
     Counter Animation
  --------------------------------------------------------- */

  function animateCounter(
    element
  ) {
    if (!element) {
      return;
    }

    var target =
      Number(
        element.getAttribute(
          "data-counter"
        )
      );

    if (
      !Number.isFinite(target)
    ) {
      return;
    }

    var duration = 800;
    var start =
      performance.now();

    function update(now) {
      var progress =
        Math.min(
          (now - start) /
            duration,
          1
        );

      var value =
        Math.round(
          target * progress
        );

      element.textContent =
        value.toLocaleString();

      if (
        progress < 1
      ) {
        requestAnimationFrame(
          update
        );
      }
    }

    requestAnimationFrame(
      update
    );
  }

  function setupCounters() {
    $$(
      "[data-counter]"
    ).forEach(
      animateCounter
    );
  }

  /* ---------------------------------------------------------
     Character Counters
  --------------------------------------------------------- */

  function setupCharacterCounters() {
    $$(
      "[data-character-count]"
    ).forEach(
      function (counter) {
        var targetId =
          counter.getAttribute(
            "data-character-count"
          );

        var input =
          document.getElementById(
            targetId
          );

        if (!input) {
          return;
        }

        var max =
          Number(
            input.getAttribute(
              "maxlength"
            )
          );

        function update() {
          var current =
            input.value.length;

          counter.textContent =
            max
              ? current +
                " / " +
                max
              : String(
                  current
                );
        }

        input.addEventListener(
          "input",
          update
        );

        update();
      }
    );
  }

  /* ---------------------------------------------------------
     Empty State
  --------------------------------------------------------- */

  function showEmptyState(
    container,
    title,
    message
  ) {
    if (!container) {
      return;
    }

    container.innerHTML =
      '<div class="empty-state">' +
      '<div class="empty-state-icon">📭</div>' +
      '<h3>' +
      escapeHTML(
        title ||
          "Nothing here yet"
      ) +
      "</h3>" +
      "<p>" +
      escapeHTML(
        message ||
          "There is nothing to display right now."
      ) +
      "</p>" +
      "</div>";
  }

  /* ---------------------------------------------------------
     Copy To Clipboard
  --------------------------------------------------------- */

  async function copyText(
    text
  ) {
    if (!text) {
      return false;
    }

    try {
      if (
        navigator.clipboard &&
        navigator.clipboard.writeText
      ) {
        await navigator.clipboard.writeText(
          text
        );

        toast(
          "Copied to clipboard.",
          "success"
        );

        return true;
      }

      var textarea =
        document.createElement(
          "textarea"
        );

      textarea.value =
        text;

      textarea.style.position =
        "fixed";

      textarea.style.opacity =
        "0";

      document.body.appendChild(
        textarea
      );

      textarea.select();

      var success =
        document.execCommand(
          "copy"
        );

      textarea.remove();

      if (success) {
        toast(
          "Copied to clipboard.",
          "success"
        );
      }

      return success;
    } catch (error) {
      toast(
        "Unable to copy.",
        "error"
      );

      return false;
    }
  }

  function setupCopyButtons() {
    $$(
      "[data-copy]"
    ).forEach(
      function (button) {
        button.addEventListener(
          "click",
          function () {
            var text =
              button.getAttribute(
                "data-copy"
              );

            copyText(text);
          }
        );
      }
    );
  }

  /* ---------------------------------------------------------
     Confirm Actions
  --------------------------------------------------------- */

  function confirmAction(
    message
  ) {
    return window.confirm(
      message ||
        "Are you sure you want to continue?"
    );
  }

  function setupConfirmActions() {
    $$(
      "[data-confirm]"
    ).forEach(
      function (element) {
        element.addEventListener(
          "click",
          function (event) {
            var message =
              element.getAttribute(
                "data-confirm"
              );

            if (
              !confirmAction(
                message
              )
            ) {
              event.preventDefault();
              event.stopPropagation();
            }
          }
        );
      }
    );
  }

  /* ---------------------------------------------------------
     Tooltips
  --------------------------------------------------------- */

  function setupTooltips() {
    $$(
      "[data-tooltip]"
    ).forEach(
      function (element) {
        var text =
          element.getAttribute(
            "data-tooltip"
          );

        if (!text) {
          return;
        }

        element.setAttribute(
          "title",
          text
        );
      }
    );
  }

  /* ---------------------------------------------------------
     Back Button
  --------------------------------------------------------- */

  function setupBackButtons() {
    $$(
      "[data-back]"
    ).forEach(
      function (button) {
        button.addEventListener(
          "click",
          function (event) {
            event.preventDefault();

            if (
              window.history.length >
              1
            ) {
              window.history.back();
            } else {
              window.location.href =
                "index.html";
            }
          }
        );
      }
    );
  }

  /* ---------------------------------------------------------
     Online / Offline Status
  --------------------------------------------------------- */

  function updateConnectionStatus() {
    var online =
      navigator.onLine;

    $$(
      "[data-connection-status]"
    ).forEach(
      function (element) {
        element.textContent =
          online
            ? "Online"
            : "Offline";

        element.classList.toggle(
          "offline",
          !online
        );

        element.classList.toggle(
          "online",
          online
        );
      }
    );
  }

  function setupConnectionStatus() {
    window.addEventListener(
      "online",
      updateConnectionStatus
    );

    window.addEventListener(
      "offline",
      updateConnectionStatus
    );

    updateConnectionStatus();
  }

  /* ---------------------------------------------------------
     Global Click Handling
  --------------------------------------------------------- */

  function setupGlobalUIActions() {
    document.addEventListener(
      "click",
      function (event) {
        var actionElement =
          event.target.closest(
            "[data-ui-action]"
          );

        if (!actionElement) {
          return;
        }

        var action =
          actionElement.getAttribute(
            "data-ui-action"
          );

        switch (action) {
          case "close-modal":
            event.preventDefault();

            closeModal(
              actionElement.closest(
                ".modal"
              )
            );
            break;

          case "copy":
            event.preventDefault();

            copyText(
              actionElement.getAttribute(
                "data-copy"
              )
            );
            break;

          case "back":
            event.preventDefault();

            if (
              window.history.length >
              1
            ) {
              window.history.back();
            }

            break;

          default:
            break;
        }
      }
    );
  }

  /* ---------------------------------------------------------
     Public JG UI API
  --------------------------------------------------------- */

  window.JG_UI = {
    $: $,
    $$: $$,

    escapeHTML:
      escapeHTML,

    toast:
      toast,

    showAlert:
      showAlert,

    clearAlert:
      clearAlert,

    showLoading:
      showLoading,

    hideLoading:
      hideLoading,

    showPageLoader:
      showPageLoader,

    hidePageLoader:
      hidePageLoader,

    openModal:
      openModal,

    closeModal:
      closeModal,

    closeAllModals:
      closeAllModals,

    activateTab:
      activateTab,

    togglePassword:
      togglePassword,

    setProgress:
      setProgress,

    showEmptyState:
      showEmptyState,

    copyText:
      copyText,

    confirmAction:
      confirmAction
  };

  /* ---------------------------------------------------------
     Initialize UI
  --------------------------------------------------------- */

  function initialize() {
    setupDropdowns();
    setupTabs();
    setupPasswordToggles();
    setupProgressBars();
    setupCounters();
    setupCharacterCounters();
    setupCopyButtons();
    setupConfirmActions();
    setupTooltips();
    setupBackButtons();
    setupConnectionStatus();
    setupGlobalUIActions();
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
