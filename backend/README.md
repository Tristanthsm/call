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
- `GET /experts` : liste filtrable (`q`, `statut`, `tarif_max`, `note_min`).
- `GET /experts/:id` : détail d’un expert.
- `PATCH /experts/:id/statut` : change le statut en temps réel.
- `POST /calls` : démarre un appel immédiat, crée une pré-autorisation simulée.
- `PATCH /calls/:id/fin` : clôture l’appel, capture le paiement réel et calcule le remboursement.
- `POST /reviews` : ajoute un avis après un appel terminé et recalcule la note moyenne.

Les données sont stockées en mémoire pour permettre des tests rapides et un reset complet via
`GET /reset-fixtures`.

## Tests

```bash
cd backend
npm test
```

Les tests s’appuient sur `node:test` et couvrent la santé, les filtres d’experts,
le flux complet d’appel (pré-autorisation, capture, remboursement) et la mise à jour des notes.
