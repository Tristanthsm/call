# Nexbuzzer

Plateforme SaaS francophone permettant aux experts, coachs, mentors, créateurs de contenu et consultants de proposer des appels
audio/vidéo facturés à la minute, avec paiement flexible, profils enrichis et disponibilité instantanée.

## Contenu du dépôt

- `backend/` : API HTTP minimaliste en Node.js (sans dépendances externes) pour gérer profils experts,
  appels facturés à la minute, pré-autorisation/capture simulée et avis.

## Démarrage rapide du backend

```bash
cd backend
cp .env.example .env
npm start
```

Consultez `backend/README.md` pour la liste des endpoints et les instructions de tests.
