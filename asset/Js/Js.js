document.addEventListener('DOMContentLoaded', function() {

    // ----------- MENU HAMBURGER MOBILE -----------
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link, .nav-cta');
    
    if (mobileMenuBtn && navMenu) {
        // Toggle du menu
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenuBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Empêche le scroll du body quand le menu est ouvert
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Ferme le menu quand on clique sur un lien
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuBtn.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Ferme le menu si on redimensionne vers desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                mobileMenuBtn.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Ferme le menu si on clique en dehors
        document.addEventListener('click', function(e) {
            if (!mobileMenuBtn.contains(e.target) && !navMenu.contains(e.target)) {
                mobileMenuBtn.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ----------- SMOOTH SCROLL -----------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerOffset = 80;
                const top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ----------- NAVBAR SCROLL EFFECT (PERFORMANT) -----------
    const navbar = document.getElementById('navbar');
    if (navbar) {
        const updateNavbar = () => {
            if (window.scrollY > 100) navbar.classList.add('scrolled');
            else navbar.classList.remove('scrolled');
        };
        window.addEventListener('scroll', () => requestAnimationFrame(updateNavbar), { passive: true });
        updateNavbar(); // Appel initial
    }

    // ----------- INTERSECTION OBSERVER ANIMATIONS -----------
    if ('IntersectionObserver' in window) {
        const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
        const animateObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target); // Optimisation : arrêter d'observer une fois l'animation lancée
                }
            });
        }, observerOptions);

        document.querySelectorAll('.section-header, .service-card, .value-card, .process-step').forEach(el => animateObserver.observe(el));
        
        // Observers directionnels
        const directionalObserver = (selector, className) => {
            const obs = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(className);
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);
            document.querySelectorAll(selector).forEach(el => obs.observe(el));
        };
        directionalObserver('.about-text', 'animate-in-left');
        directionalObserver('.about-visual', 'animate-in-right');
    }

    // ----------- TESTIMONIAL SLIDER (SÉCURISÉ) -----------
    const testimonials = Array.from(document.querySelectorAll('.testimonial-item'));
    const dots = Array.from(document.querySelectorAll('.nav-dot'));
    if (testimonials.length > 0 && dots.length === testimonials.length) {
        let currentTestimonial = 0;
        let testimonialInterval;

        const showTestimonial = (index) => {
            testimonials.forEach((t, i) => t.classList.toggle('active', i === index));
            dots.forEach((d, i) => d.classList.toggle('active', i === index));
        };
        const nextTestimonial = () => {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        };
        const startSlider = () => {
            stopSlider(); // Évite les intervalles multiples
            testimonialInterval = setInterval(nextTestimonial, 6000);
        };
        const stopSlider = () => clearInterval(testimonialInterval);

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                currentTestimonial = i;
                showTestimonial(i);
                startSlider(); // Redémarre le timer après un clic manuel
            });
        });
        testimonials.forEach(t => {
            t.addEventListener('mouseenter', stopSlider);
            t.addEventListener('mouseleave', startSlider);
        });

        showTestimonial(0);
        startSlider();
    }

    // ----------- PARALLAX HERO (PERFORMANT) -----------
    const hero = document.querySelector('.hero');
    if (hero && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const parallaxHero = () => {
            hero.style.transform = `translateY(${window.scrollY * 0.5}px)`;
        };
        window.addEventListener('scroll', () => requestAnimationFrame(parallaxHero), { passive: true });
        parallaxHero(); // Appel initial
    }

    // ----------- LAZY LOAD IMAGES (AVEC SRCSET) -----------
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) img.src = img.dataset.src;
                    if (img.dataset.srcset) img.srcset = img.dataset.srcset; // Support du srcset
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        document.querySelectorAll('img[data-src], img[data-srcset]').forEach(img => imageObserver.observe(img));
    }

    // ----------- STAT ANIMATION (ROBUSTE) -----------
    if ('IntersectionObserver' in window) {
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statNumber = entry.target.querySelector('.stat-number');
                    if (!statNumber) return;

                    const finalValueText = statNumber.textContent.trim();
                    const target = parseInt(finalValueText, 10);
                    if (isNaN(target)) { observer.unobserve(entry.target); return; }

                    let current = 0;
                    // Calcul dynamique de l'incrément pour une animation fluide
                    const step = Math.max(1, Math.ceil(target / 100)); 
                    const timer = setInterval(() => {
                        current = Math.min(current + step, target);
                        statNumber.textContent = current + (finalValueText.includes('%') ? '%' : finalValueText.includes('+') ? '+' : '');
                        if (current >= target) {
                            clearInterval(timer);
                            statNumber.textContent = finalValueText; // Assure la valeur finale exacte
                        }
                    }, 20); // Intervalle plus court pour plus de fluidité
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        document.querySelectorAll('.stat-card').forEach(card => statsObserver.observe(card));
    }

    // ========== GESTION COOKIES RGPD COMPLÈTE ==========
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieModal = document.getElementById('cookie-modal');
    const acceptAllButton = document.getElementById('accept-all-cookies');
    const declineButton = document.getElementById('decline-cookies');
    const customizeButton = document.getElementById('customize-cookies');
    const closeModalButton = document.getElementById('close-modal');
    const savePreferencesButton = document.getElementById('save-preferences');
    const analyticsCheckbox = document.getElementById('analytics-cookies');
    
    const GA4_ID = 'G-57J8LJGQ1L';
    const COOKIE_KEY = 'cookie-consent';
    const ANALYTICS_KEY = 'analytics-consent';
    const CONSENT_DATE_KEY = 'cookie-consent-date';
    const CONSENT_DURATION_MS = 6 * 30 * 24 * 60 * 60 * 1000; // 6 mois

    // Fonctions utilitaires
    const showElement = (element, className = 'show') => {
        if (element) {
            element.style.display = element === cookieBanner ? 'block' : 'flex';
            requestAnimationFrame(() => element.classList.add(className));
        }
    };

    const hideElement = (element, className = 'show', delay = 300) => {
        if (element) {
            element.classList.remove(className);
            setTimeout(() => { element.style.display = 'none'; }, delay);
        }
    };

    // Gestion des cookies
    const setCookie = (name, value, days) => {
        const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
        document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
    };

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    };

    const deleteCookie = (name, domain = '') => {
        const domainStr = domain ? `domain=${domain};` : '';
        document.cookie = `${name}=;${domainStr}path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT`;
    };

    // Chargement conditionnel de Google Analytics
    const loadGA4 = () => {
        if (document.getElementById('ga4-script')) return; // Évite le double chargement
        
        const script = document.createElement('script');
        script.id = 'ga4-script';
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
        document.head.appendChild(script);
        
        script.onload = () => {
            window.dataLayer = window.dataLayer || [];
            window.gtag = function() { window.dataLayer.push(arguments); };
            gtag('js', new Date());
            gtag('config', GA4_ID, { 
                anonymize_ip: true,
                cookie_flags: 'SameSite=Lax;Secure'
            });
            console.log('✅ Google Analytics chargé avec consentement');
        };
    };

    // Suppression des cookies analytiques
    const clearAnalyticsCookies = () => {
        const analyticsCookies = ['_ga', '_ga_' + GA4_ID.replace('G-', ''), '_gid', '_gat'];
        const hostname = location.hostname.replace(/^www\./, '');
        
        analyticsCookies.forEach(cookieName => {
            deleteCookie(cookieName);
            deleteCookie(cookieName, `.${hostname}`);
        });
        
        // Supprime le script GA4 s'il existe
        const gaScript = document.getElementById('ga4-script');
        if (gaScript) gaScript.remove();
        
        console.log('🗑️ Cookies analytiques supprimés');
    };

    // Sauvegarde des préférences
    const saveConsent = (analyticsAccepted) => {
        setCookie(COOKIE_KEY, 'set', 180); // 6 mois
        setCookie(ANALYTICS_KEY, analyticsAccepted ? 'true' : 'false', 180);
        setCookie(CONSENT_DATE_KEY, Date.now().toString(), 180);
        
        if (analyticsAccepted) {
            loadGA4();
        } else {
            clearAnalyticsCookies();
        }
    };

    // Vérification du consentement existant
    const checkExistingConsent = () => {
        const consent = getCookie(COOKIE_KEY);
        const consentDate = getCookie(CONSENT_DATE_KEY);
        
        if (consent && consentDate) {
            const elapsed = Date.now() - parseInt(consentDate, 10);
            if (elapsed < CONSENT_DURATION_MS) {
                const analyticsConsent = getCookie(ANALYTICS_KEY) === 'true';
                if (analyticsConsent) loadGA4();
                return true; // Consentement valide trouvé
            }
        }
        return false; // Pas de consentement ou expiré
    };

    // Gestionnaires d'événements
    if (acceptAllButton) {
        acceptAllButton.addEventListener('click', () => {
            saveConsent(true);
            hideElement(cookieBanner);
        });
    }

    if (declineButton) {
        declineButton.addEventListener('click', () => {
            saveConsent(false);
            hideElement(cookieBanner);
        });
    }

    if (customizeButton) {
        customizeButton.addEventListener('click', () => {
            hideElement(cookieBanner);
            showElement(cookieModal);
        });
    }

    if (closeModalButton) {
        closeModalButton.addEventListener('click', () => {
            hideElement(cookieModal);
        });
    }

    if (savePreferencesButton) {
        savePreferencesButton.addEventListener('click', () => {
            const analyticsAccepted = analyticsCheckbox ? analyticsCheckbox.checked : false;
            saveConsent(analyticsAccepted);
            hideElement(cookieModal);
        });
    }

    // Fermeture du modal en cliquant à l'extérieur
    if (cookieModal) {
        cookieModal.addEventListener('click', (e) => {
            if (e.target === cookieModal) {
                hideElement(cookieModal);
            }
        });
    }

    // Initialisation
    if (cookieBanner) {
        if (!checkExistingConsent()) {
            // Affiche la bannière après un court délai pour une meilleure UX
            setTimeout(() => showElement(cookieBanner), 1000);
        }
    }
});
