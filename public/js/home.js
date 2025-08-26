   // Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.getElementById('mobile-menu');
    const mobileNav = document.getElementById('mobile-nav');
    const body = document.body;
    
    mobileMenuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        mobileNav.classList.toggle('active');
        body.classList.toggle('menu-open'); // this makes CSS work
    });

    // Close when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('#mobile-menu') && !e.target.closest('#mobile-nav')) {
            mobileNav.classList.remove('active');
            body.classList.remove('menu-open');
        }
    });
});


        // FAQ accordion functionality - IMPROVED
        const faqItems = document.querySelectorAll('.faq-item');

        // Open first FAQ by default
        if (faqItems.length > 0) {
            faqItems[0].classList.add('active');
        }

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');

            question.addEventListener('click', () => {
                // Close other open items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });

                // Toggle current item
                item.classList.toggle('active');
            });
        });

        // Auto-scroll market ticker on hover - FIXED
        const ticker = document.querySelector('.ticker-content');

        ticker.addEventListener('mouseenter', function () {
            this.style.animationPlayState = 'paused';
        });

        ticker.addEventListener('mouseleave', function () {
            this.style.animationPlayState = 'running';
        });

        // Fix for ticker animation - reset position when animation completes
        ticker.addEventListener('animationiteration', () => {
            // Reset to initial position when animation completes a cycle
            if (ticker.style.animationPlayState !== 'paused') {
                ticker.style.transition = 'none';
                ticker.style.transform = 'translateX(0)';

                // Force reflow
                void ticker.offsetWidth;

                ticker.style.transition = '';
            }
        });

        // Animate elements on scroll
        const animateOnScroll = function () {
            const elements = document.querySelectorAll('.feature-card, .pair-card, .testimonial-card, .stat-item');

            elements.forEach(element => {
                const elementPosition = element.getBoundingClientRect().top;
                const screenPosition = window.innerHeight / 1.3;

                if (elementPosition < screenPosition) {
                    element.style.opacity = 1;
                    element.style.transform = 'translateY(0)';
                }
            });
        };

        // Initialize elements for animation
        window.addEventListener('DOMContentLoaded', function () {
            const elements = document.querySelectorAll('.feature-card, .pair-card, .testimonial-card, .stat-item');

            elements.forEach(element => {
                element.style.opacity = 0;
                element.style.transform = 'translateY(20px)';
                element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            });

            window.addEventListener('scroll', animateOnScroll);
            // Trigger once on load in case elements are already in view
            animateOnScroll();
        });