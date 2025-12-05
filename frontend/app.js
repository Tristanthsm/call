const categories = [
  { nom: 'Coachs', icon: '🧑‍💼', count: 245, slug: 'coaching' },
  { nom: 'Tech & Dev', icon: '💻', count: 189, slug: 'tech' },
  { nom: 'Business', icon: '📊', count: 312, slug: 'business' },
  { nom: 'Créateurs', icon: '🎨', count: 156, slug: 'creation' },
  { nom: 'Bien-être', icon: '🏥', count: 178, slug: 'bien-etre' },
  { nom: 'Juridique', icon: '⚖️', count: 93, slug: 'juridique' },
  { nom: 'Finance', icon: '💰', count: 124, slug: 'finance' },
  { nom: 'Langues', icon: '🌍', count: 87, slug: 'langues' },
];

const categoryKeywords = {
  coaching: ['coach', 'leadership', 'carrière', 'mindfulness', 'freelance'],
  tech: ['dev', 'engineer', 'cloud', 'sécurité', 'mlops', 'react', 'node'],
  business: ['business', 'product', 'pricing', 'strategy', 'growth'],
  creation: ['design', 'ux', 'création', 'prototypage', 'design sprint'],
  'bien-etre': ['stress', 'bien-être', 'mindfulness', 'sommeil'],
  juridique: ['juriste', 'rgpd', 'contrats', 'conformité'],
  finance: ['finance', 'bp', 'cashflow', 'reporting'],
  langues: ['langue', 'anglais', 'prononciation'],
};

