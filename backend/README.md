# Backend Nexbuzzer (MVP)

API HTTP minimaliste sans dépendances externes pour orchestrer les appels audio/vidéo facturés à la minute,
la pré-autorisation de paiement simulée, les avis et le statut des experts.

## Démarrage

```bash
cd backend
cp .env.example .env # facultatif : pour surcharger le port ou la commission
npm start
```

L’API démarre par défaut sur `http://localhost:4000`.

## Endpoints clés

- `GET /health` : statut de l’API.
- `POST /auth/signup` : inscription email/mot de passe (MVP en mémoire, mots de passe hashés avec scrypt).
- `POST /auth/login` : connexion et émission d’un token de session en mémoire.
- `GET /experts` : liste filtrable (`q`, `statut`, `tarif_max`, `note_min`).
- `GET /experts/:id` : détail d’un expert.
- `PATCH /experts/:id/statut` : change le statut en temps réel.
- `POST /calls` : démarre un appel immédiat, crée une pré-autorisation simulée.
- `PATCH /calls/:id/fin` : clôture l’appel, capture le paiement réel et calcule le remboursement.
- `POST /reviews` : ajoute un avis après un appel terminé et recalcule la note moyenne.

Les données sont stockées en mémoire pour permettre des tests rapides et un reset complet via
`GET /reset-fixtures`.

## Supabase / SQL

Le fichier `backend/sql/auth.sql` contient les instructions SQL à exécuter dans le projet Supabase
`https://btnruneapntfneomhvao.supabase.co` :

- création de la table `profiles` liée à `auth.users` ;
- table `sessions` minimaliste pour tracer les connexions ;
- politiques RLS pour que chaque utilisateur ne lise/écrive que ses propres données ;
- trigger `on_auth_user_created` pour peupler `profiles` automatiquement.

## Tests

```bash
cd backend
npm test
```

Les tests s’appuient sur `node:test` et couvrent la santé, les filtres d’experts,
le flux complet d’appel (pré-autorisation, capture, remboursement) et la mise à jour des notes.
