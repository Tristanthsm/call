const { randomUUID, randomBytes, scryptSync, timingSafeEqual } = require('crypto');

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
let users = [];
let sessions = [];

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
  get users() {
    return users;
  },
  get sessions() {
    return sessions;
  },
};

function resetData() {
  experts = baseExperts.map((expert) => ({ ...expert }));
  calls = [];
  reviews = [];
  users = [];
  sessions = [];
}

function sanitizeUser(user) {
  if (!user) return null;
  // Retirer les informations sensibles
  const { passwordHash, passwordSalt, ...publicUser } = user;
  return publicUser;
}

function hashPassword(password, salt = randomBytes(16).toString('hex')) {
  const hash = scryptSync(password, salt, 64).toString('hex');
  return { hash, salt };
}

function createUser({ email, password, role = 'client', fullName = '' }) {
  const normalizedEmail = email?.toLowerCase();
  if (!normalizedEmail) {
    throw new Error('Email requis');
  }
  if (!password || password.length < 8) {
    throw new Error('Mot de passe trop court (8 caractères minimum).');
  }
  const existing = users.find((user) => user.email === normalizedEmail);
  if (existing) {
    throw new Error('Email déjà enregistré.');
  }

  const { hash, salt } = hashPassword(password);
  const user = {
    id: randomUUID(),
    email: normalizedEmail,
    role,
    fullName,
    passwordHash: hash,
    passwordSalt: salt,
    createdAt: new Date().toISOString(),
    lastLoginAt: null,
  };

  users.push(user);
  return sanitizeUser(user);
}

function authenticateUser(email, password) {
  const normalizedEmail = email?.toLowerCase();
  const user = users.find((item) => item.email === normalizedEmail);
  if (!user || !password) {
    return null;
  }

  const hash = scryptSync(password, user.passwordSalt, 64).toString('hex');
  const isMatch = timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(user.passwordHash, 'hex'));
  if (!isMatch) {
    return null;
  }

  user.lastLoginAt = new Date().toISOString();
  const token = randomUUID();
  sessions.push({ token, userId: user.id, createdAt: new Date().toISOString() });

  return { user: sanitizeUser(user), token };
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
  createUser,
  authenticateUser,
  sanitizeUser,
};
