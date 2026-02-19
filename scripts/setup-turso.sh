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
# Prisma's sqlite provider can't use libsql:// URLs directly.
# Dump schema from local SQLite and push via turso CLI.
sqlite3 prisma/dev.db ".schema" > /tmp/hifz-schema.sql
sed -i '' 's/CREATE UNIQUE INDEX/CREATE UNIQUE INDEX IF NOT EXISTS/g' /tmp/hifz-schema.sql
turso db shell hifz-quran < /tmp/hifz-schema.sql

echo ""
echo "✅ Done! Database is ready."
