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
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
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

if (mobileMenuBtn && navMenu) {
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
}

// Performance optimization: Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
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
                const increment = 1;

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

                observer.unobserve(entry.target);
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-card').forEach(card => {
    statsObserver.observe(card);
});

// RGPD + Google Analytics 4
document.addEventListener('DOMContentLoaded', () => {
    const handleCookieConsent = () => {
        const GA4_ID = 'G-57J8LJGQ1L'; 
        const COOKIE_CONSENT_KEY = 'user_cookie_consent';
       const CONSENT_EXPIRATION_MS = 7 * 24 * 60 * 60 * 1000; // 1 semaine


        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('accept-cookies');
        const refuseBtn = document.getElementById('refuse-cookies');

        if (!banner || !acceptBtn || !refuseBtn) {
            console.warn('Éléments de la bannière cookies introuvables.');
            return;
        }

        const getConsent = () => {
            const consentData = localStorage.getItem(COOKIE_CONSENT_KEY);
            if (!consentData) return null;
            try {
                const { status, timestamp } = JSON.parse(consentData);
                if (Date.now() - timestamp > CONSENT_EXPIRATION_MS) {
                    localStorage.removeItem(COOKIE_CONSENT_KEY);
                    return null;
                }
                return status;
            } catch {
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
                console.warn(" ID GA4 manquant !");
                return;
            }
            if (document.querySelector(`script[src*="${GA4_ID}"]`)) return;

            const script = document.createElement('script');
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
            document.head.appendChild(script);

            window.dataLayer = window.dataLayer || [];
            function gtag() { dataLayer.push(arguments); }
            gtag('js', new Date());
            gtag('config', GA4_ID);
            console.log(' Google Analytics 4 activé.');
        };

        const clearNonEssentialCookies = () => {
            const cookies = document.cookie.split(';');
            cookies.forEach(cookie => {
                const name = cookie.split('=')[0].trim();
                if (name.startsWith('_ga') || name.startsWith('_gid')) {
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

    handleCookieConsent();
});
