#!/usr/bin/env bash
# Dizy — installation et démarrage en une commande.  Usage : bash setup.sh
set -e
cd "$(dirname "$0")"
echo "——— Dizy ———"
if [ ! -f .env ]; then
  cp .env.example .env
  echo "• .env créé — remplissez les 3 clés Supabase (URL, ANON_KEY, SERVICE_ROLE_KEY)."
fi
if [ ! -d node_modules ]; then
  echo "• Installation des dépendances…"
  npm install
fi
echo
echo "✓ Démarrage sur http://localhost:3000"
npm run dev
