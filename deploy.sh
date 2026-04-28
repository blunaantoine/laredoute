#!/bin/bash
# Deploy script for La Redoute SARL-U
# Run this on the server after git pull

set -e

echo "=== La Redoute SARL-U Deploy Script ==="
echo ""

# 1. Create .env if it doesn't exist
if [ ! -f .env ]; then
  echo "[1/6] Creating .env file..."
  echo "DATABASE_URL=file:./db/custom.db" > .env
  echo "  ✅ .env created"
else
  echo "[1/6] .env already exists ✅"
fi

# 2. Ensure db directory exists
echo "[2/6] Ensuring db directory exists..."
mkdir -p db
echo "  ✅ db directory ready"

# 3. Install dependencies
echo "[3/6] Installing dependencies..."
bun install
echo "  ✅ Dependencies installed"

# 4. Push database schema
echo "[4/6] Pushing database schema..."
DATABASE_URL=file:./db/custom.db bun run db:push || {
  echo "  ⚠️  db:push failed, trying with explicit env..."
  DATABASE_URL="file:./db/custom.db" npx prisma db push
}
echo "  ✅ Database schema pushed"

# 5. Build the project
echo "[5/6] Building project..."
bun run build
echo "  ✅ Build complete"

# 6. Copy .env and db to standalone directory
echo "[6/6] Copying files to standalone directory..."
cp .env .next/standalone/ 2>/dev/null || true
cp -r prisma .next/standalone/ 2>/dev/null || true
mkdir -p .next/standalone/db
[ -f db/custom.db ] && cp db/custom.db .next/standalone/db/ || true
echo "  ✅ Files copied"

echo ""
echo "=== Deploy complete! ==="
echo ""
echo "Now restart the server with:"
echo "  pm2 restart laredoutesarl"
echo ""
echo "Then visit https://laredoutesarl.com/api/seed to seed the database"
echo "And https://laredoutesarl.com/api/health to check the server status"