const experts = [
  { id: 1, nom: 'Sophie Martin', metier: 'Coach carrière', photo: 'https://i.pravatar.cc/150?img=1', tarif: 3, note: 4.9, avis: 124, statut: 'disponible', bio: '15 ans d’accompagnement de managers et de reconversions.', badges: ['Vérifié', 'Top Expert', 'ICF'], specialites: ['Reconversion', 'Leadership', 'Confiance'], langue: 'Français, Anglais', ville: 'Paris, France' },
  { id: 2, nom: 'Thomas Dubois', metier: 'Développeur Senior', photo: 'https://i.pravatar.cc/150?img=12', tarif: 5, note: 5.0, avis: 89, statut: 'disponible', bio: 'Expert React/Node.js, mentor produit-tech pour scale-ups.', badges: ['Vérifié', 'Tech Lead'], specialites: ['React', 'Architecture', 'Mentorat'], langue: 'Français, Anglais', ville: 'Lyon, France' },
  { id: 3, nom: 'Julie Petit', metier: 'UX Designer', photo: 'https://i.pravatar.cc/150?img=5', tarif: 4, note: 4.8, avis: 156, statut: 'disponible', bio: 'Design systems, recherche utilisateur et ateliers sprint.', badges: ['Vérifié'], specialites: ['Design system', 'Tests utilisateurs', 'Facilitation'], langue: 'Français', ville: 'Nantes, France' },
  { id: 4, nom: 'Amine Salah', metier: 'Consultant Growth', photo: 'https://i.pravatar.cc/150?img=15', tarif: 3, note: 4.7, avis: 112, statut: 'bientot', bio: 'AB testing, acquisition payante et CRM performance.', badges: ['Vérifié', 'Top Expert'], specialites: ['AB testing', 'SEA', 'CRM'], langue: 'Français, Anglais', ville: 'Marseille, France' },
  { id: 5, nom: 'Claire Renault', metier: 'Coach leadership', photo: 'https://i.pravatar.cc/150?img=7', tarif: 6, note: 4.95, avis: 201, statut: 'disponible', bio: 'Leadership exécutif et coaching de comité de direction.', badges: ['Vérifié'], specialites: ['Leadership', 'Coaching exec', 'Feedback'], langue: 'Français', ville: 'Paris, France' },
  { id: 6, nom: 'Leo Martins', metier: 'Engineer Cloud', photo: 'https://i.pravatar.cc/150?img=20', tarif: 5, note: 4.9, avis: 143, statut: 'planning', bio: 'AWS, GCP, optimisation coûts et sécurité.', badges: ['Vérifié'], specialites: ['AWS', 'FinOps', 'Sécurité'], langue: 'Français, Anglais', ville: 'Luxembourg' },
  { id: 7, nom: 'Camille Roy', metier: 'Product Manager', photo: 'https://i.pravatar.cc/150?img=32', tarif: 4, note: 4.8, avis: 98, statut: 'disponible', bio: 'Discovery, roadmaps KPI-driven et facilitation.', badges: ['Vérifié'], specialites: ['Discovery', 'Priorisation', 'Go-to-market'], langue: 'Français', ville: 'Bordeaux, France' },
  { id: 8, nom: 'Lucas Perrin', metier: 'Data Scientist', photo: 'https://i.pravatar.cc/150?img=40', tarif: 5, note: 4.9, avis: 77, statut: 'disponible', bio: 'MLOps, métriques produit et modèles de scoring.', badges: ['Vérifié'], specialites: ['MLOps', 'Scoring', 'Analytics'], langue: 'Français, Anglais', ville: 'Paris, France' },
  { id: 9, nom: 'Nadia Ben', metier: 'Marketing B2B', photo: 'https://i.pravatar.cc/150?img=45', tarif: 3, note: 4.6, avis: 134, statut: 'bientot', bio: 'Positionnement, ABM et contenus à forte conversion.', badges: ['Vérifié'], specialites: ['ABM', 'Content', 'SEO'], langue: 'Français, Anglais', ville: 'Lille, France' },
  { id: 10, nom: 'Hugo Carpentier', metier: 'Coach Sales', photo: 'https://i.pravatar.cc/150?img=52', tarif: 4, note: 4.9, avis: 165, statut: 'disponible', bio: 'Playbooks SDR, closing et négociation grands comptes.', badges: ['Vérifié', 'Top Expert'], specialites: ['SDR', 'Closing', 'Playbooks'], langue: 'Français, Anglais', ville: 'Lyon, France' },
  { id: 11, nom: 'Mina Zhao', metier: 'Stratégie produit', photo: 'https://i.pravatar.cc/150?img=55', tarif: 6, note: 5.0, avis: 92, statut: 'disponible', bio: 'Product ops, packaging et pricing pour SaaS.', badges: ['Vérifié'], specialites: ['Pricing', 'Product ops', 'Packaging'], langue: 'Anglais, Français', ville: 'Londres, UK' },
  { id: 12, nom: 'Arnaud Lefèvre', metier: 'Juriste RGPD', photo: 'https://i.pravatar.cc/150?img=61', tarif: 4, note: 4.8, avis: 58, statut: 'disponible', bio: 'Mise en conformité RGPD et gouvernance des données.', badges: ['Vérifié'], specialites: ['RGPD', 'Contrats', 'Données'], langue: 'Français', ville: 'Paris, France' },
  { id: 13, nom: 'Sara Costa', metier: 'Coach bien-être', photo: 'https://i.pravatar.cc/150?img=64', tarif: 3, note: 4.7, avis: 102, statut: 'planning', bio: 'Gestion du stress, routines et équilibre pro/perso.', badges: ['Vérifié'], specialites: ['Stress', 'Sommeil', 'Mindfulness'], langue: 'Français, Portugais', ville: 'Lisbonne, Portugal' },
  { id: 14, nom: 'Daniel Kim', metier: 'Ingénieur Sécurité', photo: 'https://i.pravatar.cc/150?img=70', tarif: 7, note: 5.0, avis: 71, statut: 'disponible', bio: 'Audit sécurité, pentest et remédiations priorisées.', badges: ['Vérifié'], specialites: ['Sécurité', 'Pentest', 'IAM'], langue: 'Anglais', ville: 'Berlin, Allemagne' },
  { id: 15, nom: 'Élodie Garnier', metier: 'Consultante Finance', photo: 'https://i.pravatar.cc/150?img=75', tarif: 5, note: 4.85, avis: 88, statut: 'disponible', bio: 'Modèles financiers, BP investisseurs et cashflow.', badges: ['Vérifié'], specialites: ['BP', 'Cashflow', 'Reporting'], langue: 'Français', ville: 'Paris, France' },
  { id: 16, nom: 'Yanis Guérin', metier: 'Coach langues', photo: 'https://i.pravatar.cc/150?img=78', tarif: 2, note: 4.6, avis: 142, statut: 'disponible', bio: 'Sessions immersives anglais business et pitch.', badges: ['Vérifié'], specialites: ['Anglais', 'Pitch', 'Prononciation'], langue: 'Français, Anglais', ville: 'Montréal, Canada' },
  { id: 17, nom: 'Isabelle Noël', metier: 'Facilitatrice Design Sprint', photo: 'https://i.pravatar.cc/150?img=83', tarif: 4, note: 4.9, avis: 119, statut: 'bientot', bio: 'Workshops sprint, priorisation et prototypage rapide.', badges: ['Vérifié'], specialites: ['Design sprint', 'Ateliers', 'Prototypage'], langue: 'Français', ville: 'Bruxelles, Belgique' },
  { id: 18, nom: 'Marc Delcourt', metier: 'Coach freelance', photo: 'https://i.pravatar.cc/150?img=85', tarif: 3, note: 4.7, avis: 136, statut: 'disponible', bio: 'Positionnement freelance, pricing et closing direct.', badges: ['Vérifié'], specialites: ['Pricing', 'Closing', 'Positionnement'], langue: 'Français', ville: 'Toulouse, France' },
  { id: 19, nom: 'Priya Patel', metier: 'Consultante Data Gouvernance', photo: 'https://i.pravatar.cc/150?img=88', tarif: 6, note: 4.9, avis: 67, statut: 'planning', bio: 'Data lineage, catalogues et conformité multi-pays.', badges: ['Vérifié'], specialites: ['Data governance', 'Catalogues', 'Compliance'], langue: 'Anglais', ville: 'Dublin, Irlande' },
  { id: 20, nom: 'Alexandre Moreau', metier: 'Coach produit', photo: 'https://i.pravatar.cc/150?img=90', tarif: 4, note: 4.8, avis: 121, statut: 'disponible', bio: 'Stratégie produit, discovery continue et communication.', badges: ['Vérifié'], specialites: ['Roadmap', 'Discovery', 'Storytelling'], langue: 'Français', ville: 'Lyon, France' },
];

