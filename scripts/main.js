/* Main JS - Premium Interactions */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileToggle.querySelector('i').classList.remove('fa-times');
                mobileToggle.querySelector('i').classList.add('fa-bars');
            });
        });
    }

    // 2. Transparent-to-Solid Navbar Transition
    const header = document.querySelector('.header');

    function updateHeader() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // Check on load and scroll
    window.addEventListener('scroll', updateHeader);
    updateHeader();


    // 3. Scroll Reveal Animations
    // Only run if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Only animate once
                }
            });
        }, observerOptions);

        // Elements to animate
        const animatedElements = document.querySelectorAll('.card, .hero h1, .hero p, .section-header, .footer-col');

        // Add initial styles and observe
        animatedElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';

            // Stagger delay for grids
            if (el.classList.contains('card')) {
                // Approximate staggering based on DOM order vs visual order isn't perfect but helps
                // This is a simple delay
                el.style.transitionDelay = '0.1s';
            }

            observer.observe(el);
        });

        // Add 'visible' class triggers CSS transition
        // We'll add a global style for .visible in JS to avoid cluttering CSS files just for this
        const style = document.createElement('style');
        style.innerHTML = `
            .visible {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }
});
