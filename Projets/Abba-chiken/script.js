// Gestion des boutons "Commander"
document.querySelectorAll('.btn-commander').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Récupérer le nom du produit
        const productName = this.closest('.dish').querySelector('p').textContent.trim();
        
        // Créer la notification
        const notification = document.createElement('div');
        notification.className = 'notification-popup';
        
        // Contenu de la notification
        const notificationContent = document.createElement('div');
        notificationContent.className = 'notification-content';
        
        // Icône de validation
        const icon = document.createElement('i');
        icon.className = 'fas fa-check-circle';
        icon.style.color = '#0cd693'; // Couleur verte du site
        icon.style.fontSize = '20px';
        notificationContent.appendChild(icon);
        
        // Texte de confirmation
        const text = document.createElement('span');
        text.textContent = `${productName} commandé avec succès !`;
        notificationContent.appendChild(text);
        
        // Bouton de réservation
        const btnReservation = document.createElement('button');
        btnReservation.className = 'btn-reservation';
        btnReservation.innerHTML = '<i class="fas fa-calendar-check"></i> Réserver une table';
        
        // Gestion du clic sur le bouton de réservation
        btnReservation.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Fermer la notification
            notification.style.animation = 'fadeOut 0.5s ease-out';
            setTimeout(() => {
                notification.remove();
            }, 500);
            
            // Faire défiler jusqu'à la section de réservation
            const reservationSection = document.getElementById('reservation');
            if (reservationSection) {
                // Ajouter une classe pour indiquer que c'est un défilement programmé
                document.body.classList.add('smooth-scroll');
                
                // Faire défiler jusqu'à la section
                reservationSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Retirer la classe après le défilement
                setTimeout(() => {
                    document.body.classList.remove('smooth-scroll');
                }, 1000);
                
                // Mettre en surbrillance la section de réservation
                reservationSection.style.transition = 'all 0.5s ease';
                reservationSection.style.boxShadow = '0 0 0 4px rgba(12, 214, 147, 0.5)';
                
                // Retirer la surbrillance après 2 secondes
                setTimeout(() => {
                    reservationSection.style.boxShadow = 'none';
                }, 2000);
            }
        });
        
        // Ajout des éléments à la notification
        notification.appendChild(notificationContent);
        notification.appendChild(btnReservation);
        
        // Ajout au body
        document.body.appendChild(notification);
        
        // Fermer la notification au clic sur le bouton
        btnReservation.addEventListener('click', function() {
            notification.style.animation = 'fadeOut 0.5s ease-out';
            setTimeout(() => {
                notification.remove();
            }, 500);
        });
        
        // Animation du bouton
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="fas fa-check"></i> Commandé !';
        this.style.backgroundColor = '#0ab57d';
        
        // Réinitialisation du bouton après 2 secondes
        setTimeout(() => {
            this.innerHTML = originalText;
            this.style.backgroundColor = '#0cd693';
        }, 2000);
        
        // Suppression automatique après 3 secondes
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.5s ease-out';
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 3000);
    });
});

// Gestion du clic sur le bouton de réservation
document.addEventListener('DOMContentLoaded', function() {
    const reservationForm = document.querySelector('#reservation form');
    const reservationBtn = document.getElementById('btn-reservation');
    
    if (reservationForm) {
        reservationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Créer la notification
            const notification = document.createElement('div');
            notification.className = 'notification-popup';
            
            // Contenu de la notification
            notification.innerHTML = `
                <div class="notification-content">
                    <i class="fas fa-check-circle" style="color: #0cd693; font-size: 20px;"></i>
                    <span>Votre demande de réservation a bien été envoyée !</span>
                </div>
                <p style="margin: 10px 0 0 0; font-size: 0.9em; color: #666;">
                    Nous vous contacterons bientôt pour confirmer votre réservation.
                </p>
            `;
            
            // Ajouter la notification au body
            document.body.appendChild(notification);
            
            // Suppression automatique après 5 secondes
            setTimeout(() => {
                notification.style.animation = 'fadeOut 0.5s ease-out';
                setTimeout(() => {
                    notification.remove();
                }, 500);
            }, 5000);
            
            // Réinitialiser le formulaire
            this.reset();
        });
    }
    
    // Gestion du menu responsive
    const smallMenu = document.querySelector('.toggle_menu');
    const menu = document.querySelector('.menu');
    
    if (smallMenu && menu) {
        smallMenu.addEventListener('click', function() {
            smallMenu.classList.toggle('active');
            menu.classList.toggle('responsive');
        });
    }
});