const testimonials = [
  { quote: "J'ai trouvé un coach en 2 minutes, appel instantané. Hyper efficace !", author: 'Marc D., Entrepreneur', rating: 5 },
  { quote: 'Tarifs clairs, disponibilité en direct, parfait pour résoudre un blocage technique.', author: 'Leïla K., CTO', rating: 5 },
  { quote: 'Les avis sont fiables et le paiement à la minute rassure pour tester.', author: 'Hassan B., Growth lead', rating: 4.8 },
];

const categoriesContainer = document.getElementById('category-grid');
const availableRow = document.getElementById('available-row');
const filterCategories = document.getElementById('filter-categories');
const searchResults = document.getElementById('search-results');
const pagination = document.getElementById('pagination');
const ratingRange = document.getElementById('rating-range');
const ratingValue = document.getElementById('rating-value');
const testimonialCard = document.getElementById('testimonial-card');
const testimonialDots = document.getElementById('testimonial-dots');

let currentTestimonial = 0;
let currentPage = 1;
const perPage = 9;

function renderCategories() {
  categoriesContainer.innerHTML = categories
    .map(
      (cat) => `<article class="expert-card" aria-label="${cat.nom}"><p class="icon">${cat.icon}</p><h4>${cat.nom}</h4><p class="muted">${cat.count} experts</p></article>`
    )
    .join('');

  filterCategories.innerHTML = categories
    .map(
      (cat) =>
        `<label class="filter-checkbox"><input type="checkbox" name="category" value="${cat.slug}" /><span class="checkmark"></span><span class="label-text">${cat.nom}</span><span class="count">(${cat.count})</span></label>`
    )
    .join('');
}

