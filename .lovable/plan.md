
# EduMali — Plateforme Éducative Malienne 🇲🇱

## Design System
- **Dark mode** par défaut avec fond `#0A0A0A`
- Couleurs : Vert Mali `#1B6B3A`, Or `#F5C518`
- Police Inter, style minimal inspiré Discord/Notion
- Mobile-first, composants réutilisables

## Pages (12 routes)
1. **`/`** — Accueil avec hero, stats, sections annales/forum/orientation
2. **`/ressources`** — Bibliothèque d'annales avec filtres (matière, série, année) et recherche
3. **`/ressources/:id`** — Détail annale avec téléchargement (limite 5/jour pour Free)
4. **`/forum`** — Liste des posts avec recherche, tri par votes/date
5. **`/forum/:id`** — Post détaillé avec réponses et votes
6. **`/orientation`** — Liste établissements avec filtres par ville
7. **`/orientation/:id`** — Détail établissement avec filières proposées
8. **`/calendrier`** — Calendrier académique avec événements à venir
9. **`/premium`** — Page d'offre Premium (comparaison Free vs Premium)
10. **`/compte`** — Dashboard utilisateur (profil, historique téléchargements, badge premium)
11. **`/connexion`** — Login (email/password)
12. **`/inscription`** — Signup

## Base de données Supabase (migrations)
- `profiles` (id, username, avatar_url, created_at) — sans is_premium
- `subscriptions` (user_id, plan, active, expires_at) — statut premium sécurisé
- `annales` (titre, matiere, serie, annee, fichier_url, telechargements)
- `forum_posts` (user_id, titre, body, votes)
- `forum_answers` (post_id, user_id, body)
- `etablissements` (nom, ville, description)
- `filieres` (etablissement_id, nom, duree, description)
- `calendrier` (titre, date_debut, type)
- `download_logs` (user_id, annale_id, downloaded_at) — pour limiter les 5/jour
- RLS policies sur toutes les tables

## Composants partagés
- `Navbar` — navigation responsive avec menu mobile
- `Footer` — liens et crédits
- `SearchBar` — recherche réutilisable
- `ResourceCard`, `ForumPostCard`, `EtablissementCard` — cartes
- `PremiumBadge` — indicateur premium
- `AuthGuard` — protection des routes authentifiées

## Fonctionnalités clés
- Auth Supabase (signup/login/logout)
- Upload de fichiers annales vers Supabase Storage
- Téléchargement avec limite 5/jour (vérification via `download_logs`)
- Forum complet : créer post, répondre, voter
- Filtres et recherche sur ressources, forum, orientation
- Page Premium avec comparaison des offres
- Dashboard utilisateur avec statistiques

## Architecture
- React Query pour le data fetching
- Supabase client intégré
- Context Auth pour l'état utilisateur
- Routes protégées pour /compte et actions authentifiées
