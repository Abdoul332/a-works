// Initialisation d'AOS (Animate On Scroll)
AOS.init({
    duration: 800,
    once: true,
    disable: 'mobile'
});

// Attendre que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function() {
    // Sélection des éléments du DOM
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav a');
    const header = document.querySelector('.header');
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    
    // Gestion du menu mobile
    function toggleMobileMenu() {
        const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
        mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
        mobileMenuBtn.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
        
        // Ajouter une classe au header lorsque le menu est ouvert
        if (nav.classList.contains('active')) {
            header.classList.add('menu-open');
        } else {
            header.classList.remove('menu-open');
        }
    }
    
    // Fermer le menu mobile lors du clic sur un lien
    function closeMobileMenu() {
        mobileMenuBtn.classList.remove('active');
        nav.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Gestion du header sticky au scroll
    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // Animation des statistiques au défilement
    function animateStats() {
        const stats = document.querySelectorAll('.stat-number');
        
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000; // 2 secondes
            const step = target / (duration / 16); // 60fps
            let current = 0;
            
            const updateCount = () => {
                current += step;
                if (current < target) {
                    stat.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCount);
                } else {
                    stat.textContent = target;
                }
            };
            
            // Démarrer l'animation lorsque la section est visible
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    updateCount();
                    observer.disconnect();
                }
            }, { threshold: 0.5 });
            
            observer.observe(stat.parentElement);
        });
    }
    
    // Gestion de la soumission du formulaire
    function handleSubmit(e) {
        e.preventDefault();
        
        // Ici, vous pouvez ajouter le code pour envoyer les données du formulaire à un serveur
        // Pour l'instant, on simule un envoi réussi
        
        // Masquer le formulaire et afficher le message de succès
        contactForm.style.display = 'none';
        formSuccess.style.display = 'flex';
        
        // Réinitialiser le formulaire
        contactForm.reset();
        
        // Faire défiler vers le haut du formulaire
        setTimeout(() => {
        }, 100);
    }
    
    // Initialisation des animations au chargement
    function initAnimations() {
        // Démarrer les animations des statistiques
        if (document.querySelector('.stat-number')) {
            animateStats();
        }
        
        // Réinitialiser les animations lors du redimensionnement
        let resizeTimer;
        window.addEventListener('resize', () => {
            document.body.classList.add('resize-animation-stopper');
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                document.body.classList.remove('resize-animation-stopper');
            }, 400);
        });
        
        // Réinitialiser AOS lors du redimensionnement
        window.addEventListener('resize', () => {
            AOS.refresh();
        });
    }
    
    // Désactiver les transitions au chargement pour éviter les animations indésirables
    document.documentElement.classList.add('no-transition');
    
    // Ajout des écouteurs d'événements
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    // Fermer le menu lors du clic sur un lien
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Vérifier si c'est un lien d'ancrage
            if (link.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Fermer le menu mobile s'il est ouvert
                    closeMobileMenu();
                    
                    // Faire défiler jusqu'à l'élément cible en douceur
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                    
                    // Mettre à jour l'URL sans recharger la page
                    if (history.pushState) {
                        history.pushState(null, null, targetId);
                    } else {
                        window.location.hash = targetId;
                    }
                }
            }
        });
    });
    
    // Gérer le scroll
    window.addEventListener('scroll', handleScroll);
    
    // Gérer la soumission du formulaire
    if (contactForm) {
        contactForm.addEventListener('submit', handleSubmit);
    }
    
    // Réactiver les transitions après le chargement
    setTimeout(() => {
        document.documentElement.classList.remove('no-transition');
    }, 100);
    
    // Initialisation
    handleScroll();
    initAnimations(); // Initialiser les animations
    
    // Animation de la démo du formulaire
    function animateDemoForm() {
        const formInputs = document.querySelectorAll('.demo-form .form-input');
        
        if (!formInputs.length || !submitBtn) return;
        
        let currentInput = 0;
        
        function typeText(element, text, callback) {
            let i = 0;
            const speed = 50; // Vitesse de frappe en ms
            
            function type() {
                if (i < text.length) {
                    element.value += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                } else if (callback) {
                    callback();
                }
            }
            
            type();
        }
        
        function processNextInput() {
            if (currentInput < formInputs.length) {
                const input = formInputs[currentInput];
                const text = input.placeholder === 'Votre nom' ? 'Jean Dupont' : 'jean.dupont@email.com';
                
                input.focus();
                input.value = '';
                
                typeText(input, text, () => {
                    currentInput++;
                    setTimeout(processNextInput, 500);
                });
            } else {
                // Tous les champs sont remplis, on simule la soumission
                submitBtn.classList.add('clicked');
                submitBtn.textContent = 'Envoi en cours...';
                
                setTimeout(() => {
                    submitBtn.textContent = 'Message envoyé !';
                    submitBtn.style.backgroundColor = '#4bb543';
                    
                    // Réinitialiser après un délai
                    setTimeout(() => {
                        formInputs.forEach(input => input.value = '');
                        submitBtn.classList.remove('clicked');
                        submitBtn.textContent = 'Je profite de l\'offre';
                        submitBtn.style.backgroundColor = '';
                        currentInput = 0;
                        
                        // Recommencer l'animation après un délai
                        setTimeout(animateDemoForm, 2000);
                    }, 2000);
                }, 1500);
            }
        }
        
        // Démarrer l'animation après un délai
        setTimeout(processNextInput, 2000);
    }
    
    // Démarrer l'animation de la démo du formulaire
    if (document.querySelector('.demo-form')) {
        animateDemoForm();
    }
    
    // Animation du compteur de statistiques
    function animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const target = stat.textContent;
            const suffix = stat.textContent.replace(/\d+/g, ''); // Garder les symboles comme % ou x
            const targetNumber = parseFloat(target);
            let current = 0;
            const duration = 2000; // 2 secondes
            const stepTime = 20; // rafraîchissement toutes les 20ms
            const steps = duration / stepTime;
            const increment = targetNumber / steps;
            
            const timer = setInterval(() => {
                current += increment;
                
                if (current >= targetNumber) {
                    current = targetNumber;
                    clearInterval(timer);
                }
                
                // Formater le nombre avec le symbole (%, x, etc.)
                stat.textContent = Math.round(current) + suffix;
            }, stepTime);
        });
    }
    
    // Démarrer l'animation des statistiques lorsque la section est visible
    const observerOptions = {
        threshold: 0.3 // Déclencher lorsque 30% de l'élément est visible
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target); // Arrêter d'observer après la première animation
            }
        });
    }, observerOptions);
    
    const statsSection = document.querySelector('.educative');
    if (statsSection) {
        observer.observe(statsSection);
    }
});
