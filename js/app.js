/* =========================================================
   JG PLATFORM
   GLOBAL APPLICATION JAVASCRIPT
   JG — Find Skills. Find Work.
   
   Theme • Navigation • UI • Security Helpers
   Mobile Experience • Shared App Utilities
========================================================= */

(() => {
    "use strict";

    /* =====================================================
       CORE
    ===================================================== */

    const html = document.documentElement;
    const body = document.body;

    const STORAGE = {
        theme: "jg-theme"
    };

    const JG_VERSION = "2.0.0";


    /* =====================================================
       SAFE STORAGE
    ===================================================== */

    const storage = {
        get(key) {
            try {
                return localStorage.getItem(key);
            } catch {
                return null;
            }
        },

        set(key, value) {
            try {
                localStorage.setItem(key, value);
            } catch {
                /* Storage may be unavailable. */
            }
        },

        remove(key) {
            try {
                localStorage.removeItem(key);
            } catch {
                /* Storage may be unavailable. */
            }
        }
    };


    /* =====================================================
       THEME SYSTEM
    ===================================================== */

    const themeToggle =
        document.getElementById("themeToggle");

    const savedTheme =
        storage.get(STORAGE.theme);

    const systemPrefersDark =
        window.matchMedia &&
        window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;

    let currentTheme =
        savedTheme ||
        (systemPrefersDark ? "dark" : "light");


    function updateThemeButton() {

        if (!themeToggle) return;

        const isDark =
            currentTheme === "dark";

        themeToggle.textContent =
            isDark ? "☀️" : "🌙";

        themeToggle.setAttribute(
            "aria-label",
            isDark
                ? "Switch to light mode"
                : "Switch to dark mode"
        );

        themeToggle.setAttribute(
            "title",
            isDark
                ? "Switch to light mode"
                : "Switch to dark mode"
        );

        themeToggle.setAttribute(
            "aria-pressed",
            String(isDark)
        );
    }


    function applyTheme(theme, save = true) {

        if (
            theme !== "light" &&
            theme !== "dark"
        ) {
            return;
        }

        currentTheme = theme;

        html.setAttribute(
            "data-theme",
            theme
        );

        if (save) {
            storage.set(
                STORAGE.theme,
                theme
            );
        }

        updateThemeButton();

        document.dispatchEvent(
            new CustomEvent(
                "jg:themechange",
                {
                    detail: {
                        theme
                    }
                }
            )
        );
    }


    applyTheme(currentTheme, false);


    if (themeToggle) {

        themeToggle.addEventListener(
            "click",
            () => {

                applyTheme(
                    currentTheme === "dark"
                        ? "light"
                        : "dark"
                );

            }
        );

    }


    /* =====================================================
       SYSTEM THEME CHANGES
    ===================================================== */

    if (window.matchMedia) {

        const mediaQuery =
            window.matchMedia(
                "(prefers-color-scheme: dark)"
            );

        const handleSystemThemeChange =
            event => {

                if (
                    !storage.get(
                        STORAGE.theme
                    )
                ) {

                    applyTheme(
                        event.matches
                            ? "dark"
                            : "light",
                        false
                    );

                }

            };


        if (
            typeof mediaQuery.addEventListener ===
            "function"
        ) {

            mediaQuery.addEventListener(
                "change",
                handleSystemThemeChange
            );

        } else if (
            typeof mediaQuery.addListener ===
            "function"
        ) {

            mediaQuery.addListener(
                handleSystemThemeChange
            );

        }

    }


    /* =====================================================
       MOBILE NAVIGATION
    ===================================================== */

    const mobileMenuBtn =
        document.getElementById(
            "mobileMenuBtn"
        );

    const mainNav =
        document.getElementById(
            "mainNav"
        );


    function closeMobileMenu() {

        if (!mainNav) return;

        mainNav.classList.remove(
            "open"
        );

        if (mobileMenuBtn) {

            mobileMenuBtn.textContent =
                "☰";

            mobileMenuBtn.setAttribute(
                "aria-label",
                "Open menu"
            );

            mobileMenuBtn.setAttribute(
                "aria-expanded",
                "false"
            );

        }

        body.classList.remove(
            "menu-open"
        );

    }


    function openMobileMenu() {

        if (!mainNav) return;

        mainNav.classList.add(
            "open"
        );

        if (mobileMenuBtn) {

            mobileMenuBtn.textContent =
                "✕";

            mobileMenuBtn.setAttribute(
                "aria-label",
                "Close menu"
            );

            mobileMenuBtn.setAttribute(
                "aria-expanded",
                "true"
            );

        }

        body.classList.add(
            "menu-open"
        );

    }


    if (
        mobileMenuBtn &&
        mainNav
    ) {

        mobileMenuBtn.setAttribute(
            "aria-expanded",
            "false"
        );

        mobileMenuBtn.setAttribute(
            "aria-label",
            "Open menu"
        );


        mobileMenuBtn.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                const isOpen =
                    mainNav.classList.contains(
                        "open"
                    );

                if (isOpen) {
                    closeMobileMenu();
                } else {
                    openMobileMenu();
                }

            }
        );


        mainNav
            .querySelectorAll("a")
            .forEach
