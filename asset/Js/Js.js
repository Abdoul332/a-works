
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            const navbar = document.getElementById('navbar');
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.section-header, .service-card, .value-card, .process-step').forEach(el => {
            observer.observe(el);
        });

        // Special observers for different directions
        const leftObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in-left');
                }
            });
        }, observerOptions);

        const rightObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in-right');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.about-text').forEach(el => {
            leftObserver.observe(el);
        });

        document.querySelectorAll('.about-visual').forEach(el => {
            rightObserver.observe(el);
        });

        // Testimonial slider
        let currentTestimonial = 0;
        const testimonials = document.querySelectorAll('.testimonial-item');
        const dots = document.querySelectorAll('.nav-dot');

        function showTestimonial(index) {
            testimonials.forEach((testimonial, i) => {
                testimonial.classList.toggle('active', i === index);
            });
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }

        function nextTestimonial() {
            currentTestimonial = (currentTestimonial +1) % testimonials.length;
            showTestimonial(currentTestimonial);
        }

        // Auto-advance testimonials
        setInterval(nextTestimonial, 6000);

        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentTestimonial = index;
                showTestimonial(currentTestimonial);
            });
        });

        // Service card hover effects
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });

        // Parallax effect for hero section
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        });

        // Add loading animation
        window.addEventListener('load', () => {
            document.body.style.opacity = '1';
        });

        // Mobile menu toggle
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navMenu = document.querySelector('.nav-menu');

        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });

        // Performance optimization: Lazy load images
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }

        // Add subtle animations to stats
        const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('.stat-number');
            if (statNumber) {
                const finalValue = statNumber.textContent;
                let currentValue = 0;
                const increment = 1; // tu peux ajuster la vitesse ici

                const timer = setInterval(() => {
                    currentValue += increment;

                    if (finalValue.includes('%')) {
                        statNumber.textContent = currentValue + '%';
                        if (currentValue >= parseInt(finalValue)) {
                            clearInterval(timer);
                            statNumber.textContent = finalValue;
                        }
                    } else if (finalValue.includes('+')) {
                        statNumber.textContent = currentValue + '+';
                        if (currentValue >= parseInt(finalValue)) {
                            clearInterval(timer);
                            statNumber.textContent = finalValue;
                        }
                    } else {
                        statNumber.textContent = currentValue;
                        if (currentValue >= parseInt(finalValue)) {
                            clearInterval(timer);
                            statNumber.textContent = finalValue;
                        }
                    }
                }, 50);

                // 🔥 très important : on arrête d'observer cet élément
                observer.unobserve(entry.target);
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-card').forEach(card => {
    statsObserver.observe(card);
});
// Gestion de la bannière cookies
        document.addEventListener('DOMContentLoaded', function() {
            const cookieBanner = document.getElementById('cookie-banner');
            const acceptButton = document.getElementById('accept-cookies');
            const declineButton = document.getElementById('decline-cookies');
            
            // Clés pour le localStorage
            const COOKIE_CONSENT_KEY = 'cookie-consent';
            const COOKIE_CONSENT_DATE_KEY = 'cookie-consent-date';
            
            // Vérifier si l'utilisateur a déjà donné son consentement
            function checkCookieConsent() {
                const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
                const consentDate = localStorage.getItem(COOKIE_CONSENT_DATE_KEY);
                
                // Si pas de consentement ou consentement expiré (plus de 13 mois)
                if (!consent || !consentDate) {
                    showCookieBanner();
                    return;
                }
                
                const consentTimestamp = parseInt(consentDate);
                const currentTimestamp = Date.now();
                const thirteenMonthsInMs = 13 * 30 * 24 * 60 * 60 * 1000; // 13 mois approximatifs
                
                if (currentTimestamp - consentTimestamp > thirteenMonthsInMs) {
                    // Consentement expiré, supprimer les données et redemander
                    localStorage.removeItem(COOKIE_CONSENT_KEY);
                    localStorage.removeItem(COOKIE_CONSENT_DATE_KEY);
                    showCookieBanner();
                }
            }
            
            // Afficher la bannière cookies
            function showCookieBanner() {
                if (cookieBanner) {
                    // Petit délai pour une meilleure UX
                    setTimeout(() => {
                        cookieBanner.classList.add('show');
                    }, 1000);
                }
            }
            
            // Masquer la bannière cookies
            function hideCookieBanner() {
                if (cookieBanner) {
                    cookieBanner.classList.remove('show');
                    // Supprimer complètement l'élément après l'animation
                    setTimeout(() => {
                        cookieBanner.style.display = 'none';
                    }, 300);
                }
            }
            
            // Sauvegarder le consentement
            function saveConsent(accepted) {
                const timestamp = Date.now().toString();
                localStorage.setItem(COOKIE_CONSENT_KEY, accepted ? 'accepted' : 'declined');
                localStorage.setItem(COOKIE_CONSENT_DATE_KEY, timestamp);
                
                // Déclencher un événement personnalisé pour informer d'autres scripts
                const consentEvent = new CustomEvent('cookieConsentChanged', {
                    detail: {
                        consent: accepted ? 'accepted' : 'declined',
                        timestamp: timestamp
                    }
                });
                document.dispatchEvent(consentEvent);
            }
            
            // Gestionnaire pour accepter les cookies
            if (acceptButton) {
                acceptButton.addEventListener('click', function() {
                    saveConsent(true);
                    hideCookieBanner();
                    enableCookies();
                });
            }
            
            // Gestionnaire pour refuser les cookies
            if (declineButton) {
                declineButton.addEventListener('click', function() {
                    saveConsent(false);
                    hideCookieBanner();
                    disableCookies();
                });
            }
            
            // Fonction pour activer les cookies
            function enableCookies() {
                console.log('Cookies acceptés - Activation des services analytics');
                // Ici vous pouvez ajouter votre code Google Analytics ou autres services
            }
            
            // Fonction pour désactiver les cookies
            function disableCookies() {
                console.log('Cookies refusés - Désactivation des services analytics');
                clearNonEssentialCookies();
            }
            
            // Fonction pour supprimer les cookies non essentiels
            function clearNonEssentialCookies() {
                const essentialCookies = ['cookie-consent', 'cookie-consent-date'];
                const cookies = document.cookie.split(';');
                
                cookies.forEach(cookie => {
                    const name = cookie.split('=')[0].trim();
                    if (!essentialCookies.includes(name)) {
                        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                    }
                });
            }
            
            // Initialisation : vérifier le consentement au chargement de la page
            checkCookieConsent();
        });

        // Script pour la navigation (si nécessaire, à adapter ou supprimer si déjà présent)
        document.addEventListener('DOMContentLoaded', function() {
            const navbar = document.getElementById('navbar');
            if (navbar) {
                window.addEventListener('scroll', function() {
                    if (window.scrollY > 50) {
                        navbar.classList.add('scrolled');
                    } else {
                        navbar.classList.remove('scrolled');
                    }
                });
            }
        });
    