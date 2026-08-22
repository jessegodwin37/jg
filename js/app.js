/* =========================================
   JG - MAIN JAVASCRIPT
   Find Skills. Find Work.
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* ================================
       MOBILE MENU
    ================================= */

    const menuButton = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuButton && navLinks) {

        menuButton.addEventListener("click", function () {

            navLinks.classList.toggle("show");

            if (navLinks.classList.contains("show")) {
                menuButton.textContent = "✕";
            } else {
                menuButton.textContent = "☰";
            }

        });

    }


    /* ================================
       CLOSE MENU AFTER CLICKING LINK
    ================================= */

    const navigationLinks =
        document.querySelectorAll(".nav-links a");

    navigationLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            if (navLinks) {
                navLinks.classList.remove("show");
            }

            if (menuButton) {
                menuButton.textContent = "☰";
            }

        });

    });


    /* ================================
       ACTIVE PAGE
    ================================= */

    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

    navigationLinks.forEach(function (link) {

        const linkPage = link.getAttribute("href");

        if (linkPage === currentPage) {
            link.classList.add("active");
        }

    });


    /* ================================
       SIMPLE BUTTON FEEDBACK
    ================================= */

    const buttons =
        document.querySelectorAll(".btn");

    buttons.forEach(function (button) {

        button.addEventListener("click", function () {

            button.style.transform = "scale(0.97)";

            setTimeout(function () {
                button.style.transform = "";
            }, 120);

        });

    });

});
