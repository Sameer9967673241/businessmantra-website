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

    // 4. Cost Calculator Modal Logic (Event Delegation Version)
    // Attach listener to document to catch clicks regardless of element timing
    document.addEventListener('click', (e) => {
        // Handle Open Button
        if (e.target && (e.target.id === 'openCalculator' || e.target.closest('#openCalculator'))) {
            e.preventDefault();
            const modal = document.getElementById('calculatorModal');
            if (modal) {
                modal.classList.add('show');
                if (typeof window.calculateCost === 'function') window.calculateCost();
            } else {
                console.error("Calculator modal not found in DOM");
            }
        }

        // Handle Close Button
        if (e.target && e.target.classList.contains('close-modal')) {
            const modal = document.getElementById('calculatorModal');
            if (modal) modal.classList.remove('show');
        }

        // Handle Outside Click
        if (e.target && e.target.classList.contains('modal')) {
            e.target.classList.remove('show');
        }
    });

    // Make calculation logic accessible globally
    window.calculateCost = function () {
        const calcType = document.getElementById('calcType');
        const calcVisas = document.getElementById('calcVisas');
        const calcOffice = document.getElementById('calcOffice');
        const totalEl = document.getElementById('totalCost');

        if (!calcType || !calcVisas || !calcOffice || !totalEl) return;

        const basePrice = parseInt(calcType.value) || 0;
        const visaCount = parseInt(calcVisas.value) || 0;
        const officePrice = parseInt(calcOffice.value) || 0;

        const visaCost = visaCount * 3500;
        const total = basePrice + visaCost + officePrice;

        totalEl.innerText = 'AED ' + total.toLocaleString();
    };

    // Attach listeners
    // We try to attach immediately, and also set an interval to check for the elements
    // This is because sometimes the browser might take a moment to render content pushed near end of body
    function attachCalcListeners() {
        const inputs = ['calcType', 'calcVisas', 'calcOffice'];
        let attachedCount = 0;
        inputs.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                // Remove before add to prevent duplicates (although addEventListener handles unique)
                el.removeEventListener('input', window.calculateCost);
                el.removeEventListener('change', window.calculateCost);

                el.addEventListener('input', window.calculateCost);
                el.addEventListener('change', window.calculateCost);
                attachedCount++;
            }
        });
        return attachedCount === inputs.length;
    }

    // Attempt verify attach
    if (!attachCalcListeners()) {
        setTimeout(attachCalcListeners, 1000); // Retry
    }
});
