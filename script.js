/* =========================================================
   AGBALA ADURA - COMPLETE JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const header = document.getElementById("siteHeader");
    const menuButton = document.getElementById("mobileMenuButton");
    const mobileNav = document.getElementById("mobileNav");

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    /* =====================================================
       HEADER SCROLL EFFECT
    ===================================================== */

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

    if (menuButton && mobileNav) {

        const closeMobileMenu = () => {

            mobileNav.classList.remove("active");

            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );

            menuButton.setAttribute(
                "aria-label",
                "Open menu"
            );

        };


        const openMobileMenu = () => {

            mobileNav.classList.add("active");

            menuButton.setAttribute(
                "aria-expanded",
                "true"
            );

            menuButton.setAttribute(
                "aria-label",
                "Close menu"
            );

        };


        menuButton.addEventListener("click", () => {

            const isOpen =
                mobileNav.classList.contains("active");

            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }

        });


        mobileNav
            .querySelectorAll("a")
            .forEach(link => {

                link.addEventListener(
                    "click",
                    closeMobileMenu
                );

            });


        window.addEventListener("resize", () => {

            if (window.innerWidth > 800) {
                closeMobileMenu();
            }

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

                        if (
                            entry.isIntersecting &&
                            !entry.target.classList.contains("visible")
                        ) {

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
                    rootMargin: "0px 0px -40px 0px"
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

        const cards = Array.from(
            carousel.querySelectorAll(".special-card")
        );

        const currentDisplay =
            document.getElementById("specialCurrent");

        let currentIndex = 0;
        let isAnimating = false;


        const updateCarousel = index => {

            if (
                isAnimating ||
                index < 0 ||
                index >= cards.length ||
                index === currentIndex
            ) {
                return;
            }

            isAnimating = true;

            currentIndex = index;

            cards.forEach((card, cardIndex) => {

                const position =
                    (
                        cardIndex -
                        currentIndex +
                        cards.length
                    ) % cards.length;


                card.classList.toggle(
                    "active",
                    position === 0
                );


                card.setAttribute(
                    "data-pos",
                    String(position)
                );


                card.setAttribute(
                    "aria-current",
                    position === 0
                        ? "true"
                        : "false"
                );

            });


            if (currentDisplay) {

                currentDisplay.textContent =
                    String(currentIndex + 1).padStart(2, "0");

            }


            window.setTimeout(() => {

                isAnimating = false;

            }, prefersReducedMotion ? 0 : 450);

        };


        const showNextCard = () => {

            const nextIndex =
                (currentIndex + 1) % cards.length;

            updateCarousel(nextIndex);

        };


        cards.forEach((card, index) => {

            card.setAttribute(
                "role",
                "button"
            );

            card.setAttribute(
                "tabindex",
                "0"
            );

            card.setAttribute(
                "aria-label",
                `Show special programme ${index + 1}`
            );

            card.setAttribute(
                "aria-controls",
                "specialCarousel"
            );


            card.addEventListener("click", () => {

                if (index !== currentIndex) {
                    updateCarousel(index);
                } else {
                    showNextCard();
                }

            });


            card.addEventListener("keydown", event => {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    if (index !== currentIndex) {
                        updateCarousel(index);
                    } else {
                        showNextCard();
                    }

                }

            });

        });


        /*
            Initial carousel state
        */

        cards.forEach((card, index) => {

            const position =
                (
                    index -
                    currentIndex +
                    cards.length
                ) % cards.length;


            card.classList.toggle(
                "active",
                position === 0
            );


            card.setAttribute(
                "data-pos",
                String(position)
            );


            card.setAttribute(
                "aria-current",
                position === 0
                    ? "true"
                    : "false"
            );

        });


        if (currentDisplay) {
            currentDisplay.textContent = "01";
        }

    }


    /* =====================================================
       ACTIVE NAVIGATION SECTION
    ===================================================== */

    const navigationLinks =
        document.querySelectorAll(
            '.desktop-nav a[href^="#"], .mobile-nav a[href^="#"]'
        );

    const sections =
        document.querySelectorAll("section[id]");


    const setActiveNavigation = sectionId => {

        navigationLinks.forEach(link => {

            const linkTarget =
                link.getAttribute("href");

            const isActive =
                linkTarget === `#${sectionId}`;

            link.classList.toggle(
                "active",
                isActive
            );

            if (isActive) {

                link.setAttribute(
                    "aria-current",
                    "page"
                );

            } else {

                link.removeAttribute(
                    "aria-current"
                );

            }

        });

    };


    /*
        Update the active navigation item according
        to the section currently closest to the top.
    */

    const updateActiveNavigation = () => {

        const headerHeight =
            header
                ? header.offsetHeight
                : 0;

        const scrollPosition =
            window.scrollY + headerHeight + 80;

        let currentSectionId = "";

        sections.forEach(section => {

            if (section.offsetTop <= scrollPosition) {

                currentSectionId =
                    section.getAttribute("id");

            }

        });


        if (currentSectionId) {
            setActiveNavigation(currentSectionId);
        }

    };


    if (
        navigationLinks.length > 0 &&
        sections.length > 0
    ) {

        updateActiveNavigation();

        window.addEventListener(
            "scroll",
            updateActiveNavigation,
            { passive: true }
        );

    }


    /* =====================================================
       COPYRIGHT YEAR
    ===================================================== */

    const year =
        document.getElementById("currentYear");

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

            link.addEventListener("click", event => {

                const targetId =
                    link.getAttribute("href");


                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }


                const target =
                    document.querySelector(targetId);


                if (!target) {
                    return;
                }


                event.preventDefault();


                const headerElement =
                    document.querySelector(".site-header");


                const headerHeight =
                    headerElement
                        ? headerElement.offsetHeight
                        : 0;


                const targetTop =
                    Math.max(
                        0,
                        target.getBoundingClientRect().top +
                        window.scrollY -
                        headerHeight -
                        12
                    );


                window.scrollTo({

                    top: targetTop,

                    behavior: prefersReducedMotion
                        ? "auto"
                        : "smooth"

                });


                const sectionId =
                    target.getAttribute("id");

                if (sectionId) {
                    setActiveNavigation(sectionId);
                }

            });

        });


    /* =====================================================
       ESCAPE KEY CLOSES MOBILE MENU
    ===================================================== */

    document.addEventListener("keydown", event => {

        if (
            event.key === "Escape" &&
            mobileNav &&
            mobileNav.classList.contains("active")
        ) {

            mobileNav.classList.remove("active");

            if (menuButton) {

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuButton.setAttribute(
                    "aria-label",
                    "Open menu"
                );

            }

        }

    });

});