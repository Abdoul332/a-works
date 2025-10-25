const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Vérifier si ImageMagick est installé
try {
    execSync('magick -version');
} catch (e) {
    console.error('ImageMagick doit être installé pour optimiser les images.');
    console.log('Téléchargez-le depuis: https://imagemagick.org/script/download.php');
    process.exit(1);
}

// Créer le dossier pour les images optimisées
const optimizedDir = path.join(__dirname, 'img', 'optimized');
if (!fs.existsSync(optimizedDir)) {
    fs.mkdirSync(optimizedDir, { recursive: true });
}

// Fonction pour optimiser une image
function optimizeImage(filePath) {
    const fileName = path.basename(filePath);
    const ext = path.extname(fileName).toLowerCase();
    const nameWithoutExt = path.basename(fileName, ext);
    
    // Chemin de sortie pour l'image optimisée
    const outputPath = path.join(optimizedDir, `${nameWithoutExt}${ext}`);
    
    try {
        // Commande d'optimisation avec ImageMagick
        let command;
        
        if (['.jpg', '.jpeg'].includes(ext)) {
            command = `magick "${filePath}" -sampling-factor 4:2:0 -strip -quality 85 -interlace JPEG -colorspace sRGB "${outputPath}"`;
        } else if (ext === '.png') {
            command = `magick "${filePath}" -strip -quality 85 -define png:compression-level=9 -define png:format=8 -define png:color-type=6 -define png:bit-depth=8 "${outputPath}"`;
        } else {
            console.log(`Format non pris en charge: ${filePath}`);
            return;
        }
        
        execSync(command);
        
        // Vérifier la taille du fichier optimisé
        const originalSize = fs.statSync(filePath).size;
        const optimizedSize = fs.statSync(outputPath).size;
        const saved = ((originalSize - optimizedSize) / originalSize * 100).toFixed(2);
        
        console.log(`Optimisé: ${fileName} - Économie: ${saved}% (${(originalSize/1024).toFixed(2)}KB -> ${(optimizedSize/1024).toFixed(2)}KB)`);
        
        // Créer une version WebP
        if (['.jpg', '.jpeg', '.png'].includes(ext)) {
            const webpPath = path.join(optimizedDir, `${nameWithoutExt}.webp`);
            const webpCommand = `magick "${filePath}" -quality 80 -define webp:method=6 -define webp:auto-filter=true "${webpPath}"`;
            execSync(webpCommand);
            
            const webpSize = fs.statSync(webpPath).size;
            const savedWebp = ((originalSize - webpSize) / originalSize * 100).toFixed(2);
            console.log(`  → WebP créé: ${(webpSize/1024).toFixed(2)}KB (${savedWebp}% d'économie)`);
        }
        
    } catch (error) {
        console.error(`Erreur lors de l'optimisation de ${filePath}:`, error.message);
    }
}

// Parcourir le dossier des images
const imgDir = path.join(__dirname, 'img');
const extensions = ['.jpg', '.jpeg', '.png'];

fs.readdir(imgDir, (err, files) => {
    if (err) {
        console.error('Erreur lors de la lecture du dossier img:', err);
        return;
    }
    
    files.forEach(file => {
        const ext = path.extname(file).toLowerCase();
        if (extensions.includes(ext)) {
            optimizeImage(path.join(imgDir, file));
        }
    });
    
    console.log('\nOptimisation terminée !');
    console.log(`Les images optimisées sont disponibles dans le dossier: ${optimizedDir}`);
});
