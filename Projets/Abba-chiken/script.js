// Gestion des notifications modernes
class NotificationManager {
    constructor() {
        this.notifications = [];
        this.notificationContainer = null;
        this.initContainer();
    }

    initContainer() {
        this.notificationContainer = document.createElement('div');
        this.notificationContainer.className = 'notification-container';
        document.body.appendChild(this.notificationContainer);
        this.addStyles();
    }

    showNotification(message, options = {}) {
        const {
            type = 'info',
            duration = 5000,
            showReservationButton = true,
            autoClose = true
        } = options;

        // Création de la notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'assertive');
        
        // Icône selon le type
        const iconMap = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        const icon = iconMap[type] || 'info-circle';
        
        // Contenu de la notification
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-${icon}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-message">${message}</div>
                ${showReservationButton ? `
                <button class="btn-reservation" aria-label="Réserver une table">
                    <i class="fas fa-calendar-check"></i> Réserver une table
                </button>` : ''}
            </div>
            <button class="notification-close" aria-label="Fermer la notification">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Gestion du bouton de réservation
        const reserveBtn = notification.querySelector('.btn-reservation');
        if (reserveBtn) {
            reserveBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.closeNotification(notification);
                setTimeout(() => this.scrollToReservation(), 300);
            });
        }

        // Gestion de la fermeture
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeNotification(notification);
        });

        // Ajout au conteneur
        this.notificationContainer.appendChild(notification);
        this.notifications.push(notification);

        // Animation d'entrée
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Fermeture automatique
        if (autoClose) {
            notification.timeoutId = setTimeout(() => {
                this.closeNotification(notification);
            }, duration);
        }

        return notification;
    }

    closeNotification(notification) {
        if (!notification || !notification.parentNode) return;
        
        clearTimeout(notification.timeoutId);
        notification.classList.remove('show');
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
                this.notifications = this.notifications.filter(n => n !== notification);
            }
        }, 300);
    }

    scrollToReservation() {
        const reservationSection = document.getElementById('reservation');
        if (reservationSection) {
            window.scrollTo({
                top: reservationSection.offsetTop - 20,
                behavior: 'smooth'
            });
        }
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .notification-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
                display: flex;
                flex-direction: column;
                gap: 12px;
                max-width: 100%;
                pointer-events: none;
            }

            .notification {
                position: relative;
                display: flex;
                align-items: flex-start;
                background: #fff;
                border-radius: 6px;
                box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
                padding: 10px 14px;
                max-width: 280px;
                opacity: 0;
                transform: translateX(20px);
                transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                pointer-events: auto;
                overflow: hidden;
                font-size: 13px;
                line-height: 1.3;
            }

            .notification.show {
                opacity: 1;
                transform: translateX(0);
            }

            .notification-icon {
                font-size: 16px;
                margin-right: 10px;
                margin-top: 1px;
                flex-shrink: 0;
                opacity: 0.9;
            }

            .notification-content {
                flex: 1;
                min-width: 0;
            }

            .notification-message {
                margin-bottom: 6px;
                line-height: 1.3;
                color: #333;
                font-size: 12.5px;
            }

            .btn-reservation {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                background: linear-gradient(135deg, #27ae60, #2ecc71);
                color: white;
                border: none;
                border-radius: 3px;
                padding: 4px 8px;
                font-size: 11px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                margin-top: 6px;
                line-height: 1.2;
            }

            .btn-reservation:hover {
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(39, 174, 96, 0.3);
            }

            .btn-reservation:active {
                transform: translateY(0);
            }

            .notification-close {
                background: none;
                border: none;
                color: #999;
                font-size: 12px;
                cursor: pointer;
                padding: 2px;
                margin: -2px -2px -2px 6px;
                border-radius: 3px;
                transition: all 0.2s ease;
                opacity: 0.7;
            }

            .notification-close:hover {
                color: #666;
                background: rgba(0, 0, 0, 0.05);
            }

            /* Types de notifications */
            .notification-info .notification-icon { color: #3498db; }
            .notification-success .notification-icon { color: #27ae60; }
            .notification-warning .notification-icon { color: #f39c12; }
            .notification-error .notification-icon { color: #e74c3c; }

            /* Barre de progression */
            .notification::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 3px;
                background: rgba(0, 0, 0, 0.1);
                transform: scaleX(1);
                transform-origin: left;
                transition: transform 0.1s linear;
            }

            .notification[data-duration]::after {
                animation: progress linear forwards;
                animation-duration: inherit;
            }

            @keyframes progress {
                to { transform: scaleX(0); }
            }

            /* Responsive */
            @media (max-width: 600px) {
                .notification-container {
                    left: 10px;
                    right: 10px;
                    top: 10px;
                    max-width: none;
                }
                
                .notification {
                    max-width: 100%;
                    padding: 8px 12px;
                    font-size: 12.5px;
                }
                
                .notification-message {
                    font-size: 12px;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialisation du gestionnaire de notifications
const notificationManager = new NotificationManager();

// Gestion des boutons "Commander"
document.addEventListener('DOMContentLoaded', function() {
    // Gestion des boutons "Commander"
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.btn-commander');
        if (!btn) return;

        e.preventDefault();
        const dishName = btn.getAttribute('data-dish') || 'ce plat';
        
        notificationManager.showNotification(
            `Vous avez commandé ${dishName}. Merci pour votre commande !`,
            {
                type: 'success',
                showReservationButton: true,
                duration: 5000
            }
        );
    });

    // Gestion du formulaire de contact
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            notificationManager.showNotification(
                'Votre message a été envoyé avec succès !',
                {
                    type: 'success',
                    showReservationButton: false,
                    duration: 3000
                }
            );
            this.reset();
        });
    }
    
    // Fonction pour fermer une notification
    function closeNotification(notification) {
        if (notification && notification.close) {
            notification.close();
        } else if (notification && notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }
    
    // Fonction pour faire défiler jusqu'à la section réservation
    function scrollToReservation() {
        const reservationSection = document.getElementById('reservation');
        if (reservationSection) {
            reservationSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
            
            // Mise en surbrillance de la section
            reservationSection.style.transition = 'all 0.5s ease';
            reservationSection.style.boxShadow = '0 0 0 4px rgba(12, 214, 147, 0.5)';
            
            // Retirer la surbrillance après 2 secondes
            setTimeout(() => {
                reservationSection.style.boxShadow = 'none';
            }, 2000);
        }
    }

    // Gestion des boutons "Commander"
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.btn-commander');
        if (!btn) return;
        
        e.preventDefault();
        
        // Récupérer le nom du produit
        const productName = btn.closest('.dish')?.querySelector('h4')?.textContent.trim() || 'Produit';
        
        // Afficher la notification avec le bouton de réservation
        showNotification(`${productName} commandé avec succès !`);
        
        // Animation du bouton
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Commandé !';
        btn.style.backgroundColor = '#0ab57d';
        
        // Réinitialiser le bouton après 2 secondes
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.backgroundColor = '';
        }, 2000);
    });

    // Gestion du formulaire de réservation
    const reservationForm = document.querySelector('#reservation form');
    if (reservationForm) {
        reservationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Votre demande de réservation a été envoyée !');
            this.reset();
        });
    }
    
    // Gestion de la popup développeur
    const devPopup = document.getElementById('dev-popup');
    const ctaButtons = document.querySelectorAll('.cta-buttons .btn');
    
    if (devPopup) {
        const closeBtn = devPopup.querySelector('.close-popup');
        let popupTimeout;
        
        // Fonction pour afficher la popup
        function showDevPopup() {
            // Réinitialiser l'animation
            devPopup.style.display = 'block';
            devPopup.style.animation = 'none';
            devPopup.offsetHeight; // Forcer le recalcul du style
            devPopup.style.animation = 'slideUp 0.3s ease-out forwards';
            
            // Fermer automatiquement après 15 secondes
            clearTimeout(popupTimeout);
            popupTimeout = setTimeout(() => {
                closeDevPopup();
            }, 15000);
        }
        
        // Fonction pour fermer la popup
        function closeDevPopup() {
            devPopup.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                devPopup.style.display = 'none';
            }, 300);
        }
        
        // Fermer la popup au clic sur la croix
        closeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            closeDevPopup();
        });
        
        // Afficher la popup au clic sur les boutons CTA
        ctaButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const target = this.getAttribute('href');
                showDevPopup();
                
                // Délai avant la navigation pour permettre l'animation
                setTimeout(() => {
                    const targetElement = document.querySelector(target);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 100);
            });
        });
        
        // Fermer la popup si on clique en dehors
        document.addEventListener('click', function(e) {
            if (devPopup.style.display !== 'none' && 
                !devPopup.contains(e.target) && 
                !Array.from(ctaButtons).some(btn => btn.contains(e.target))) {
                closeDevPopup();
            }
        });
    }

    // Ajout des styles CSS nécessaires
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            left: 20px;
            background: #2196F3;
            color: white;
            padding: 20px 25px 20px 20px;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.2);
            z-index: 9999;
            animation: slideIn 0.3s ease-out forwards;
            max-width: 400px;
            margin: 0 auto;
            box-sizing: border-box;
            transform: translateZ(0);
            -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
        }
        
        .notification-close {
            position: absolute;
            top: 10px;
            right: 10px;
            background: transparent;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            opacity: 0.8;
            transition: opacity 0.2s;
        }
        
        .notification-close:hover {
            opacity: 1;
        }
        
        .notification-content {
            margin-bottom: 10px;
        }
        
        .btn-reservation {
            display: inline-block;
            background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%);
            border: none;
            color: white;
            padding: 12px 25px;
            border-radius: 30px;
            cursor: pointer;
            text-align: center;
            font-size: 16px;
            font-weight: 600;
            margin-top: 10px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            position: relative;
            overflow: hidden;
            border: none;
        }
        
        .btn-reservation:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
            background: linear-gradient(135deg, #FF5252 0%, #FF7B7B 100%);
        }
        
        .btn-reservation:active {
            transform: translateY(1px);
            box-shadow: 0 2px 10px rgba(255, 107, 107, 0.3);
        }
        
        .btn-reservation i {
            margin-right: 8px;
            font-size: 16px;
            vertical-align: middle;
        }
        
        /* Styles pour la popup développeur */
        .dev-popup {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            padding: 15px 20px;
            z-index: 1000;
            max-width: 300px;
            border-left: 4px solid #2196F3;
            transform: translateY(20px);
            opacity: 0;
            animation: slideUp 0.3s ease-out 2s forwards;
        }
        
        .dev-popup-content {
            position: relative;
        }
        
        .close-popup {
            position: absolute;
            top: -10px;
            right: -10px;
            font-size: 20px;
            cursor: pointer;
            color: #666;
            background: #fff;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        
        .dev-popup p {
            margin: 5px 0;
            color: #333;
            font-size: 14px;
            line-height: 1.4;
        }
        
        .dev-popup strong {
            color: #2196F3;
        }
        
        .dev-links {
            margin-top: 10px;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        
        .dev-link {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #2196F3;
            text-decoration: none;
            font-size: 13px;
            transition: color 0.2s;
        }
        
        .dev-link:hover {
            color: #0d8aee;
            text-decoration: underline;
        }
        
        .dev-link i {
            font-size: 16px;
        }
        
        @keyframes slideUp {
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        @keyframes slideIn {
            from { transform: translateY(100%) translateX(0); opacity: 0; }
            to { transform: translateY(0) translateX(0); opacity: 1; }
        }
        
        @keyframes fadeOut {
            from { transform: translateY(0) translateX(0); opacity: 1; }
            to { transform: translateY(20px) translateX(0); opacity: 0; }
        }
        
        .btn-commander {
            transition: background-color 0.3s;
        }
    `;
    document.head.appendChild(style);
});

// Gestion du menu mobile
document.addEventListener('DOMContentLoaded', function() {
    const toggleMenu = document.querySelector('.toggle_menu');
    const menu = document.querySelector('header .menu');
    const menuLinks = document.querySelectorAll('header .menu a');
    const body = document.body;
    
    // Vérifier si on est sur mobile
    function isMobile() {
        return window.innerWidth <= 980; // Correspond à la même valeur que dans le CSS
    }

    // Fonction pour basculer le menu
    function toggleMobileMenu() {
        menu.classList.toggle('active');
        toggleMenu.classList.toggle('active');
        body.classList.toggle('menu-open');
    }

    // Gérer le clic sur le bouton du menu
    if (toggleMenu) {
        toggleMenu.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMobileMenu();
        });
    }

    // Gérer les clics sur les liens du menu
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Vérifier si c'est un lien d'ancrage
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Fermer le menu sur mobile
                    if (isMobile()) {
                        toggleMobileMenu();
                    }
                    
                    // Défilement fluide vers la section cible
                    window.scrollTo({
                        top: targetElement.offsetTop - 100, // Ajuster pour l'en-tête fixe
                        behavior: 'smooth'
                    });
                    
                    // Mettre à jour l'URL sans recharger la page
                    history.pushState(null, '', href);
                }
            }
            // Si ce n'est pas un lien d'ancrage, le comportement par défaut est conservé
        });
    });

    // Fermer le menu quand on clique en dehors
    document.addEventListener('click', function(e) {
        if (isMobile() && menu.classList.contains('active') && 
            !menu.contains(e.target) && 
            !toggleMenu.contains(e.target)) {
            toggleMobileMenu();
        }
    });

    // Gérer le redimensionnement de la fenêtre
    let resizeTimer;
    window.addEventListener('resize', function() {
        document.body.classList.add('resize-animation-stopper');
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            document.body.classList.remove('resize-animation-stopper');
        }, 400);

        // Désactiver le menu mobile si on passe en mode desktop
        if (window.innerWidth > 980) {
            menu.classList.remove('active');
            toggleMenu.classList.remove('active');
            body.classList.remove('menu-open');
        }
    });
});

// Gestion du formulaire de réservation
// Fonction pour le défilement personnalisé vers les sections
function smoothScrollTo(target) {
    const headerHeight = document.querySelector('header').offsetHeight;
    const targetElement = document.querySelector(target);
    
    if (targetElement) {
        // Ajout d'un décalage de 200px vers le bas pour ne pas être tout en haut
        const offset = 200; // 200px de décalage vers le bas
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = targetPosition - headerHeight + offset; // Défilement 200px plus bas

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Gestion des clics sur les liens du menu
document.addEventListener('DOMContentLoaded', function() {
    // Gestion des clics sur les liens du menu
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Vérifier si c'est un lien d'ancrage
            if (href !== '#' && href.startsWith('#')) {
                e.preventDefault();
                smoothScrollTo(href);
                
                // Fermer le menu mobile si ouvert
                const toggleMenu = document.querySelector('.toggle_menu');
                const menu = document.querySelector('.menu');
                if (toggleMenu && menu && menu.classList.contains('active')) {
                    toggleMenu.classList.remove('active');
                    menu.classList.remove('active');
                }
            }
        });
    });
    
    // Mettre à jour la date minimale pour la réservation (aujourd'hui)
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }

    // Gestion de la soumission du formulaire
    const reservationForm = document.getElementById('reservationForm');
    if (reservationForm) {
        reservationForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Afficher un indicateur de chargement
            const submitButton = document.getElementById('btn-reservation');
            const originalButtonText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
            
            try {
                const formData = new FormData(reservationForm);
                const response = await fetch(reservationForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Succès
                    notificationManager.showNotification('Votre réservation a bien été envoyée ! Nous vous contacterons bientôt pour confirmer.', {
                        type: 'success',
                        duration: 5000
                    });
                    reservationForm.reset();
                } else {
                    // Erreur du serveur
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Une erreur est survenue lors de l\'envoi du formulaire.');
                }
            } catch (error) {
                // Erreur réseau ou autre
                console.error('Erreur:', error);
                notificationManager.showNotification(error.message || 'Une erreur est survenue. Veuillez réessayer plus tard.', {
                    type: 'error',
                    duration: 5000
                });
            } finally {
                // Réactiver le bouton
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
            }
        });
    }

    // Validation en temps réel des champs
    const formInputs = document.querySelectorAll('#reservationForm input, #reservationForm textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.checkValidity()) {
                this.classList.remove('invalid');
                this.classList.add('valid');
            } else {
                this.classList.remove('valid');
                this.classList.add('invalid');
            }
        });
    });
});
