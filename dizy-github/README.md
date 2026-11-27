# Dizy — Marketplace numérique (Next.js + Supabase)

Accès aux données via l'API Supabase (supabase-js), pas de connexion Postgres directe.

## Démarrage
1. Dans Supabase → SQL Editor, exécuter le contenu de `supabase/schema.sql` (crée les tables).
2. Copier `.env.example` vers `.env` et remplir les 3 clés Supabase.
3. `npm install` puis `npm run dev` (ou `bash setup.sh`). → http://localhost:3000

## Sécurité
Le navigateur n'écrit jamais en base. Toutes les écritures passent par `/api`
avec la clé `service_role` côté serveur. RLS est activé sur toutes les tables.

## Structure
- `app/(public)/` — vitrine (accueil, catalogue, produit, boutique, panier, bibliothèque, aide…)
- `app/(auth)/` — connexion, inscription
- `app/dashboard/` — tableau de bord vendeur (abonnement 4000 DZD, activation)
- `app/admin/` — administration
- `app/api/` — points de terminaison serveur
- `lib/supabase/` — clients (navigateur, serveur, admin service_role)
- `supabase/schema.sql` — schéma de la base
