
document.addEventListener('DOMContentLoaded', () => {

    /**
     * -----------------------------------------------------------------------------
     * MODULE 1 : GESTION DU CONSENTEMENT RGPD & GOOGLE ANALYTICS 4
     * -----------------------------------------------------------------------------
     */
    const handleCookieConsent = () => {
        const GA4_ID = 'G-57J8LJGQ1L'; 
        const COOKIE_CONSENT_KEY = 'user_cookie_consent';
        const CONSENT_EXPIRATION_MS = 13 * 30 * 24 * 60 * 60 * 1000; // 13 mois

        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('accept-cookies');
        const refuseBtn = document.getElementById('refuse-cookies');

        if (!banner || !acceptBtn || !refuseBtn) {
            console.warn('Éléments de la bannière de cookies non trouvés. La gestion du consentement est désactivée.');
            return;
        }

        const getConsent = () => {
            const consentData = localStorage.getItem(COOKIE_CONSENT_KEY);
            if (!consentData) return null;

            try {
                const { status, timestamp } = JSON.parse(consentData);
                if (Date.now() - timestamp > CONSENT_EXPIRATION_MS) {
                    localStorage.removeItem(COOKIE_CONSENT_KEY);
                    return null; // Le consentement a expiré
                }
                return status;
            } catch (e) {
                localStorage.removeItem(COOKIE_CONSENT_KEY);
                return null;
            }
        };

        const setConsent = (status) => {
            const consentData = { status, timestamp: Date.now() };
            localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentData));
            banner.classList.remove('show');
        };

        const injectGA4 = () => {
            if (!GA4_ID || GA4_ID === 'G-57J8LJGQ1L') {
                console.warn("L'ID Google Analytics 4 n'est pas configuré. Le script ne sera pas injecté.");
                return;
            }
            // Vérifie si le script n'est pas déjà présent
            if (document.querySelector(`script[src*="${GA4_ID}"]`)) return;

            const script = document.createElement('script');
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
            document.head.appendChild(script );

            window.dataLayer = window.dataLayer || [];
            function gtag() { dataLayer.push(arguments); }
            gtag('js', new Date());
            gtag('config', GA4_ID);
            console.log('Google Analytics 4 a été activé.');
        };

        const clearNonEssentialCookies = () => {
            const cookies = document.cookie.split(';');
            const essentialCookies = [COOKIE_CONSENT_KEY.split('=')[0].trim()]; // Conserve le cookie de consentement

            cookies.forEach(cookie => {
                const name = cookie.split('=')[0].trim();
                // Supprime les cookies liés à Google Analytics et autres cookies non essentiels
                if (!essentialCookies.includes(name) && (name.startsWith('_ga') || name.startsWith('_gid'))) {
                    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                }
            });
            console.log('Cookies non essentiels supprimés.');
        };

        acceptBtn.addEventListener('click', () => {
            setConsent('accepted');
            injectGA4();
        });

        refuseBtn.addEventListener('click', () => {
            setConsent('refused');
            clearNonEssentialCookies();
        });

        // Vérification initiale
        const consentStatus = getConsent();
        if (consentStatus === 'accepted') {
            injectGA4();
        } else if (consentStatus === 'refused') {
            clearNonEssentialCookies();
        } else {
            banner.classList.add('show');
        }
    };


    /**
     * -----------------------------------------------------------------------------
     * MODULE 2 : OPTIMISATIONS DE PERFORMANCE ET UX
     * -----------------------------------------------------------------------------
     */

    // 2.1. Lazy Loading pour les images
    const lazyLoadImages = () => {
        const lazyImages = document.querySelectorAll('img[data-src]');
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        img.classList.add('loaded');
                        obs.unobserve(img);
                    }
                });
            }, { threshold: 0.1 });
            lazyImages.forEach(img => observer.observe(img));
        } else {
            // Fallback pour les anciens navigateurs
            lazyImages.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    };

    // 2.2. Animations au défilement
    const animateOnScroll = () => {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15 });
            animatedElements.forEach(el => observer.observe(el));
        }
    };

    // 2.3. Compteur de statistiques animé
    const animateStats = () => {
        const stats = document.querySelectorAll('.stat-counter');
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const stat = entry.target;
                        const finalValue = parseInt(stat.dataset.value, 10);
                        let startValue = 0;
                        const duration = 2000; // 2 secondes
                        const startTime = performance.now();

                        const step = (currentTime) => {
                            const elapsedTime = currentTime - startTime;
                            const progress = Math.min(elapsedTime / duration, 1);
                            const currentValue = Math.floor(progress * finalValue);
                            stat.textContent = currentValue;

                            if (progress < 1) {
                                requestAnimationFrame(step);
                            } else {
                                stat.textContent = finalValue; // la valeur finale exacte
                            }
                        };
                        requestAnimationFrame(step);
                        obs.unobserve(stat);
                    }
                });
            }, { threshold: 0.8 });
            stats.forEach(stat => observer.observe(stat));
        }
    };

    // 2.4. Défilement fluide (Smooth Scroll)
    const smoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                // S'assurer que ce n'est pas juste un lien vide
                if (href.length > 1) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            });
        });
    };


    /**
     * -----------------------------------------------------------------------------
     * MODULE 3 : FONCTIONNALITÉS DE NAVIGATION
     * -----------------------------------------------------------------------------
     */

    // 3.1. Gestion du menu mobile
    const handleMobileMenu = () => {
        const menuToggle = document.getElementById('mobile-menu-toggle');
        const navMenu = document.getElementById('main-nav');

        if (menuToggle && navMenu) {
            menuToggle.addEventListener('click', () => {
                navMenu.classList.toggle('is-active');
                menuToggle.classList.toggle('is-active');
            });

            // Ferme le menu en cliquant sur un lien
            navMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('is-active');
                    menuToggle.classList.remove('is-active');
                });
            });
        }
    };

    // 3.2. Effet sur la barre de navigation au défilement
    const handleNavbarScroll = () => {
        const navbar = document.getElementById('main-header');
        if (navbar) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });
        }
    };


    /**
     * -----------------------------------------------------------------------------
     * INITIALISATION DES MODULES
     * -----------------------------------------------------------------------------
     */
    handleCookieConsent();
    lazyLoadImages();
    animateOnScroll();
    animateStats();
    smoothScroll();
    handleMobileMenu();
    handleNavbarScroll();

});
