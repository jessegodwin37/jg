/* =========================================================
   JG — GLOBAL APP JAVASCRIPT
   Theme + Mobile Navigation + Shared UI
========================================================= */

(function () {

    "use strict";


    /* =====================================================
       1. GET ELEMENTS
    ===================================================== */

    const html = document.documentElement;

    const themeToggle =
        document.getElementById("themeToggle");

    const mobileMenuBtn =
        document.getElementById("mobileMenuBtn");

    const mainNav =
        document.getElementById("mainNav");


    /* =====================================================
       2. THEME SYSTEM
    ===================================================== */

    const savedTheme =
        localStorage.getItem("jg-theme");

    const systemDark =
        window.matchMedia &&
        window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;


    /*
       Decide which theme should load.

       Priority:

       1. User's saved choice
       2. Phone's system theme
       3. Light mode
    */

    let currentTheme =
        savedTheme ||
        (systemDark ? "dark" : "light");


    function applyTheme(theme) {

        currentTheme = theme;

        html.setAttribute(
            "data-theme",
            theme
        );


        localStorage.setItem(
            "jg-theme",
            theme
        );


        updateThemeButton();
    }


    function updateThemeButton() {

        if (!themeToggle) {
            return;
        }


        if (currentTheme === "dark") {

            themeToggle.textContent = "☀️";

            themeToggle.setAttribute(
                "aria-label",
                "Switch to light mode"
            );

            themeToggle.setAttribute(
                "title",
                "Switch to light mode"
            );

        } else {

            themeToggle.textContent = "🌙";

            themeToggle.setAttribute(
                "aria-label",
                "Switch to dark mode"
            );

            themeToggle.setAttribute(
                "title",
                "Switch to dark mode"
            );
        }
    }


    /* Apply theme immediately */

    applyTheme(currentTheme);


    /* =====================================================
       3. THEME TOGGLE
    ===================================================== */

    if (themeToggle) {

        themeToggle.addEventListener(
            "click",
            function () {

                const newTheme =
                    currentTheme === "dark"
                        ? "light"
                        : "dark";

                applyTheme(newTheme);

            }
        );
    }


    /* =====================================================
       4. FOLLOW SYSTEM THEME
    ===================================================== */

    if (
        window.matchMedia
    ) {

        const mediaQuery =
            window.matchMedia(
                "(prefers-color-scheme: dark)"
            );


        function systemThemeChanged(event) {

            /*
              Only follow the system automatically
              if the user has NOT manually selected
              a theme.
            */

            if (
                !localStorage.getItem("jg-theme")
            ) {

                applyTheme(
                    event.matches
                        ? "dark"
                        : "light"
                );
            }
        }


        if (
            mediaQuery.addEventListener
        ) {

            mediaQuery.addEventListener(
                "change",
                systemThemeChanged
            );

        } else if (
            mediaQuery.addListener
        ) {

            mediaQuery.addListener(
                systemThemeChanged
            );
        }
    }


    /* =====================================================
       5. MOBILE MENU
    ===================================================== */

    if (
        mobileMenuBtn &&
        mainNav
    ) {

        mobileMenuBtn.addEventListener(
            "click",
            function () {

                const isOpen =
                    mainNav.classList.toggle(
                        "open"
                    );


                mobileMenuBtn.textContent =
                    isOpen
                        ? "✕"
                        : "☰";


                mobileMenuBtn.setAttribute(
                    "aria-label",
                    isOpen
                        ? "Close menu"
                        : "Open menu"
                );
            }
        );


        /* Close menu after clicking a link */

        const navLinks =
            mainNav.querySelectorAll(
                "a"
            );


        navLinks.forEach(
            function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        mainNav.classList.remove(
                            "open"
                        );

                        mobileMenuBtn.textContent =
                            "☰";

                        mobileMenuBtn.setAttribute(
                            "aria-label",
                            "Open menu"
                        );
                    }
                );

            }
        );


        /* Close menu if user taps outside */

        document.addEventListener(
            "click",
            function (event) {

                const clickedInsideMenu =
                    mainNav.contains(
                        event.target
                    );

                const clickedButton =
                    mobileMenuBtn.contains(
                        event.target
                    );


                if (
                    !clickedInsideMenu &&
                    !clickedButton
                ) {

                    mainNav.classList.remove(
                        "open"
                    );

                    mobileMenuBtn.textContent =
                        "☰";

                    mobileMenuBtn.setAttribute(
                        "aria-label",
                        "Open menu"
                    );
                }

            }
        );
    }


    /* =====================================================
       6. ACTIVE NAVIGATION
    ===================================================== */

    function setActiveNavigation() {

        const currentPage =
            window.location.pathname
                .split("/")
                .pop()
                .toLowerCase();


        const links =
            document.querySelectorAll(
                ".main-nav a"
            );


        links.forEach(
            function (link) {

                const href =
                    link
                        .getAttribute("href")
                        ?.split("/")
                        .pop()
                        .toLowerCase();


                if (
                    href &&
                    href === currentPage
                ) {

                    link.classList.add(
                        "active"
                    );

                } else {

                    link.classList.remove(
                        "active"
                    );
                }

            }
        );


        /*
          GitHub Pages can sometimes load the
          homepage without explicitly showing
          index.html.
        */

        if (
            currentPage === "" ||
            currentPage === "/"
        ) {

            const home =
                document.querySelector(
                    '.main-nav a[href="index.html"]'
                );


            if (home) {

                home.classList.add(
                    "active"
                );
            }
        }
    }


    setActiveNavigation();


    /* =====================================================
       7. SMOOTH INTERNAL LINKS
    ===================================================== */

    const anchorLinks =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    anchorLinks.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function (event) {

                    const targetId =
                        link.getAttribute(
                            "href"
                        );


                    if (
                        !targetId ||
                        targetId === "#"
                    ) {
                        return;
                    }


                    const target =
                        document.querySelector(
                            targetId
                        );


                    if (target) {

                        event.preventDefault();


                        target.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });

                    }

                }
            );

        }
    );


    /* =====================================================
       8. ADD CURRENT YEAR
    ===================================================== */

    const yearElements =
        document.querySelectorAll(
            "[data-current-year]"
        );


    yearElements.forEach(
        function (element) {

            element.textContent =
                new Date().getFullYear();

        }
    );


    /* =====================================================
       9. GLOBAL JG OBJECT
    ===================================================== */

    /*
       This gives the other JG JavaScript files
       a shared place to access basic app settings.
    */

    window.JG = {

        version: "1.0.0",

        theme: function () {
            return currentTheme;
        },

        setTheme: function (theme) {

            if (
                theme === "dark" ||
                theme === "light"
            ) {

                applyTheme(theme);
            }
        },

        toggleTheme: function () {

            applyTheme(
                currentTheme === "dark"
                    ? "light"
                    : "dark"
            );
        }

    };


    /* =====================================================
       10. PAGE READY EVENT
    ===================================================== */

    document.dispatchEvent(
        new CustomEvent(
            "jg:ready",
            {
                detail: {
                    version: "1.0.0",
                    theme: currentTheme
                }
            }
        )
    );


    console.log(
        "JG platform initialized."
    );

})();
