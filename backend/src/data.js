const { randomUUID } = require('crypto');

const baseExperts = [
  {
    id: 'exp-1',
    nom: 'Thomas',
    bio: 'Coach business spécialisé en stratégie et pricing.',
    video_presentation: 'https://cdn.example.com/videos/thomas.mp4',
    tarif_minute: 4,
    specialites: ['business', 'pricing', 'go-to-market'],
    badges: ['Vérifié'],
    statut: 'disponible_maintenant',
    note_moyenne: 4.8,
    nombre_avis: 12,
    duree_max_appel: 20,
    calendrier_url: 'https://calendly.com/thomas',
    nombre_appels: 145,
    taux_reponse: 0.96,
  },
  {
    id: 'exp-2',
    nom: 'Sarah',
    bio: 'Mentor produit et UX pour startups early stage.',
    video_presentation: 'https://cdn.example.com/videos/sarah.mp4',
    tarif_minute: 3,
    specialites: ['ux', 'produit', 'user research'],
    badges: ['Vérifié', 'Top Expert'],
    statut: 'hors_ligne',
    note_moyenne: 4.6,
    nombre_avis: 30,
    duree_max_appel: 30,
    calendrier_url: 'https://calendly.com/sarah',
    nombre_appels: 320,
    taux_reponse: 0.9,
  },
];

let experts = baseExperts.map((expert) => ({ ...expert }));
let calls = [];
let reviews = [];

const state = {
  get experts() {
    return experts;
  },
  get calls() {
    return calls;
  },
  get reviews() {
    return reviews;
  },
};

function resetData() {
  experts = baseExperts.map((expert) => ({ ...expert }));
  calls = [];
  reviews = [];
}

function createCall({ expertId, clientId, dureeMax }) {
  const call = {
    id: randomUUID(),
    expertId,
    clientId,
    startedAt: new Date().toISOString(),
    endedAt: null,
    dureeMax,
    dureeReelle: null,
    montantPreautorise: null,
    montantTotal: null,
    montantExpert: null,
    commissionPlateforme: null,
    statut: 'en_cours',
    preautorisationId: randomUUID(),
  };
  calls.push(call);
  return call;
}

function updateExpertRating(expertId) {
  const expertReviews = reviews.filter((review) => review.reviewed_id === expertId);
  if (expertReviews.length === 0) {
    return;
  }
  const noteMoyenne =
    expertReviews.reduce((total, review) => total + review.rating, 0) / expertReviews.length;
  const expertIndex = experts.findIndex((exp) => exp.id === expertId);
  if (expertIndex !== -1) {
    experts[expertIndex] = {
      ...experts[expertIndex],
      note_moyenne: Number(noteMoyenne.toFixed(2)),
      nombre_avis: expertReviews.length,
    };
  }
}

module.exports = {
  state,
  resetData,
  createCall,
  updateExpertRating,
};
