// Gestion des boutons "Commander"
document.addEventListener('DOMContentLoaded', function() {
    // Fonction pour afficher les notifications avec bouton de réservation
    function showNotification(message, showReservationButton = true) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        
        // Contenu de la notification
        const content = document.createElement('div');
        content.className = 'notification-content';
        content.textContent = message;
        notification.appendChild(content);
        
        // Ajouter le bouton de réservation si demandé
        if (showReservationButton) {
            const reserveBtn = document.createElement('button');
            reserveBtn.className = 'btn-reservation';
            reserveBtn.innerHTML = '<i class="fas fa-calendar-check"></i> Réserver une table';
            
            // Gestion du clic sur le bouton de réservation
            reserveBtn.addEventListener('click', function() {
                scrollToReservation();
                // Fermer la notification après le clic
                closeNotification(notification);
            });
            
            notification.appendChild(reserveBtn);
        }
        
        document.body.appendChild(notification);
        
        // Supprimer la notification après 5 secondes
        setTimeout(() => {
            closeNotification(notification);
        }, 5000);
        
        return notification;
    }
    
    // Fonction pour fermer une notification
    function closeNotification(notification) {
        if (!notification.parentNode) return;
        
        notification.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        notification.style.borderLeft = '4px solid #2196F3';
        notification.querySelector('.notification-content').style.color = '#2196F3';
        notification.style.color = '#2196F3';
        notification.style.animation = 'fadeOut 0.5s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 500);
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
            background: #2196F3;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            animation: slideIn 0.3s ease-out forwards;
            max-width: 300px;
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
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes fadeOut {
            from { transform: translateY(0); opacity: 1; }
            to { transform: translateY(20px); opacity: 0; }
        }
        
        .btn-commander {
            transition: background-color 0.3s;
        }
    `;
    document.head.appendChild(style);
});
