 // Mobile Menu Toggle
        const menuToggle = document.querySelector('.menu-toggle');
        const nav = document.querySelector('nav');
        
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
        });

        // Close mobile menu when clicking on a nav link
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Sticky Header
        const header = document.getElementById('header');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll <= 0) {
                header.classList.remove('header-scrolled');
                return;
            }
            
            if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
                // Scroll Down
                header.classList.remove('header-scrolled');
                header.classList.add('scroll-down');
            } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
                // Scroll Up
                header.classList.add('header-scrolled');
                header.classList.remove('scroll-down');
            }
            
            lastScroll = currentScroll;
        });

        // Show Sticky CTA on scroll
        const stickyCta = document.getElementById('sticky-cta');
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                stickyCta.classList.add('visible');
            } else {
                stickyCta.classList.remove('visible');
            }
        });

        // Smooth Scrolling for Anchor Links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Cookie Consent
        const cookieConsent = document.getElementById('cookie-consent');
        const acceptCookiesBtn = document.getElementById('accept-cookies');
        const declineCookiesBtn = document.getElementById('decline-cookies');

        // Check if user has already made a choice
        if (!localStorage.getItem('cookieConsent')) {
            // Show cookie consent after page loads
            setTimeout(() => {
                cookieConsent.classList.add('visible');
            }, 2000);
        }

        // Handle accept cookies
        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieConsent.classList.remove('visible');
            // Add your analytics/tracking code here
        });

        // Handle decline cookies
        declineCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieConsent.classList.remove('visible');
        });

        // WhatsApp Button
        document.getElementById('whatsapp-btn').addEventListener('click', function(e) {
            e.preventDefault();
            const phoneNumber = '33612345678'; // Replace with your WhatsApp number
            const message = 'Bonjour Lucrèce, je suis intéressé(e) par un accompagnement. Pourrions-nous échanger ?';
            window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
        });

        // Animate elements on scroll
        const animateOnScroll = () => {
            // Animate cards
            const elements = document.querySelectorAll('.problem-card, .step, .offer-card, .testimonial-card');
            elements.forEach(element => {
                const elementPosition = element.getBoundingClientRect().top;
                const screenPosition = window.innerHeight / 1.3;
                
                if (elementPosition < screenPosition) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            });

            // Animate stats counters
            const statsSection = document.querySelector('.stats');
            if (statsSection) {
                const statsPosition = statsSection.getBoundingClientRect().top;
                const statsScreenPosition = window.innerHeight / 1.3;
                
                if (statsPosition < statsScreenPosition) {
                    animateStats();
                    // Remove the scroll event listener after animation triggers once
                    window.removeEventListener('scroll', animateOnScroll);
                }
            }
        };

        // Set initial styles for animation
        document.addEventListener('DOMContentLoaded', () => {
            const elements = document.querySelectorAll('.problem-card, .step, .offer-card, .testimonial-card');
            elements.forEach(element => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            });

            // Trigger animation on load for elements in viewport
            setTimeout(animateOnScroll, 300);
        });

        // Animate on scroll
        window.addEventListener('scroll', animateOnScroll);

                // Animate stats counters
        function animateStats() {
            const statItems = document.querySelectorAll('.stat-item');
            
            statItems.forEach((item, index) => {
                // Add animation class to item
                setTimeout(() => {
                    item.classList.add('animated');
                    
                    // Animate the counter
                    const numberElement = item.querySelector('.stat-number');
                    if (numberElement) {
                        const target = numberElement.textContent;
                        const isPercentage = target.includes('%');
                        const isYear = target.includes('ans');
                        let value = parseFloat(target.replace(/[^0-9.-]+/g, ''));
                        
                        // Handle different counter types
                        if (isPercentage) {
                            animateCounter(numberElement, 0, value, 2000, '%');
                        } else if (isYear) {
                            animateCounter(numberElement, 0, value, 2000, ' ans');
                        } else if (target.startsWith('+')) {
                            animateCounter(numberElement, 0, value, 2000, '+', true);
                        } else {
                            animateCounter(numberElement, 0, value, 2000);
                        }
                    }
                }, 200 * index);
            });
        }
        
        // Counter animation function
        function animateCounter(element, start, end, duration, suffix = '', isPlusPrefix = false) {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                const current = Math.floor(progress * (end - start) + start);
                
                // Apply easing function for smoother animation
                const easeInOutQuad = t => t<.5 ? 2*t*t : -1+(4-2*t)*t;
                const easedProgress = easeInOutQuad(progress);
                const easedValue = Math.floor(easedProgress * (end - start) + start);
                
                // Update the element with the current value
                if (isPlusPrefix && easedValue > 0) {
                    element.textContent = `+${easedValue.toLocaleString()}${suffix}`;
                } else {
                    element.textContent = `${easedValue.toLocaleString()}${suffix}`;
                }
                
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        }

        // Form submission
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                // Add your form submission logic here
                alert('Merci pour votre message ! Je vous recontacte très rapidement.');
                this.reset();
            });
        }