/* Small, dependency-free interactions for the single-page church site. */

document.body.classList.add("js-enabled");

document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById("siteHeader");
    const menuButton = document.getElementById("mobileMenuButton");
    const mobileNav = document.getElementById("mobileNav");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const closeMobileMenu = ({ restoreFocus = false } = {}) => {
        if (!menuButton || !mobileNav) return;
        mobileNav.classList.remove("active");
        mobileNav.inert = true;
        mobileNav.setAttribute("aria-hidden", "true");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open menu");
        if (restoreFocus) menuButton.focus();
    };

    if (menuButton && mobileNav) {
        closeMobileMenu();

        menuButton.addEventListener("click", () => {
            if (mobileNav.classList.contains("active")) {
                closeMobileMenu({ restoreFocus: true });
                return;
            }

            mobileNav.inert = false;
            mobileNav.setAttribute("aria-hidden", "false");
            mobileNav.classList.add("active");
            menuButton.setAttribute("aria-expanded", "true");
            menuButton.setAttribute("aria-label", "Close menu");
            mobileNav.querySelector("a")?.focus({ preventScroll: true });
        });

        mobileNav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => closeMobileMenu());
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 960) closeMobileMenu();
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape" && mobileNav.classList.contains("active")) {
                closeMobileMenu({ restoreFocus: true });
            }
        });
    }

    const reveals = document.querySelectorAll(".reveal");
    if (reduceMotion.matches || !("IntersectionObserver" in window)) {
        reveals.forEach(element => element.classList.add("visible"));
    } else {
        const revealObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

        reveals.forEach(element => revealObserver.observe(element));
    }

    const carousel = document.getElementById("specialCarousel");
    if (carousel) {
        const cards = [...carousel.querySelectorAll(".special-card")];
        const currentDisplay = document.getElementById("specialCurrent");
        const announcement = document.getElementById("specialAnnouncement");
        const previousButton = document.getElementById("specialPrevious");
        const nextButton = document.getElementById("specialNext");
        let currentIndex = Math.max(0, cards.findIndex(card => card.classList.contains("active")));

        const showProgramme = (index, announce = true) => {
            if (!cards.length) return;
            currentIndex = (index + cards.length) % cards.length;

            cards.forEach((card, cardIndex) => {
                const position = (cardIndex - currentIndex + cards.length) % cards.length;
                const active = position === 0;
                card.classList.toggle("active", active);
                card.inert = !active;
                card.setAttribute("aria-hidden", String(!active));
                card.setAttribute("aria-current", String(active));
                card.removeAttribute("aria-pressed");
                card.setAttribute("aria-label", `Show programme: ${card.dataset.title || `programme ${cardIndex + 1}`}`);
                card.dataset.pos = String(position);
            });

            const title = cards[currentIndex].dataset.title || `Programme ${currentIndex + 1}`;
            if (currentDisplay) currentDisplay.textContent = String(currentIndex + 1).padStart(2, "0");
            if (announcement && announce) {
                announcement.textContent = `${title}, programme ${currentIndex + 1} of ${cards.length}`;
            }
        };

        cards.forEach((card, index) => {
            card.addEventListener("click", () => showProgramme(index));
        });
        previousButton?.addEventListener("click", () => showProgramme(currentIndex - 1));
        nextButton?.addEventListener("click", () => showProgramme(currentIndex + 1));
        showProgramme(currentIndex, false);
    }

    const year = document.getElementById("currentYear");
    if (year) year.textContent = String(new Date().getFullYear());

    const navLinks = [...document.querySelectorAll('.desktop-nav a[data-section], .mobile-nav a[data-section]')];
    const navTargets = [...document.querySelectorAll('.desktop-nav a[data-section]')]
        .map(link => document.getElementById(link.dataset.section))
        .filter(Boolean);
    const hero = document.querySelector(".hero");
    const heroImage = document.querySelector(".hero-image");
    const liveSection = document.querySelector(".live");
    const liveBackground = document.querySelector(".live-bg");
    let scrollFrame = 0;

    const updateScrollEffects = () => {
        scrollFrame = 0;
        const scrollY = window.scrollY;

        header?.classList.toggle("scrolled", scrollY > 30);

        const navPosition = scrollY + (header?.offsetHeight || 0) + 88;
        let activeId = "";
        navTargets.forEach(target => {
            if (target.offsetTop <= navPosition) activeId = target.id;
        });
        navLinks.forEach(link => {
            const active = link.dataset.section === activeId;
            link.classList.toggle("active", active);
            if (active) link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
        });

        if (reduceMotion.matches) {
            if (heroImage) heroImage.style.transform = "none";
            if (liveBackground) liveBackground.style.transform = "none";
            return;
        }

        if (hero && heroImage && scrollY < hero.offsetHeight) {
            heroImage.style.transform = `translate3d(0, ${-Math.min(scrollY * 0.12, 100)}px, 0) scale(1.04)`;
        }

        if (liveSection && liveBackground) {
            const rect = liveSection.getBoundingClientRect();
            if (rect.bottom > 0 && rect.top < window.innerHeight) {
                const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                liveBackground.style.transform = `translate3d(0, ${(progress - 0.5) * 80}px, 0)`;
            }
        }
    };

    const scheduleScrollEffects = () => {
        if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScrollEffects);
    };

    scheduleScrollEffects();
    window.addEventListener("scroll", scheduleScrollEffects, { passive: true });
    window.addEventListener("resize", scheduleScrollEffects, { passive: true });
    window.addEventListener("hashchange", scheduleScrollEffects);
    reduceMotion.addEventListener?.("change", scheduleScrollEffects);
});
