#!/bin/bash
# Script d'ajout d'articles WhatsApp au site La Redoute SARL-U
# Utilisation: bash add-articles.sh
#
# PREREQUIS:
#   1. Les images WhatsApp doivent etre dans le meme repertoire que ce script
#      (IMG-20260530-WA0010.jpg a WA0017.jpg)
#   2. Le serveur Next.js doit tourner sur localhost:3000
#
# Ce script:
#   1. Se connecte a l'admin pour obtenir un cookie d'auth
#   2. Uploade chaque image via /api/upload
#   3. Cree le produit via /api/products

set -e

# Configuration
BASE_URL="http://localhost:3000"
ADMIN_PASSWORD="Antoine@228"

# Verifier que le serveur est accessible
echo "Verification du serveur..."
if ! curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/health" | grep -q "200"; then
    echo "ERREUR: Le serveur n'est pas accessible sur $BASE_URL"
    echo "Assurez-vous que PM2 est demarre: pm2 start ecosystem.config.js"
    exit 1
fi

echo "Serveur OK!"

# Se connecter et recuperer le cookie d'authentification
echo "Connexion admin..."
LOGIN_RESPONSE=$(curl -s -c /tmp/laredoute-cookies.txt -b /tmp/laredoute-cookies.txt \
    -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"password\": \"$ADMIN_PASSWORD\"}")

if ! echo "$LOGIN_RESPONSE" | grep -q '"success":true'; then
    echo "ERREUR: Echec de connexion admin"
    echo "Reponse: $LOGIN_RESPONSE"
    exit 1
fi

echo "Connexion reussie!"

# Definition des articles a ajouter
# Format: "fichier_image|categorie|sous_categorie|titre|description|variants"
declare -a ARTICLES=(
    "IMG-20260530-WA0010.jpg|pneus|automobile|Pneu Nouvelle Collection|Pneu de nouvelle collection, qualite superieure pour tous types de vehicules.|175/65 R14, 185/65 R15, 195/65 R15"
    "IMG-20260530-WA0011.jpg|huiles|automobile|Huile Moteur Premium|Huile moteur synthetique premium pour performance optimale et protection prolongee du moteur.|5W-30 4L, 5W-30 5L, 10W-40 4L"
    "IMG-20260530-WA0012.jpg|accessoires|automobile|Accessoire Auto Nouveau|Nouvel accessoire automobile de qualite professionnelle pour lentretien de votre vehicule.|Standard, Grand format"
    "IMG-20260530-WA0013.jpg|riz|agroalimentaire|Riz Premium Nouvelle Collection|Riz premium de nouvelle collection, grain long parfume pour une cuisine raffinee.|Sac 25kg, Sac 50kg"
    "IMG-20260530-WA0014.jpg|pates|agroalimentaire|Pates Alimentaires Premium|Pates alimentaires de qualite superieure, semoule de ble dur selectionnee.|Paquet 500g, Carton 10kg"
    "IMG-20260530-WA0015.jpg|huiles-alimentaires|agroalimentaire|Huile Alimentaire Premium|Huile de tournesol raffinee premium, idealement pour la cuisine et la friture.|Bidon 1L, Bidon 5L, Bidon 10L"
    "IMG-20260530-WA0016.jpg|pneus|automobile|Pneu Special Tout-Terrain|Pneu tout-terrain robuste pour SUV et vehicules 4x4, performance sur tous les types de routes.|225/65 R17, 235/65 R17, 255/60 R18"
    "IMG-20260530-WA0017.jpg|accessoires|automobile|Kit Entretien Auto|Kit complet dentretien automobile avec filtres, liquides et accessoires essentiels.|Kit Standard, Kit Premium"
)

# Compteurs
SUCCESS=0
FAILED=0
SKIPPED=0

echo ""
echo "=========================================="
echo "  Ajout des articles WhatsApp au site"
echo "=========================================="
echo ""

for ARTICLE in "${ARTICLES[@]}"; do
    IFS='|' read -r IMAGE_FILE CATEGORY SUBCATEGORY TITLE DESCRIPTION VARIANTS <<< "$ARTICLE"

    echo "--- Traitement: $TITLE ---"

    # Verifier si l'image existe
    if [ ! -f "$IMAGE_FILE" ]; then
        echo "  ATTENTION: Image $IMAGE_FILE non trouvee, passage au suivant"
        SKIPPED=$((SKIPPED + 1))
        continue
    fi

    # Etape 1: Uploader l'image
    echo "  Upload de $IMAGE_FILE..."
    UPLOAD_RESPONSE=$(curl -s -b /tmp/laredoute-cookies.txt \
        -X POST "$BASE_URL/api/upload" \
        -F "file=@$IMAGE_FILE" \
        -F "category=$CATEGORY")

    # Extraire l'URL de l'image uploadee
    IMAGE_URL=$(echo "$UPLOAD_RESPONSE" | grep -o '"url":"[^"]*"' | head -1 | sed 's/"url":"//;s/"//')

    if [ -z "$IMAGE_URL" ]; then
        echo "  ERREUR: Echec de l'upload"
        echo "  Reponse: $UPLOAD_RESPONSE"
        FAILED=$((FAILED + 1))
        continue
    fi

    echo "  Image uploadee: $IMAGE_URL"

    # Etape 2: Creer le produit
    echo "  Creation du produit..."
    PRODUCT_RESPONSE=$(curl -s -b /tmp/laredoute-cookies.txt \
        -X POST "$BASE_URL/api/products" \
        -H "Content-Type: application/json" \
        -d "{
            \"category\": \"$CATEGORY\",
            \"subcategory\": \"$SUBCATEGORY\",
            \"title\": \"$TITLE\",
            \"description\": \"$DESCRIPTION\",
            \"imageUrl\": \"$IMAGE_URL\",
            \"variants\": \"$VARIANTS\",
            \"order\": 50,
            \"isActive\": true
        }")

    if echo "$PRODUCT_RESPONSE" | grep -q '"id"'; then
        echo "  SUCCES: Produit cree!"
        SUCCESS=$((SUCCESS + 1))
    else
        echo "  ERREUR: Echec de la creation du produit"
        echo "  Reponse: $PRODUCT_RESPONSE"
        FAILED=$((FAILED + 1))
    fi

    echo ""
done

# Resume
echo "=========================================="
echo "  Resume de l'operation"
echo "=========================================="
echo "  Reussis:  $SUCCESS"
echo "  Echoues:  $FAILED"
echo "  Ignores:  $SKIPPED"
echo ""

# Nettoyage
rm -f /tmp/laredoute-cookies.txt

if [ $FAILED -gt 0 ]; then
    echo "Certains produits n'ont pas pu etre ajoutes. Verifiez les erreurs ci-dessus."
    exit 1
else
    echo "Tous les produits ont ete ajoutes avec succes!"
    echo ""
    echo "N'oubliez pas de redemarrer PM2 pour appliquer les changements:"
    echo "  pm2 restart laredoutesarl"
fi
