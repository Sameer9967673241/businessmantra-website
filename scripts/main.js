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
        const animatedElements = document.querySelectorAll('.card, .promo-card, .hero-form-card, .glass-highlight, .hero h1, .hero p, .section-header, .footer-col');

        // Add initial styles and observe
        animatedElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(15px)';
            el.style.transition = 'opacity 0.4s ease-in-out, transform 0.4s ease-in-out';

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

    // 4. Country Code Selector Functionality
    const countryCodeBtn = document.getElementById('countryCodeBtn');
    const countryDropdown = document.getElementById('countryDropdown');
    const countrySearch = document.getElementById('countrySearch');
    const countryOptions = document.querySelectorAll('.country-option');

    if (countryCodeBtn && countryDropdown) {
        // Toggle dropdown
        countryCodeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            countryCodeBtn.classList.toggle('active');
            countryDropdown.classList.toggle('active');

            // Focus search input when dropdown opens
            if (countryDropdown.classList.contains('active')) {
                setTimeout(() => countrySearch.focus(), 100);
            }
        });

        // Select country
        countryOptions.forEach(option => {
            option.addEventListener('click', () => {
                const flag = option.dataset.flag;
                const code = option.dataset.code;

                // Update button
                countryCodeBtn.querySelector('.flag-emoji').textContent = flag;
                countryCodeBtn.querySelector('.country-code').textContent = code;

                // Remove previous selection
                countryOptions.forEach(opt => opt.classList.remove('selected'));
                // Add selection to clicked option
                option.classList.add('selected');

                // Close dropdown
                countryCodeBtn.classList.remove('active');
                countryDropdown.classList.remove('active');

                // Clear search
                if (countrySearch) {
                    countrySearch.value = '';
                    countryOptions.forEach(opt => opt.style.display = 'flex');
                }
            });
        });

        // Search functionality
        if (countrySearch) {
            countrySearch.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();

                countryOptions.forEach(option => {
                    const countryName = option.dataset.name.toLowerCase();
                    const countryCode = option.dataset.code.toLowerCase();

                    if (countryName.includes(searchTerm) || countryCode.includes(searchTerm)) {
                        option.style.display = 'flex';
                    } else {
                        option.style.display = 'none';
                    }
                });
            });

            // Prevent dropdown from closing when clicking search input
            countrySearch.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!countryCodeBtn.contains(e.target) && !countryDropdown.contains(e.target)) {
                countryCodeBtn.classList.remove('active');
                countryDropdown.classList.remove('active');
            }
        });

        // Close dropdown on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && countryDropdown.classList.contains('active')) {
                countryCodeBtn.classList.remove('active');
                countryDropdown.classList.remove('active');
            }
        });
    }

    // 6. Process Timeline Interactive
    const stepNodes = document.querySelectorAll('.step-node');
    const processTitle = document.getElementById('processTitle');
    const detailConnector = document.querySelector('.detail-connector');
    const detailBox = document.querySelector('.detail-box');
    const timelineContainer = document.querySelector('.timeline-container');

    // Process Data
    const processSteps = [
        "Step 1: Consultation – Connect with our experts to initiate your business journey.",
        "Step 2: Strategic Planning – Define your ideal jurisdiction and corporate framework.",
        "Step 3: Brand Identity – Choose a compliant trade name that resonates with your brand.",
        "Step 4: Documentation – Compile and verify all necessary legal and personal paperwork.",
        "Step 5: Registration – Submit your official application for company incorporation.",
        "Step 6: Licensing – Secure your incorporation certificate and trade permits.",
        "Step 7: Banking Setup – Establish your corporate account for seamless financial operations.",
        "Step 8: Operational Launch – Begin your commercial activities and scale your business."
    ];

    if (stepNodes.length > 0 && processTitle && timelineContainer && detailBox) {

        let activeIndex = 0;

        const updatePositions = (index) => {
            const node = stepNodes[index];

            // Get container dimensions
            const containerRect = timelineContainer.getBoundingClientRect();
            const nodeRect = node.getBoundingClientRect();

            // Calculate center of the node relative to container
            const nodeCenterRelative = nodeRect.left - containerRect.left + (nodeRect.width / 2);

            // 1. Move Connector to exact center
            if (detailConnector) {
                detailConnector.style.left = `${nodeCenterRelative}px`;
            }

            // 2. Move Box to align center with node (Clamped)
            const boxWidth = detailBox.offsetWidth;
            const containerWidth = containerRect.width;

            // Center of the container (where the box is naturally positioned by margin: 0 auto)
            const containerCenter = containerWidth / 2;

            // We want the Box Center to be at Node Center
            // But clamped so edges don't overflow container (with 15px safety margin)
            const marginSafety = 15;
            const minCenter = (boxWidth / 2) + marginSafety;
            const maxCenter = containerWidth - (boxWidth / 2) - marginSafety;

            let targetCenter = nodeCenterRelative;
            targetCenter = Math.max(minCenter, Math.min(maxCenter, targetCenter));

            // Calculate the transform needed from the default centered position
            const translateX = targetCenter - containerCenter;

            // Store targetX for animation
            detailBox.dataset.translateX = translateX;

            // Apply immediately if not animating (initial load)
            if (!detailBox.classList.contains('animating')) {
                detailBox.style.transform = `translate(${translateX}px, 0)`;
            }
        };

        stepNodes.forEach((node, index) => {
            node.addEventListener('click', () => {
                activeIndex = index;

                // Update Active State
                stepNodes.forEach(n => n.classList.remove('active'));
                node.classList.add('active');

                // Prepare Animation
                detailBox.classList.add('animating');

                // Calculate new X position first
                updatePositions(index);
                const targetX = detailBox.dataset.translateX || 0;

                // Start: Fade Out & Drop Down slightly
                detailBox.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
                detailBox.style.opacity = '0';
                detailBox.style.transform = `translate(${targetX}px, 10px)`;

                setTimeout(() => {
                    // Update Content
                    processTitle.textContent = processSteps[index];

                    // Fade In & Move Up
                    detailBox.style.opacity = '1';
                    detailBox.style.transform = `translate(${targetX}px, 0)`;

                    setTimeout(() => {
                        detailBox.classList.remove('animating');
                    }, 300);
                }, 200);
            });
        });

        // Initial Positioning on load and resize
        window.addEventListener('load', () => updatePositions(0));
        window.addEventListener('resize', () => {
            // Reset transition during resize to avoid laggy feeling
            detailBox.style.transition = 'none';
            updatePositions(activeIndex);
            const targetX = detailBox.dataset.translateX || 0;
            detailBox.style.transform = `translate(${targetX}px, 0)`;
        });
        // Run once immediately in case load already fired
        setTimeout(() => updatePositions(0), 100);
    }

    // 5. Chat Widget Toggle
    const chatWidget = document.getElementById('chatWidget');
    const chatPill = document.getElementById('chatPill');
    const closeChatBtn = document.getElementById('closeChatBtn');

    if (chatWidget && chatPill && closeChatBtn) {

        // Open Chat
        chatPill.addEventListener('click', () => {
            chatPill.classList.add('hidden');
            chatWidget.style.display = 'flex'; // Ensure it's in the DOM flow
            // Small delay to allow display flex to apply before opacity transition
            setTimeout(() => {
                chatWidget.classList.add('active');
            }, 10);
        });

        // Close/Minimize Chat
        closeChatBtn.addEventListener('click', () => {
            chatWidget.classList.remove('active');

            // Wait for transition to finish before hiding pill
            setTimeout(() => {
                chatWidget.style.display = 'none';
                chatPill.classList.remove('hidden');
            }, 400); // Matches CSS transition duration
        });
    }

    // 7. Generic Modal Logic
    const openModalBtns = document.querySelectorAll('.open-modal-btn');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const modals = document.querySelectorAll('.modal');

    if (openModalBtns.length > 0) {
        openModalBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = btn.getAttribute('data-modal');
                const modal = document.getElementById(modalId);
                if (modal) {
                    modal.classList.add('show');
                    document.body.style.overflow = 'hidden'; // Prevent background scrolling
                }
            });
        });

        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = btn.closest('.modal');
                modal.classList.remove('show');
                document.body.style.overflow = '';
            });
        });

        // Close when clicking outside content
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('show');
                document.body.style.overflow = '';
            }
        });

        // Close on Escape key
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                modals.forEach(modal => {
                    if (modal.classList.contains('show')) {
                        modal.classList.remove('show');
                        document.body.style.overflow = '';
                    }
                });
            }
        });
    }
});
