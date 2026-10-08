/* =========================================================
   JG APPLICATION BOOTSTRAP
   ========================================================= */

(function () {

  "use strict";


  const UI =
    window.JG_UI;

  const AUTH =
    window.JG_AUTH;


  const APP = {


    /* -----------------------------------------------------
       INITIALIZE
       ----------------------------------------------------- */

    async init() {

      UI?.initTheme();

      APP.initThemeButtons();

      APP.initActiveNavigation();

      APP.initLinks();

      APP.initGlobalButtons();

      APP.initAuthState();

      APP.markAppReady();

    },


    /* -----------------------------------------------------
       THEME
       ----------------------------------------------------- */

    initThemeButtons() {

      const buttons =
        document.querySelectorAll(
          "#themeButton"
        );


      buttons.forEach(button => {

        button.addEventListener(
          "click",
          event => {

            event.preventDefault();

            UI?.toggleTheme();

          }
        );

      });

    },


    /* -----------------------------------------------------
       ACTIVE NAVIGATION
       ----------------------------------------------------- */

    initActiveNavigation() {

      const current =
        window.location.pathname
          .split("/")
          .pop()
          .toLowerCase();


      const currentPage =
        current || "index.html";


      document
        .querySelectorAll(
          ".nav-item"
        )
        .forEach(item => {

          const href =
            item.getAttribute("href");


          if (!href) {
            return;
          }


          const target =
            href
              .split("?")[0]
              .split("#")[0]
              .toLowerCase();


          item.classList.toggle(
            "active",
            target === currentPage ||
            (
              currentPage === "" &&
              target === "index.html"
            )
          );

        });

    },


    /* -----------------------------------------------------
       INTERNAL LINKS
       ----------------------------------------------------- */

    initLinks() {

      document.addEventListener(
        "click",
        event => {

          const link =
            event.target.closest(
              "a"
            );


          if (!link) {
            return;
          }


          const href =
            link.getAttribute(
              "href"
            );


          if (
            !href ||
            href.startsWith("#") ||
            href.startsWith("http://") ||
            href.startsWith("https://") ||
            href.startsWith("mailto:") ||
            href.startsWith("tel:")
          ) {

            return;

          }


          /*
           * Let normal browser navigation
           * handle ordinary HTML pages.
           *
           * This handler only prevents accidental
           * double clicks.
           */

          if (
            link.dataset.jgNavigating ===
            "true"
          ) {

            event.preventDefault();

            return;

          }


          link.dataset.jgNavigating =
            "true";

          window.setTimeout(
            () => {

              delete link.dataset
                .jgNavigating;

            },
            800
          );

        }
      );

    },


    /* -----------------------------------------------------
       GLOBAL BUTTONS
       ----------------------------------------------------- */

    initGlobalButtons() {

      document.addEventListener(
        "click",
        event => {

          const actionElement =
            event.target.closest(
              "[data-jg-action]"
            );


          if (!actionElement) {
            return;
          }


          const action =
            actionElement.dataset
              .jgAction;


          switch (action) {

            case "back":

              event.preventDefault();

              window.history.back();

              break;


            case "login":

              event.preventDefault();

              window.location.href =
                "login.html";

              break;


            case "signup":

              event.preventDefault();

              window.location.href =
                "signup.html";

              break;


            case "account":

              event.preventDefault();

              window.location.href =
                "account.html";

              break;


            case "premium":

              event.preventDefault();

              window.location.href =
                "premium.html";

              break;


            case "learn":

              event.preventDefault();

              window.location.href =
                "learn.html";

              break;


            case "work":

              event.preventDefault();

              window.location.href =
                "work.html";

              break;


            case "ai":

              event.preventDefault();

              window.location.href =
                "ai.html";

              break;

          }

        }
      );

    },


    /* -----------------------------------------------------
       AUTH STATE
       ----------------------------------------------------- */

    initAuthState() {

      if (!AUTH) {
        return;
      }


      AUTH.onAuthStateChange(
        (event, session) => {

          document.body.dataset
            .authState =
            session
              ? "authenticated"
              : "guest";


          document
            .querySelectorAll(
              "[data-auth-only]"
            )
            .forEach(element => {

              element.hidden =
                !session;

            });


          document
            .querySelectorAll(
              "[data-guest-only]"
            )
            .forEach(element => {

              element.hidden =
                Boolean(session);

            });


          document
            .querySelectorAll(
              "[data-user-email]"
            )
            .forEach(element => {

              element.textContent =
                session?.user?.email ||
                "";

            });


          document
            .querySelectorAll(
              "[data-user-name]"
            )
            .forEach(element => {

              element.textContent =
                AUTH.getDisplayName(
                  session?.user
                );

            });

        }
      );

    },


    /* -----------------------------------------------------
       READY STATE
       ----------------------------------------------------- */

    markAppReady() {

      document.documentElement
        .classList.add(
          "jg-ready"
        );

      document.body.dataset
        .jgReady =
        "true";

    }

  };


  window.JG_APP =
    APP;


  /*
   * Start after DOM is available.
   */

  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      () => APP.init()
    );

  } else {

    APP.init();

  }


})();
