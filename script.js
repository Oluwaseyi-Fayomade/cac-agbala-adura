/* =========================================================
   AGBALA ADURA - COMPLETE JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       HEADER SCROLL EFFECT
    ===================================================== */

    const header = document.getElementById("siteHeader");

    if (header) {

        const updateHeader = () => {
            header.classList.toggle(
                "scrolled",
                window.scrollY > 30
            );
        };

        updateHeader();

        window.addEventListener(
            "scroll",
            updateHeader,
            { passive: true }
        );
    }


    /* =====================================================
       MOBILE NAVIGATION
    ===================================================== */

    const menuButton =
        document.getElementById("mobileMenuButton");

    const mobileNav =
        document.getElementById("mobileNav");

    if (menuButton && mobileNav) {

        menuButton.addEventListener("click", () => {

            const isOpen =
                mobileNav.classList.toggle("active");

            menuButton.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );

            menuButton.setAttribute(
                "aria-label",
                isOpen ? "Close menu" : "Open menu"
            );

        });


        mobileNav
            .querySelectorAll("a")
            .forEach(link => {

                link.addEventListener("click", () => {

                    mobileNav.classList.remove("active");

                    menuButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                    menuButton.setAttribute(
                        "aria-label",
                        "Open menu"
                    );

                });

            });

    }


    /* =====================================================
       SCROLL REVEAL ANIMATION
    ===================================================== */

    const revealElements =
        document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {

        const revealObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add(
                                "visible"
                            );

                            revealObserver.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.12,
                    rootMargin:
                        "0px 0px -30px 0px"
                }
            );


        revealElements.forEach(element => {

            revealObserver.observe(element);

        });

    } else {

        revealElements.forEach(element => {

            element.classList.add("visible");

        });

    }


    /* =====================================================
       SPECIAL PROGRAMMES CAROUSEL
    ===================================================== */

    const carousel =
        document.getElementById("specialCarousel");

    if (carousel) {

        const cards =
            Array.from(
                carousel.querySelectorAll(
                    ".special-card"
                )
            );

        const currentDisplay =
            document.getElementById(
                "specialCurrent"
            );

        let currentIndex = 0;


        function updateCarousel() {

            cards.forEach((card, index) => {

                card.classList.remove("active");

                card.removeAttribute("data-pos");


                const position =
                    (
                        index -
                        currentIndex +
                        cards.length
                    ) % cards.length;


                if (position === 0) {

                    card.classList.add("active");

                } else {

                    card.setAttribute(
                        "data-pos",
                        position
                    );

                }

            });


            if (currentDisplay) {

                currentDisplay.textContent =
                    String(
                        currentIndex + 1
                    ).padStart(2, "0");

            }

        }


        cards.forEach(card => {

            card.addEventListener(
                "click",
                () => {

                    currentIndex =
                        (
                            currentIndex + 1
                        ) % cards.length;

                    updateCarousel();

                }
            );

        });


        updateCarousel();

    }


    /* =====================================================
       COPYRIGHT YEAR
    ===================================================== */

    const year =
        document.getElementById(
            "currentYear"
        );

    if (year) {

        year.textContent =
            new Date().getFullYear();

    }


    /* =====================================================
       SMOOTH ANCHOR NAVIGATION
    ===================================================== */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach(link => {

            link.addEventListener(
                "click",
                event => {

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


                    if (!target) {
                        return;
                    }


                    event.preventDefault();


                    const headerElement =
                        document.querySelector(
                            ".site-header"
                        );


                    const headerHeight =
                        headerElement
                            ? headerElement.offsetHeight
                            : 0;


                    const targetTop =
                        target.getBoundingClientRect()
                            .top +
                        window.scrollY -
                        headerHeight;


                    window.scrollTo({
                        top: targetTop,
                        behavior: "smooth"
                    });

                }
            );

        });

});