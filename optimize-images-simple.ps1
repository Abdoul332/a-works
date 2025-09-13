# Script d'optimisation d'images simple
# Convertit les images en WebP avec ImageMagick

# Configuration
$imgDir = Join-Path $PSScriptRoot "asset\img"
$outputDir = Join-Path $imgDir "optimized"
$quality = 80

# Créer le dossier de sortie s'il n'existe pas
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}

# Vérifier si ImageMagick est installé
function Test-ImageMagick {
    try {
        Get-Command magick -ErrorAction Stop
        return $true
    } catch {
        return $false
    }
}

# Convertir une image en WebP
function Convert-ToWebP {
    param (
        [string]$inputFile,
        [string]$outputFile,
        [int]$width = 0
    )
    
    try {
        $resize = if ($width -gt 0) { "-resize ${width}x" } else { "" }
        & magick $inputFile $resize -quality $quality $outputFile
        return $?
    } catch {
        Write-Host "Erreur lors de la conversion de $inputFile" -ForegroundColor Red
        return $false
    }
}

# Programme principal
Write-Host "=== Optimisation d'images pour le web ===" -ForegroundColor Magenta

# Vérifier ImageMagick
if (-not (Test-ImageMagick)) {
    Write-Host "ImageMagick n'est pas installé. Veuillez l'installer depuis https://imagemagick.org/" -ForegroundColor Red
    exit 1
}

# Vérifier le dossier des images
if (-not (Test-Path $imgDir)) {
    Write-Host "Le dossier d'images n'existe pas : $imgDir" -ForegroundColor Red
    exit 1
}

# Récupérer les images
$images = Get-ChildItem -Path $imgDir -Include *.jpg, *.jpeg, *.png -Recurse

if ($images.Count -eq 0) {
    Write-Host "Aucune image à optimiser trouvée dans $imgDir" -ForegroundColor Yellow
    exit 0
}

Write-Host "`nOptimisation de $($images.Count) images..." -ForegroundColor Cyan

$successCount = 0
foreach ($image in $images) {
    $outputFile = Join-Path $outputDir "$($image.BaseName).webp"
    Write-Host "Traitement de $($image.Name)..." -ForegroundColor Cyan
    
    if (Convert-ToWebP -inputFile $image.FullName -outputFile $outputFile) {
        Write-Host "✓ Converti en WebP" -ForegroundColor Green
        $successCount++
    } else {
        Write-Host "✗ Échec de la conversion" -ForegroundColor Red
    }
}

Write-Host "`nOptimisation terminée !" -ForegroundColor Green
Write-Host "$successCount/$($images.Count) images optimisées avec succès" -ForegroundColor Cyan
Write-Host "Les images optimisées sont disponibles dans : $outputDir" -ForegroundColor Cyan
