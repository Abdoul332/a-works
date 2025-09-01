
document.addEventListener('DOMContentLoaded', function() {

    // ----------- SMOOTH SCROLL -----------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if(target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });

    // ----------- NAVBAR SCROLL EFFECT -----------
    const navbar = document.getElementById('navbar');
    function updateNavbar() {
        if(navbar) {
            if(window.scrollY > 100) navbar.classList.add('scrolled');
            else navbar.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', () => requestAnimationFrame(updateNavbar));

    // ----------- INTERSECTION OBSERVER ANIMATIONS -----------
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const animateObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) entry.target.classList.add('animate-in');
        });
    }, observerOptions);

    const directionalObserver = (selector, className) => {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) entry.target.classList.add(className);
            });
        }, observerOptions);
        document.querySelectorAll(selector).forEach(el => obs.observe(el));
    }

    document.querySelectorAll('.section-header, .service-card, .value-card, .process-step').forEach(el => animateObserver.observe(el));
    directionalObserver('.about-text', 'animate-in-left');
    directionalObserver('.about-visual', 'animate-in-right');

    // ----------- TESTIMONIAL SLIDER -----------
    let currentTestimonial = 0;
    const testimonials = document.querySelectorAll('.testimonial-item');
    const dots = document.querySelectorAll('.nav-dot');
    let testimonialInterval;

    function showTestimonial(index) {
        testimonials.forEach((t,i)=>t.classList.toggle('active', i===index));
        dots.forEach((d,i)=>d.classList.toggle('active', i===index));
    }

    function nextTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }

    function startSlider() {
        testimonialInterval = setInterval(nextTestimonial, 6000);
    }

    function stopSlider() {
        clearInterval(testimonialInterval);
    }

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => { currentTestimonial = i; showTestimonial(i); });
    });

    testimonials.forEach(t => {
        t.addEventListener('mouseenter', stopSlider);
        t.addEventListener('mouseleave', startSlider);
    });

    startSlider();

    // ----------- PARALLAX HERO -----------
    const hero = document.querySelector('.hero');
    function parallaxHero() {
        if(hero) hero.style.transform = `translateY(${window.scrollY*0.5}px)`;
    }
    window.addEventListener('scroll', () => requestAnimationFrame(parallaxHero));

    // ----------- LAZY LOAD IMAGES -----------
    if('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
    }

    // ----------- STAT ANIMATION -----------
    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                const statNumber = entry.target.querySelector('.stat-number');
                if(statNumber) {
                    const finalValue = statNumber.textContent;
                    let current = 0;
                    const increment = 1;
                    const timer = setInterval(() => {
                        current += increment;
                        if(finalValue.includes('%')) statNumber.textContent = current+'%';
                        else if(finalValue.includes('+')) statNumber.textContent = current+'+';
                        else statNumber.textContent = current;
                        if(current >= parseInt(finalValue)) {
                            clearInterval(timer);
                            statNumber.textContent = finalValue;
                        }
                    }, 50);
                    observer.unobserve(entry.target);
                }
            }
        });
    }, {threshold:0.5});
    document.querySelectorAll('.stat-card').forEach(card => statsObserver.observe(card));

    // ----------- COOKIES + GA4 -----------
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('accept-cookies');
    const declineButton = document.getElementById('decline-cookies');
    const changeButton = document.getElementById('change-cookies');
    const COOKIE_KEY = 'cookie-consent';
    const COOKIE_DATE_KEY = 'cookie-consent-date';
    const CONSENT_MS = 6*30*24*60*60*1000; // 6 mois

    function checkConsent() {
        const consent = localStorage.getItem(COOKIE_KEY);
        const date = localStorage.getItem(COOKIE_DATE_KEY);
        const now = Date.now();
        if(!consent || !date || now - parseInt(date) > CONSENT_MS) showCookie();
        else if(consent==='accepted') enableGA4();
        if(changeButton) changeButton.style.display='inline-block';
    }

    function showCookie() { if(cookieBanner){ cookieBanner.style.display='block'; setTimeout(()=>cookieBanner.classList.add('show'),200); } }
    function hideCookie() { if(cookieBanner){ cookieBanner.classList.remove('show'); setTimeout(()=>cookieBanner.style.display='none',300); } }
    function saveConsent(accepted) {
        const ts = Date.now().toString();
        localStorage.setItem(COOKIE_KEY, accepted?'accepted':'declined');
        localStorage.setItem(COOKIE_DATE_KEY, ts);
        document.dispatchEvent(new CustomEvent('cookieConsentChanged',{detail:{consent:accepted?'accepted':'declined', timestamp:ts}}));
        if(changeButton) changeButton.style.display='inline-block';
    }

    if(acceptButton) acceptButton.addEventListener('click',()=>{ saveConsent(true); hideCookie(); enableGA4(); });
    if(declineButton) declineButton.addEventListener('click',()=>{ saveConsent(false); hideCookie(); disableGA4(); });
    if(changeButton) changeButton.addEventListener('click',()=>{ showCookie(); });

    function enableGA4() {
        const GA4_ID = 'G-57J8LJGQ1L'; 
        if(!document.getElementById('ga4-script')){
            const s=document.createElement('script');
            s.id='ga4-script';
            s.async=true;
            s.src=`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
            document.head.appendChild(s);
            s.onload=()=>{ window.dataLayer=window.dataLayer||[]; function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date()); gtag('config',GA4_ID,{anonymize_ip:true}); };
        }
    }

    function disableGA4() { clearNonEssentialCookies(); }

    function clearNonEssentialCookies() {
        const essential=[COOKIE_KEY,COOKIE_DATE_KEY];
        document.cookie.split(';').forEach(c=>{
            const n=c.split('=')[0].trim();
            if(!essential.includes(n)) document.cookie=`${n}=; expires=Thu,01 Jan 1970 00:00:00 UTC; path=/;`;
        });
    }

    checkConsent();

});
