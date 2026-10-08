/* =========================================================
   JG UI ENGINE
   ========================================================= */

(function () {

  "use strict";


  const CONFIG =
    window.JG_CONFIG || {};


  const UI = {


    /* -----------------------------------------------------
       SELECTORS
       ----------------------------------------------------- */

    $(selector, parent = document) {

      return parent.querySelector(selector);

    },


    $$(selector, parent = document) {

      return Array.from(
        parent.querySelectorAll(selector)
      );

    },


    /* -----------------------------------------------------
       THEME
       ----------------------------------------------------- */

    getTheme() {

      try {

        return (
          localStorage.getItem(
            CONFIG.THEME_KEY || "jg-theme"
          ) ||
          CONFIG.DEFAULT_THEME ||
          "dark"
        );

      } catch {

        return "dark";

      }

    },


    setTheme(theme) {

      const validTheme =
        theme === "light"
          ? "light"
          : "dark";


      document.documentElement.dataset.theme =
        validTheme;


      try {

        localStorage.setItem(
          CONFIG.THEME_KEY || "jg-theme",
          validTheme
        );

      } catch {
        // Storage can be unavailable.
      }


      UI.updateThemeButton(
        validTheme
      );

    },


    toggleTheme() {

      const current =
        UI.getTheme();

      UI.setTheme(
        current === "dark"
          ? "light"
          : "dark"
      );

    },


    updateThemeButton(theme) {

      const buttons =
        UI.$$("#themeButton");


      buttons.forEach(button => {

        button.textContent =
          theme === "dark"
            ? "☀"
            : "☾";

        button.setAttribute(
          "aria-label",
          theme === "dark"
            ? "Switch to light mode"
            : "Switch to dark mode"
        );

      });

    },


    initTheme() {

      UI.setTheme(
        UI.getTheme()
      );

    },


    /* -----------------------------------------------------
       TOASTS
       ----------------------------------------------------- */

    toast(
      message,
      type = "info",
      duration = 3500
    ) {

      let container =
        document.querySelector(
          ".jg-toast-container"
        );


      if (!container) {

        container =
          document.createElement("div");

        container.className =
          "jg-toast-container";

        document.body.appendChild(
          container
        );

      }


      const toast =
        document.createElement("div");

      toast.className =
        `jg-toast ${type}`;

      toast.setAttribute(
        "role",
        "status"
      );

      toast.textContent =
        String(message);


      container.appendChild(
        toast
      );


      window.setTimeout(() => {

        toast.style.opacity = "0";
        toast.style.transform =
          "translateY(8px)";

        window.setTimeout(() => {

          toast.remove();

        }, 180);

      }, duration);

    },


    /* -----------------------------------------------------
       LOADING
       ----------------------------------------------------- */

    loading(
      element,
      text = "Loading..."
    ) {

      if (!element) {
        return;
      }


      element.innerHTML = `
        <div class="jg-loading">
          <div>
            <div
              class="jg-spinner"
              aria-hidden="true"
            ></div>

            <div
              style="
                margin-top:12px;
                text-align:center;
                font-size:12px;
              "
            >
              ${UI.escapeHTML(text)}
            </div>
          </div>
        </div>
      `;

    },


    /* -----------------------------------------------------
       EMPTY
       ----------------------------------------------------- */

    empty(
      element,
      message = "Nothing here yet."
    ) {

      if (!element) {
        return;
      }


      element.innerHTML = `
        <div class="jg-empty">
          ${UI.escapeHTML(message)}
        </div>
      `;

    },


    /* -----------------------------------------------------
       ERROR
       ----------------------------------------------------- */

    error(
      element,
      message = "Something went wrong."
    ) {

      if (!element) {
        return;
      }


      element.innerHTML = `
        <div
          class="jg-error"
          role="alert"
        >
          ${UI.escapeHTML(message)}
        </div>
      `;

    },


    /* -----------------------------------------------------
       MODALS
       ----------------------------------------------------- */

    openModal(
      title,
      content,
      options = {}
    ) {

      UI.closeModal();


      const modal =
        document.createElement("div");

      modal.className =
        "jg-modal is-open";

      modal.id =
        "jgDynamicModal";


      modal.innerHTML = `
        <div
          class="jg-modal-card"
          role="dialog"
          aria-modal="true"
          aria-label="${UI.escapeHTML(
            title
          )}"
        >

          <div
            style="
              display:flex;
              align-items:center;
              justify-content:space-between;
              gap:16px;
              margin-bottom:18px;
            "
          >

            <h2
              style="
                margin:0;
                font-size:21px;
              "
            >
              ${UI.escapeHTML(title)}
            </h2>

            <button
              type="button"
              class="btn btn-ghost"
              data-jg-close-modal
              aria-label="Close"
            >
              Close
            </button>

          </div>

          <div>
            ${content}
          </div>

        </div>
      `;


      document.body.appendChild(
        modal
      );


      modal.addEventListener(
        "click",
        event => {

          if (
            event.target === modal ||
            event.target.closest(
              "[data-jg-close-modal]"
            )
          ) {

            UI.closeModal();

          }

        }
      );


      if (
        typeof options.onOpen ===
        "function"
      ) {

        options.onOpen(modal);

      }


      return modal;

    },


    closeModal() {

      const modal =
        document.getElementById(
          "jgDynamicModal"
        );


      if (modal) {

        modal.remove();

      }

    },


    /* -----------------------------------------------------
       HTML SAFETY
       ----------------------------------------------------- */

    escapeHTML(value) {

      const div =
        document.createElement("div");

      div.textContent =
        value == null
          ? ""
          : String(value);

      return div.innerHTML;

    },


    /* -----------------------------------------------------
       FORM DATA
       ----------------------------------------------------- */

    formData(form) {

      const data = {};

      if (!form) {
        return data;
      }


      const formData =
        new FormData(form);


      formData.forEach(
        (value, key) => {

          data[key] =
            typeof value === "string"
              ? value.trim()
              : value;

        }
      );


      return data;

    },


    /* -----------------------------------------------------
       NAVIGATION
       ----------------------------------------------------- */

    go(url) {

      if (!url) {
        return;
      }


      window.location.href =
        url;

    },


    /* -----------------------------------------------------
       BUTTON STATE
       ----------------------------------------------------- */

    setButtonLoading(
      button,
      loading,
      loadingText = "Please wait..."
    ) {

      if (!button) {
        return;
      }


      if (loading) {

        if (!button.dataset.originalText) {

          button.dataset.originalText =
            button.textContent;

        }


        button.disabled = true;

        button.textContent =
          loadingText;

      } else {

        button.disabled = false;

        button.textContent =
          button.dataset.originalText ||
          button.textContent;

      }

    }


  };


  window.JG_UI =
    UI;


})();
