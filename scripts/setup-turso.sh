#!/bin/bash
# Run this once to set up Turso for HIFZ Quran Oasis
set -e

echo "🕌 Setting up Turso database for HIFZ Quran Oasis..."
echo ""

# Auth
turso auth login

# Create DB
turso db create hifz-quran 2>/dev/null || echo "DB already exists"

echo ""
echo "Database URL:"
TURSO_URL=$(turso db show hifz-quran --url)
echo "  $TURSO_URL"

echo ""
echo "Creating auth token..."
TURSO_TOKEN=$(turso db tokens create hifz-quran)
echo "  $TURSO_TOKEN"

echo ""
echo "========================================="
echo "Add these to Vercel:"
echo "  vercel env add TURSO_DATABASE_URL"
echo "    Value: $TURSO_URL"
echo ""
echo "  vercel env add TURSO_AUTH_TOKEN"
echo "    Value: $TURSO_TOKEN"
echo ""
echo "  vercel env add DATABASE_URL"
echo "    Value: $TURSO_URL"
echo "========================================="

echo ""
echo "Pushing schema to Turso..."
TURSO_DATABASE_URL="$TURSO_URL" TURSO_AUTH_TOKEN="$TURSO_TOKEN" DATABASE_URL="$TURSO_URL?authToken=$TURSO_TOKEN" npx prisma db push --accept-data-loss

echo ""
echo "✅ Done! Database is ready."