function renderAvailable() {
  const available = experts.filter((e) => e.statut === 'disponible');
  availableRow.innerHTML = available
    .map(
      (exp) => `<article class="expert-card">
        <div class="relative">
          <img class="expert-photo" src="${exp.photo}" alt="${exp.nom}" />
          <div class="badge-available-overlay">🟢 Dispo</div>
        </div>
        <h3 class="expert-title">${exp.nom}</h3>
        <p class="expert-meta">${exp.metier}</p>
        <div class="expert-rating"><span class="text-yellow-400">⭐⭐⭐⭐⭐</span><span class="font-semibold">${exp.note}</span><span class="muted">(${exp.avis})</span></div>
        <div class="expert-pricing"><span class="amount">${exp.tarif}€</span><span class="muted">/min</span></div>
        <div class="expert-buttons">
          <button class="primary">📞 Appeler</button>
          <button class="ghost">Voir profil</button>
        </div>
      </article>`
    )
    .join('');
}

function filterExperts() {
  const searchTerm = document.getElementById('search-input').value.toLowerCase();
  const selectedPrice = document.querySelector('input[name="price"]:checked').value;
  const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked')).map((c) => c.value);
  const selectedAvailability = Array.from(document.querySelectorAll('input[name="availability"]:checked')).map((c) => c.value);
  const minRating = parseFloat(ratingRange.value);

  return experts
    .filter((exp) =>
      !searchTerm ||
      exp.nom.toLowerCase().includes(searchTerm) ||
      exp.metier.toLowerCase().includes(searchTerm) ||
      exp.specialites.some((s) => s.toLowerCase().includes(searchTerm))
    )
    .filter((exp) => {
      if (selectedCategories.length === 0) return true;
      return selectedCategories.some((cat) =>
        categoryKeywords[cat]?.some((keyword) =>
          `${exp.metier} ${exp.specialites.join(' ')}`.toLowerCase().includes(keyword)
        )
      );
    })
    .filter((exp) => {
      if (selectedAvailability.length === 0) return true;
      return selectedAvailability.includes(exp.statut);
    })
    .filter((exp) => exp.note >= minRating)
    .filter((exp) => {
      if (selectedPrice === 'all') return true;
      const [min, max] = selectedPrice.split('-').map(Number);
      return exp.tarif >= min && exp.tarif <= max;
    });
}

function renderPagination(total) {
  const pages = Math.ceil(total / perPage);
  pagination.innerHTML = '';
  for (let i = 1; i <= pages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.classList.toggle('active', i === currentPage);
    btn.addEventListener('click', () => {
      currentPage = i;
      renderSearch();
    });
    pagination.appendChild(btn);
  }
}

function renderSearch(sort = document.getElementById('sort-select').value) {
  const filtered = filterExperts();
  const sorted = [...filtered].sort((a, b) => {
    switch (sort) {
      case 'note':
        return b.note - a.note;
      case 'prix':
        return a.tarif - b.tarif;
      case 'disponibilite':
        return a.statut === 'disponible' ? -1 : 1;
      default:
        return b.avis - a.avis;
    }
  });

  renderPagination(sorted.length);
  const start = (currentPage - 1) * perPage;
  const pageItems = sorted.slice(start, start + perPage);

  searchResults.innerHTML = pageItems
    .map(
      (exp) => `<article class="expert-card">
        <div class="relative">
          <img class="expert-photo" src="${exp.photo}" alt="${exp.nom}" />
          <div class="badge-available-overlay">${exp.statut === 'disponible' ? '🟢 Dispo' : '📅 Planifiable'}</div>
        </div>
        <h3 class="expert-title">${exp.nom}</h3>
        <p class="expert-meta">${exp.metier}</p>
        <div class="expert-rating"><span class="text-yellow-400">⭐⭐⭐⭐⭐</span><span class="font-semibold">${exp.note}</span><span class="muted">(${exp.avis})</span></div>
        <div class="expert-pricing"><span class="amount">${exp.tarif}€</span><span class="muted">/min</span></div>
        <div class="expert-buttons">
          <button class="primary">📞 Appeler</button>
          <button class="ghost">Voir profil</button>
        </div>
      </article>`
    )
    .join('');
}

