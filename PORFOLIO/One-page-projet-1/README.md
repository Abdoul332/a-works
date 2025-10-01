# Landing Page - Qu'est-ce qu'une Landing Page ?

Une landing page moderne, professionnelle et éducative qui explique ce qu'est une landing page, à quoi elle sert et dans quels cas l'utiliser. Ce projet est conçu pour être à la fois pédagogique et visuellement attrayant, avec des animations fluides et une expérience utilisateur optimale.

## Fonctionnalités

- Design moderne et responsive
- Animations fluides avec AOS (Animate On Scroll)
- Navigation fluide avec menu mobile
- Barre de progression de défilement
- Effets de survol interactifs
- Optimisation des performances
- Compatible avec tous les navigateurs modernes
- Accessibilité (WCAG)

## Structure du projet

```
landing-page/
├── assets/
│   └── images/           # Images et illustrations
├── css/
│   └── style.css         # Feuille de style principale
├── js/
│   └── main.js           # Scripts JavaScript
├── index.html            # Fichier HTML principal
└── README.md             # Ce fichier
```

## Technologies utilisées

- HTML5
- CSS3 (Flexbox, Grid, Variables CSS)
- JavaScript (ES6+)
- [AOS Library](https://michalsnik.github.io/aos/) - Pour les animations au défilement
- [Font Awesome](https://fontawesome.com/) - Pour les icônes
- [Google Fonts](https://fonts.google.com/) - Pour la typographie (Poppins)

## Installation

1. Clonez le dépôt :
   ```bash
   git clone [URL_DU_DEPOT]
   ```

2. Ouvrez le fichier `index.html` dans votre navigateur préféré.

## Personnalisation

### Couleurs

Les couleurs principales peuvent être modifiées dans le fichier `css/style.css` en mettant à jour les variables CSS dans la section `:root` :

```css
:root {
    --primary-color: #4361ee;
    --secondary-color: #3f37c9;
    --accent-color: #4cc9f0;
    --dark-color: #1a1a2e;
    --light-color: #f8f9fa;
    --gray-color: #6c757d;
    --light-gray: #e9ecef;
}
```

### Police

La police principale est Poppins de Google Fonts. Vous pouvez la changer en modifiant le lien dans le `<head>` du fichier `index.html` :

```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

## Optimisation des performances

- Chargement paresseux des images
- Minification des ressources en production
- Utilisation de CSS Grid et Flexbox pour la mise en page
- Animations optimisées pour les performances

## Accessibilité

- Navigation au clavier
- Contraste des couleurs conforme aux normes WCAG
- Attributs ARIA pour une meilleure accessibilité
- Prise en charge de la réduction des mouvements

## Compatibilité

- Compatible avec tous les navigateurs modernes (Chrome, Firefox, Safari, Edge)
- Design responsive pour mobile, tablette et desktop
- Rétrocompatible avec les navigateurs plus anciens (avec dégradation élégante)

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## Auteur

[Votre Nom] - [Votre Email]

## Remerciements

- [AOS Library](https://michalsnik.github.io/aos/)
- [Font Awesome](https://fontawesome.com/)
- [Google Fonts](https://fonts.google.com/)
- [Unsplash](https://unsplash.com/) pour les images d'exemple
