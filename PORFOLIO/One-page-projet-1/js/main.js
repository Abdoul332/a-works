document.addEventListener('DOMContentLoaded', function() {
    // Initialisation d'AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    // Variables
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');
    const backToTopBtn = document.getElementById('backToTop');
    const scrollProgress = document.querySelector('.scroll-progress .progress-bar');
    const header = document.querySelector('.header');

    // Menu mobile
    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
    }

    // Fermer le menu mobile au clic sur un lien
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                menuBtn.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    });

    // Header scroll
    function handleScroll() {
        // Ajouter/supprimer la classe scrolled sur le header
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Afficher/masquer le bouton back to top
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }

        // Mettre à jour la barre de progression du défilement
        updateScrollProgress();
    }

    // Barre de progression du défilement
    function updateScrollProgress() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / documentHeight) * 100;
        scrollProgress.style.width = progress + '%';
    }

    // Back to top
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Animation des liens de navigation au survol
    navLinksItems.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Animation des cartes au survol
    const cards = document.querySelectorAll('.card, .service-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const angleX = (y - centerY) / 20;
            const angleY = (centerX - x) / 20;
            
            this.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.02, 1.02, 1.02)`;
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
        });
    });

    // Animation des boutons au survol
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        });
    });

    // Animation de la timeline au scroll
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    function checkTimeline() {
        timelineItems.forEach(item => {
            const itemTop = item.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (itemTop < windowHeight - 100) {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }
        });
    }

    // Initialiser la timeline
    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transition = 'all 0.6s ease-out';
        
        if (item.classList.contains('timeline-item:nth-child(odd)')) {
            item.style.transform = 'translateX(-50px)';
        } else {
            item.style.transform = 'translateX(50px)';
        }
    });

    // Vérifier la position de la timeline au chargement et au défilement
    window.addEventListener('load', checkTimeline);
    window.addEventListener('scroll', checkTimeline);

    // Gestion du formulaire de contact
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Récupérer les valeurs du formulaire
            const formData = new FormData(contactForm);
            const formValues = Object.fromEntries(formData.entries());
            
            // Ici, vous pouvez ajouter la logique pour envoyer les données du formulaire
            console.log('Formulaire soumis avec les données :', formValues);
            
            // Afficher un message de succès
            alert('Merci pour votre message ! Je vous recontacterai dès que possible.');
            
            // Réinitialiser le formulaire
            contactForm.reset();
        });
    }

    // Animation des icônes de la timeline
    const timelineIcons = document.querySelectorAll('.timeline-icon');
    timelineIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(10deg)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0)';
        });
    });

    // Gestion du chargement paresseux des images
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });

    // Ajouter un effet de parallaxe à l'héro image
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        window.addEventListener('mousemove', function(e) {
            const x = (window.innerWidth / 2 - e.pageX) / 30;
            const y = (window.innerHeight / 2 - e.pageY) / 30;
            heroImage.style.transform = `translate(${x}px, ${y}px)`;
        });
    }

    // Détection de la préférence de réduction de mouvement
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // Désactiver les animations si l'utilisateur préfère une réduction du mouvement
        document.querySelectorAll('[data-aos]').forEach(el => {
            el.removeAttribute('data-aos');
        });
        
        // Désactiver l'animation de flottement de l'image hero
        const heroImg = document.querySelector('.hero-image img');
        if (heroImg) {
            heroImg.style.animation = 'none';
        }
    }

    // Écouter les événements de défilement
    window.addEventListener('scroll', handleScroll);
    
    // Initialiser au chargement
    handleScroll();
});

// Fonction pour le chargement progressif des images
function lazyLoadImages() {
    const lazyImages = [].slice.call(document.querySelectorAll('img.lazy'));
    
    if ('IntersectionObserver' in window) {
        const lazyImageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.classList.remove('lazy');
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });

        lazyImages.forEach(function(lazyImage) {
            lazyImageObserver.observe(lazyImage);
        });
    }
}

// Gestion de la FAQ
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const icon = question.querySelector('i');
    
    // Fermer toutes les réponses sauf la première
    if (item !== faqItems[0]) {
        answer.style.maxHeight = '0';
        answer.style.opacity = '0';
        answer.style.padding = '0 20px';
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
    } else {
        answer.style.maxHeight = answer.scrollHeight + 'px';
        answer.style.opacity = '1';
        answer.style.padding = '20px';
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
    }
    
    question.addEventListener('click', () => {
        const isOpen = answer.style.maxHeight && answer.style.maxHeight !== '0px';
        
        // Fermer toutes les réponses
        faqItems.forEach(faq => {
            const otherAnswer = faq.querySelector('.faq-answer');
            const otherIcon = faq.querySelector('.faq-question i');
            
            if (otherAnswer !== answer) {
                otherAnswer.style.maxHeight = '0';
                otherAnswer.style.opacity = '0';
                otherAnswer.style.padding = '0 20px';
                otherIcon.classList.remove('fa-chevron-up');
                otherIcon.classList.add('fa-chevron-down');
            }
        });
        
        // Ouvrir/fermer la réponse cliquée
        if (isOpen) {
            answer.style.maxHeight = '0';
            answer.style.opacity = '0';
            answer.style.padding = '0 20px';
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');
        } else {
            answer.style.maxHeight = answer.scrollHeight + 'px';
            answer.style.opacity = '1';
            answer.style.padding = '20px';
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-up');
        }
    });
});

// Animation au survol des boutons
const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        button.style.setProperty('--x', `${x}px`);
        button.style.setProperty('--y', `${y}px`);
    });
});

// Charger les images en différé
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(lazyLoadImages, 2000);
});