function renderProfile() {
  const expert = experts[0];
  document.getElementById('profile-photo').src = expert.photo;
  document.getElementById('profile-name').textContent = expert.nom;
  document.getElementById('profile-role').textContent = expert.metier;
  document.getElementById('profile-location').textContent = `${expert.ville} · ${expert.langue}`;
  document.getElementById('profile-rating').textContent = `⭐ ${expert.note}/5 (${expert.avis} avis)`;

  document.getElementById('about').innerHTML = `
    <p>${expert.bio}</p>
    <div class="badge-row">${expert.badges.map((b) => `<span class="badge">${b}</span>`).join('')}</div>
    <ul class="dashboard-list">
      <li>245 appels réalisés</li>
      <li>Temps de réponse : &lt; 2 min</li>
      <li>Taux de satisfaction : 98%</li>
    </ul>
  `;

  document.getElementById('expertises').innerHTML = expert.specialites
    .map((item) => `<div class="badge">${item}</div>`)
    .join('');

  document.getElementById('reviews').innerHTML = `
    <article class="card"><p>⭐⭐⭐⭐⭐ Marc D. · Il y a 2 jours</p><p>Excellent coach, très à l'écoute. Appel productif !</p></article>
    <article class="card"><p>⭐⭐⭐⭐⭐ Julie P. · Il y a 5 jours</p><p>Conseils précis et actionnables, je recommande.</p></article>
  `;

  document.getElementById('availability').innerHTML = `
    <p>Créneaux ouverts aujourd'hui : 12h-14h, 18h-20h</p>
    <p>Réservation possible jusqu'à 30 jours.</p>
  `;
}

function renderTestimonials() {
  const testimonial = testimonials[currentTestimonial];
  testimonialCard.innerHTML = `
    <p><em>"${testimonial.quote}"</em></p>
    <p class="rating">${'⭐'.repeat(Math.round(testimonial.rating))} ${testimonial.rating}/5</p>
    <p class="muted">${testimonial.author}</p>
  `;

  testimonialDots.innerHTML = testimonials
    .map((_, index) => `<button aria-label="Témoignage ${index + 1}" class="${index === currentTestimonial ? 'active' : ''}"></button>`)
    .join('');

  testimonialDots.querySelectorAll('button').forEach((btn, index) =>
    btn.addEventListener('click', () => {
      currentTestimonial = index;
      renderTestimonials();
    })
  );
}

function cycleTestimonials() {
  currentTestimonial = (currentTestimonial + 1) % testimonials.length;
  renderTestimonials();
}

function attachEvents() {
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach((panel) => panel.classList.remove('visible'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.target).classList.add('visible');
    });
  });

  document.getElementById('search-button').addEventListener('click', () => {
    currentPage = 1;
    renderSearch();
  });

  document.getElementById('sort-select').addEventListener('change', (e) => renderSearch(e.target.value));
  document.getElementById('clear-filters').addEventListener('click', () => {
    document.querySelector('input[name="price"][value="all"]').checked = true;
    document.querySelectorAll('input[name="category"], input[name="availability"]').forEach((input) => (input.checked = false));
    ratingRange.value = 0;
    ratingValue.textContent = '0';
    currentPage = 1;
    renderSearch();
  });

  ratingRange.addEventListener('input', (e) => {
    ratingValue.textContent = e.target.value;
    currentPage = 1;
    renderSearch();
  });

  document.getElementById('hero-submit').addEventListener('click', () => {
    document.getElementById('search-input').value = document.getElementById('hero-search').value;
    renderSearch();
    document.getElementById('search').scrollIntoView({ behavior: 'smooth' });
  });
}

renderCategories();
renderAvailable();
renderProfile();
renderTestimonials();
renderSearch();
attachEvents();
setInterval(cycleTestimonials, 5000);
