document.addEventListener('DOMContentLoaded', function() {

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

    // ----------- COOKIES + GA4 -----------
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('accept-cookies');
    const declineButton = document.getElementById('decline-cookies');
    const GA4_ID = 'G-57J8LJGQ1L'; // Mettre l'ID ici est plus propre

    if (cookieBanner && acceptButton && declineButton) {
        const COOKIE_KEY = 'cookie-consent';
        const COOKIE_DATE_KEY = 'cookie-consent-date';
        const CONSENT_DURATION_MS = 6 * 30 * 24 * 60 * 60 * 1000; // 6 mois

        const showCookieBanner = () => {
            cookieBanner.style.display = 'block';
            requestAnimationFrame(() => cookieBanner.classList.add('show'));
        };
        const hideCookieBanner = () => {
            cookieBanner.classList.remove('show');
            setTimeout(() => { cookieBanner.style.display = 'none'; }, 300);
        };

        const saveConsent = (accepted) => {
            localStorage.setItem(COOKIE_KEY, accepted ? 'accepted' : 'declined');
            localStorage.setItem(COOKIE_DATE_KEY, Date.now().toString());
        };

        const enableGA4 = () => {
            if (document.getElementById('ga4-script')) return;
            const s = document.createElement('script');
            s.id = 'ga4-script';
            s.async = true;
            s.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
            document.head.appendChild(s );
            s.onload = () => {
                window.dataLayer = window.dataLayer || [];
                window.gtag = function() { window.dataLayer.push(arguments); };
                gtag('js', new Date());
                gtag('config', GA4_ID, { anonymize_ip: true });
            };
        };

        const clearNonEssentialCookies = () => {
            const cookies = document.cookie.split(';');
            for (const cookie of cookies) {
                const eqPos = cookie.indexOf("=");
                const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
                // Cible les cookies de Google Analytics
                if (name.startsWith('_ga') || name.startsWith('_gid')) {
                    document.cookie = `${name}=;Max-Age=-99999999;path=/;domain=${location.hostname.replace(/^www\./, '.')}`;
                    document.cookie = `${name}=;Max-Age=-99999999;path=/;`;
                }
            }
        };

        acceptButton.addEventListener('click', () => {
            saveConsent(true);
            hideCookieBanner();
            enableGA4();
        });

        declineButton.addEventListener('click', () => {
            saveConsent(false);
            hideCookieBanner();
            clearNonEssentialCookies();
        });

        const checkConsent = () => {
            const consent = localStorage.getItem(COOKIE_KEY);
            const consentDate = localStorage.getItem(COOKIE_DATE_KEY);
            if (!consent || !consentDate || (Date.now() - parseInt(consentDate, 10)) > CONSENT_DURATION_MS) {
                showCookieBanner();
            } else if (consent === 'accepted') {
                enableGA4();
            }
        };

        checkConsent();
    }
});
