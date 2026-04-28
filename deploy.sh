#!/bin/bash
# Deploy script for La Redoute SARL-U
# Run this on the server after git pull

set -e

echo "=== La Redoute SARL-U Deploy Script ==="
echo ""

# 1. Create .env with absolute DATABASE_URL path
echo "[1/7] Configuring .env..."
cat > .env << 'EOF'
DATABASE_URL=file:/var/www/laredoutesarl/db/custom.db
ADMIN_PASSWORD=Antoine@228
EOF
echo "  ✅ .env configured with absolute DB path"

# 2. Ensure db directory exists
echo "[2/7] Ensuring db directory exists..."
mkdir -p db
echo "  ✅ db directory ready"

# 3. Ensure logs directory exists
echo "[3/7] Ensuring logs directory exists..."
mkdir -p logs
echo "  ✅ logs directory ready"

# 4. Install dependencies
echo "[4/7] Installing dependencies..."
bun install
echo "  ✅ Dependencies installed"

# 5. Push database schema
echo "[5/7] Pushing database schema..."
bun run db:push || {
  echo "  ⚠️  db:push failed, trying with explicit env..."
  DATABASE_URL="file:/var/www/laredoutesarl/db/custom.db" bun run db:push
}
echo "  ✅ Database schema pushed"

# 6. Build the project
echo "[6/7] Building project..."
bun run build
echo "  ✅ Build complete"

# 7. Copy necessary files to standalone directory
echo "[7/7] Copying files to standalone directory..."
cp .env .next/standalone/
cp -r prisma .next/standalone/
mkdir -p .next/standalone/db
[ -f db/custom.db ] && cp db/custom.db .next/standalone/db/
echo "  ✅ Files copied"

echo ""
echo "=== Deploy complete! ==="
echo ""
echo "Now restart PM2 with the new ecosystem config:"
echo "  pm2 delete laredoutesarl 2>/dev/null || true"
echo "  pm2 start ecosystem.config.js"
echo "  pm2 save"
echo ""
echo "Then seed the database:"
echo "  curl -X POST https://laredoutesarl.com/api/seed"
echo ""
echo "Check health:"
echo "  curl https://laredoutesarl.com/api/health"
