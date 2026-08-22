document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       MOBILE MENU
    ========================= */

    const menuButton = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".nav-links");

    if (menuButton && nav) {

        menuButton.addEventListener("click", () => {

            nav.classList.toggle("show");

            if (nav.classList.contains("show")) {
                menuButton.textContent = "✕";
            } else {
                menuButton.textContent = "☰";
            }

        });

        nav.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                nav.classList.remove("show");

                menuButton.textContent = "☰";

            });

        });

    }


    /* =========================
       ACTIVE NAVIGATION
    ========================= */

    const currentPage =
        location.pathname.split("/").pop() || "index.html";

    document
        .querySelectorAll(".nav-links a")
        .forEach(link => {

            if (link.getAttribute("href") === currentPage) {

                link.classList.add("active");

            }

        });


    /* =========================
       COURSE PROGRESS
    ========================= */

    const courseKeys = [
        "web",
        "design",
        "video",
        "marketing",
        "social",
        "freelance"
    ];


    function getProgress(course) {

        return Number(
            localStorage.getItem(
                "jg_progress_" + course
            ) || 0
        );

    }


    function updateProgress() {

        courseKeys.forEach(course => {

            const progress =
                getProgress(course);


            /* Progress bars */

            document
                .querySelectorAll(
                    `[data-progress="${course}"]`
                )
                .forEach(element => {

                    element.style.width =
                        progress + "%";

                });


            /* Percentage text */

            document
                .querySelectorAll(
                    `[data-progress-text="${course}"]`
                )
                .forEach(element => {

                    element.textContent =
                        progress + "%";

                });

        });

    }


    updateProgress();


    /* =========================
       COMPLETE LESSON
    ========================= */

    document
        .querySelectorAll(".complete-lesson")
        .forEach(button => {

            const course =
                button.dataset.course;


            const currentProgress =
                getProgress(course);


            if (currentProgress >= 100) {

                button.textContent =
                    "Lesson Completed ✓";

            }


            button.addEventListener("click", () => {

                localStorage.setItem(
                    "jg_progress_" + course,
                    "100"
                );


                button.textContent =
                    "Lesson Completed ✓";


                updateProgress();

            });

        });


    /* =========================
       ENROLLMENT FORM
    ========================= */

    const enrollmentForm =
        document.getElementById(
            "enrollmentForm"
        );


    if (enrollmentForm) {

        const savedEnrollment =
            JSON.parse(
                localStorage.getItem(
                    "jg_enrollment"
                ) || "null"
            );


        /* Load previous information */

        if (savedEnrollment) {

            [
                "name",
                "email",
                "skill",
                "goal"
            ].forEach(fieldName => {

                const field =
                    enrollmentForm.elements[
                        fieldName
                    ];


                if (
                    field &&
                    savedEnrollment[fieldName]
                ) {

                    field.value =
                        savedEnrollment[fieldName];

                }

            });

        }


        /* Submit form */

        enrollmentForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const formData =
                    Object.fromEntries(
                        new FormData(
                            enrollmentForm
                        ).entries()
                    );


                localStorage.setItem(
                    "jg_enrollment",
                    JSON.stringify(formData)
                );


                const message =
                    document.getElementById(
                        "formMessage"
                    );


                if (message) {

                    message.hidden = false;

                    message.textContent =
                        "Enrollment saved successfully! Your JG learning dashboard is ready.";

                }


                window.scrollTo({

                    top:
                        message
                            ? message.getBoundingClientRect().top +
                              window.scrollY -
                              120
                            : 0,

                    behavior: "smooth"

                });

            }
        );

    }


    /* =========================
       ACCOUNT DASHBOARD
    ========================= */

    const savedAccount =
        JSON.parse(
            localStorage.getItem(
                "jg_enrollment"
            ) || "null"
        );


    const accountName =
        document.getElementById(
            "accountName"
        );


    const accountEmail =
        document.getElementById(
            "accountEmail"
        );


    if (
        savedAccount &&
        accountName
    ) {

        accountName.textContent =
            "Welcome, " +
            savedAccount.name;

    }


    if (
        savedAccount &&
        accountEmail
    ) {

        accountEmail.textContent =
            savedAccount.email +
            " • " +
            savedAccount.skill;

    }

});
