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

const experts = [
  { id: 1, nom: 'Sophie Martin', metier: 'Coach carrière', photo: 'https://i.pravatar.cc/150?img=1', tarif: 3, note: 4.9, avis: 124, statut: 'disponible', category: 'coaching', badges: ['verifie', 'top'], dispoLabel: '🟢 Disponible' },
  { id: 2, nom: 'Thomas Dubois', metier: 'Développeur Senior', photo: 'https://i.pravatar.cc/150?img=12', tarif: 5, note: 5.0, avis: 89, statut: 'disponible', category: 'tech', badges: ['verifie'], dispoLabel: '🟢 Disponible' },
  { id: 3, nom: 'Julie Petit', metier: 'UX Designer', photo: 'https://i.pravatar.cc/150?img=5', tarif: 4, note: 4.8, avis: 156, statut: 'disponible', category: 'creation', badges: ['verifie'], dispoLabel: '🟢 Disponible' },
  { id: 4, nom: 'Amine Salah', metier: 'Consultant Growth', photo: 'https://i.pravatar.cc/150?img=15', tarif: 3, note: 4.7, avis: 112, statut: 'planning', category: 'business', badges: ['verifie'], dispoLabel: '📅 Planifiable' },
  { id: 5, nom: 'Claire Renault', metier: 'Coach leadership', photo: 'https://i.pravatar.cc/150?img=7', tarif: 6, note: 4.95, avis: 201, statut: 'disponible', category: 'coaching', badges: ['verifie'], dispoLabel: '🟢 Disponible' },
  { id: 6, nom: 'Leo Martins', metier: 'Engineer Cloud', photo: 'https://i.pravatar.cc/150?img=20', tarif: 5, note: 4.9, avis: 143, statut: 'planning', category: 'tech', badges: ['verifie'], dispoLabel: '📅 Planifiable' },
  { id: 7, nom: 'Camille Roy', metier: 'Product Manager', photo: 'https://i.pravatar.cc/150?img=32', tarif: 4, note: 4.8, avis: 98, statut: 'disponible', category: 'business', badges: ['verifie'], dispoLabel: '🟢 Disponible' },
  { id: 8, nom: 'Lucas Perrin', metier: 'Data Scientist', photo: 'https://i.pravatar.cc/150?img=40', tarif: 5, note: 4.9, avis: 77, statut: 'disponible', category: 'tech', badges: ['verifie'], dispoLabel: '🟢 Disponible' },
  { id: 9, nom: 'Nadia Ben', metier: 'Marketing B2B', photo: 'https://i.pravatar.cc/150?img=45', tarif: 3, note: 4.6, avis: 134, statut: 'planning', category: 'business', badges: [], dispoLabel: '📅 Planifiable' },
  { id: 10, nom: 'Hugo Carpentier', metier: 'Coach Sales', photo: 'https://i.pravatar.cc/150?img=52', tarif: 4, note: 4.9, avis: 165, statut: 'disponible', category: 'business', badges: ['top'], dispoLabel: '🟢 Disponible' },
  { id: 11, nom: 'Mina Zhao', metier: 'Stratégie produit', photo: 'https://i.pravatar.cc/150?img=55', tarif: 6, note: 5.0, avis: 92, statut: 'disponible', category: 'business', badges: ['verifie'], dispoLabel: '🟢 Disponible' },
  { id: 12, nom: 'Arnaud Lefèvre', metier: 'Juriste RGPD', photo: 'https://i.pravatar.cc/150?img=61', tarif: 4, note: 4.8, avis: 58, statut: 'disponible', category: 'juridique', badges: ['verifie'], dispoLabel: '🟢 Disponible' },
  { id: 13, nom: 'Sara Costa', metier: 'Coach bien-être', photo: 'https://i.pravatar.cc/150?img=64', tarif: 3, note: 4.7, avis: 102, statut: 'planning', category: 'bien-etre', badges: [], dispoLabel: '📅 Planifiable' },
  { id: 14, nom: 'Daniel Kim', metier: 'Ingénieur Sécurité', photo: 'https://i.pravatar.cc/150?img=70', tarif: 7, note: 5.0, avis: 71, statut: 'disponible', category: 'tech', badges: ['verifie'], dispoLabel: '🟢 Disponible' },
  { id: 15, nom: 'Élodie Garnier', metier: 'Consultante Finance', photo: 'https://i.pravatar.cc/150?img=75', tarif: 5, note: 4.85, avis: 88, statut: 'disponible', category: 'finance', badges: ['verifie'], dispoLabel: '🟢 Disponible' },
  { id: 16, nom: 'Yanis Guérin', metier: 'Coach langues', photo: 'https://i.pravatar.cc/150?img=78', tarif: 2, note: 4.6, avis: 142, statut: 'disponible', category: 'langues', badges: [], dispoLabel: '🟢 Disponible' },
  { id: 17, nom: 'Isabelle Noël', metier: 'Facilitatrice Design Sprint', photo: 'https://i.pravatar.cc/150?img=83', tarif: 4, note: 4.9, avis: 119, statut: 'planning', category: 'creation', badges: ['verifie'], dispoLabel: '📅 Planifiable' },
  { id: 18, nom: 'Marc Delcourt', metier: 'Coach freelance', photo: 'https://i.pravatar.cc/150?img=85', tarif: 3, note: 4.7, avis: 136, statut: 'disponible', category: 'business', badges: [], dispoLabel: '🟢 Disponible' },
  { id: 19, nom: 'Priya Patel', metier: 'Consultante Data Gouvernance', photo: 'https://i.pravatar.cc/150?img=88', tarif: 6, note: 4.9, avis: 67, statut: 'planning', category: 'finance', badges: ['verifie'], dispoLabel: '📅 Planifiable' },
  { id: 20, nom: 'Alexandre Moreau', metier: 'Coach produit', photo: 'https://i.pravatar.cc/150?img=90', tarif: 4, note: 4.8, avis: 121, statut: 'disponible', category: 'business', badges: ['verifie'], dispoLabel: '🟢 Disponible' },
];

const testimonials = [
  { quote: "J'ai trouvé un coach en 2 minutes, appel instantané. Hyper efficace !", author: 'Marc D., Entrepreneur' },
  { quote: 'Tarifs clairs, disponibilité en direct, parfait pour résoudre un blocage technique.', author: 'Leïla K., CTO' },
  { quote: "Les avis sont fiables et le paiement à la minute rassure pour tester.", author: 'Hassan B., Growth lead' },
];

const expertTestimonials = [
  { quote: 'Je gagne 1500€/mois en complément de mon activité de coach', author: 'Sophie M.' },
  { quote: "Nexbuzzer m'a permis de monétiser mes conseils entre deux missions", author: 'Thomas D., Dev' },
  { quote: 'Interface simple, paiements rapides, je recommande', author: 'Claire R., Consultante' },
];

const steps = [
  { icon: '🧭', title: 'Trouvez votre expert', desc: 'Parcourez les profils et filtrez par expertise, tarif ou langue.' },
  { icon: '📞', title: 'Appelez instantanément', desc: "Si l'expert est disponible, démarrez l'appel en 1 clic ou planifiez." },
  { icon: '💳', title: 'Payez à la minute', desc: 'Tarif transparent, remboursement automatique des minutes non utilisées.' },
];

const reasons = [
  { icon: '💰', title: 'Paiement à la minute', desc: 'Ultra flexible, pas de forfait rigide' },
  { icon: '⚡', title: 'Instantané', desc: 'Appels directs si l\'expert est disponible' },
  { icon: '🔒', title: 'Sécurisé', desc: 'Paiements Stripe, données chiffrées' },
  { icon: '✅', title: 'Experts vérifiés', desc: 'Badges, certifications, avis clients' },
];

const faq = [
  'Comment fonctionne le paiement à la minute ?',
  "Que se passe-t-il si l'expert ne répond pas ?",
  'Puis-je annuler un appel ?',
  'Les experts sont-ils vérifiés ?',
  'Puis-je obtenir un remboursement ?',
  'Comment planifier un appel ?',
  'Quels moyens de paiement acceptez-vous ?',
  "Y a-t-il des frais cachés ?",
];

const pricingFaq = [
  'Puis-je changer mon tarif ?',
  'Quand suis-je payé ?',
  'Y a-t-il des frais supplémentaires ?',
  'Que se passe-t-il si le client ne paie pas ?',
  'Comment fonctionne le remboursement automatique ?',
];

function qs(selector) {
  return document.querySelector(selector);
}

function renderSteps() {
  const container = document.getElementById('steps-grid');
  if (!container) return;
  container.innerHTML = steps
    .map((step, i) => `<article class="info-card"><span class="icon">${step.icon}</span><h4>${i + 1}. ${step.title}</h4><p class="muted">${step.desc}</p></article>`)
    .join('');
}

function renderCategories() {
  const grid = document.getElementById('categories-grid');
  if (!grid) return;
  grid.innerHTML = categories
    .map(
      (cat) => `<article class="info-card"><p class="icon">${cat.icon}</p><h4>${cat.nom}</h4><p class="muted">${cat.count} experts</p></article>`
    )
    .join('');
}

function renderAvailable() {
  const grid = document.getElementById('available-grid');
  if (!grid) return;
  grid.innerHTML = experts
    .filter((e) => e.statut === 'disponible')
    .slice(0, 3)
    .map(renderExpertCard)
    .join('');
}

function renderReasons() {
  const grid = document.getElementById('reasons-grid');
  if (!grid) return;
  grid.innerHTML = reasons
    .map((reason) => `<article class="info-card"><span class="icon">${reason.icon}</span><h4>${reason.title}</h4><p class="muted">${reason.desc}</p></article>`)
    .join('');
}

function renderTestimonial(id, dotsId, data) {
  const container = document.getElementById(id);
  const dots = document.getElementById(dotsId);
  if (!container || !dots) return;
  let current = 0;
  function update() {
    const item = data[current];
    container.innerHTML = `<p><em>“${item.quote}”</em></p><p class="muted">${item.author}</p>`;
    dots.innerHTML = data
      .map((_, i) => `<button class="${i === current ? 'active' : ''}" aria-label="Témoignage ${i + 1}"></button>`)
      .join('');
    dots.querySelectorAll('button').forEach((btn, index) => btn.addEventListener('click', () => { current = index; update(); }));
  }
  update();
}

function renderAccordion(id, questions) {
  const container = document.getElementById(id);
  if (!container) return;
  container.innerHTML = questions
    .map((q) => `<details><summary>${q}</summary><p class="muted">Réponse courte : tout est prévu pour que ce soit simple et sécurisé.</p></details>`)
    .join('');
}

function renderClientSteps() {
  const container = document.getElementById('client-steps');
  if (!container) return;
  const data = [
    { icon: '🔍', title: 'Trouvez votre expert', desc: 'Filtrez par catégorie, tarif ou disponibilité. Consultez les avis.' },
    { icon: '📹', title: 'Appelez instantanément', desc: 'Si dispo, lancez l’appel en 1 clic. Sinon planifiez le créneau idéal.' },
    { icon: '💳', title: 'Payez à la minute', desc: 'Facturation au réel avec remboursement automatique du surplus.' },
  ];
  container.innerHTML = data
    .map((step, idx) => `<article class="info-card"><span class="icon">${step.icon}</span><h4>${idx + 1}. ${step.title}</h4><p class="muted">${step.desc}</p></article>`)
    .join('');
}

function renderExpertSteps() {
  const container = document.getElementById('expert-steps');
  if (!container) return;
  const data = [
    { icon: '🧑‍💻', title: 'Créez votre profil', desc: 'Bio, tarif, expertises et vidéo en 5 minutes.' },
    { icon: '⏱️', title: 'Définissez votre disponibilité', desc: "Synchronisez votre calendrier ou activez 'Disponible maintenant'." },
    { icon: '💸', title: 'Recevez vos paiements', desc: '85% de vos revenus chaque semaine via Stripe.' },
  ];
  container.innerHTML = data
    .map((step, idx) => `<article class="info-card"><span class="icon">${step.icon}</span><h4>${idx + 1}. ${step.title}</h4><p class="muted">${step.desc}</p></article>`)
    .join('');
}

function renderExpertBenefits() {
  const container = document.getElementById('expert-benefits');
  if (!container) return;
  const data = [
    { icon: '💰', title: 'Commission 15% seulement', desc: 'Vous gardez 85% de vos revenus. Aucun abonnement.' },
    { icon: '⚡', title: 'Appels instantanés', desc: 'Activez “Disponible” et monétisez vos temps morts.' },
    { icon: '🔒', title: 'Paiements sécurisés', desc: 'Virements hebdomadaires via Stripe Connect.' },
  ];
  container.innerHTML = data
    .map((item) => `<article class="info-card"><span class="icon">${item.icon}</span><h4>${item.title}</h4><p class="muted">${item.desc}</p></article>`)
    .join('');
}

function renderTimeline() {
  const container = document.getElementById('expert-timeline');
  if (!container) return;
  const steps = [
    'Créez votre profil (5 min) - Ajoutez photo, bio, tarif, vidéo',
    'Définissez votre tarif (2-10€/min) - Libre de le modifier à tout moment',
    'Activez “Disponible” - Les clients vous voient en temps réel',
    'Recevez des appels - Gagnez de l’argent immédiatement',
  ];
  container.innerHTML = steps.map((s, i) => `<li><strong>${i + 1}.</strong> ${s}</li>`).join('');
}

function renderFilters() {
  const container = document.getElementById('filter-categories');
  if (!container) return;
  container.innerHTML = categories
    .map(
      (cat) => `<label class="filter-checkbox"><input type="checkbox" value="${cat.slug}" /><span class="checkmark"></span><span class="label-text">${cat.nom}</span></label>`
    )
    .join('');
}

let currentPage = 1;
const perPage = 9;

function renderExpertCard(exp) {
  return `<article class="expert-card">
    <div class="relative">
      <img class="expert-photo" src="${exp.photo}" alt="${exp.nom}" loading="lazy" />
      <div class="badge-available-overlay">${exp.dispoLabel}</div>
    </div>
    <h3 class="expert-title">${exp.nom}</h3>
    <p class="expert-meta">${exp.metier}</p>
    <div class="expert-rating"><span>⭐⭐⭐⭐⭐</span><span class="font-semibold">${exp.note.toFixed(1)}</span><span class="muted">(${exp.avis} avis)</span></div>
    <div class="expert-pricing"><span class="amount">${exp.tarif}€</span> <span class="muted">/min</span></div>
    <div class="expert-buttons">
      <button class="primary">📞 Appeler maintenant</button>
      <button class="ghost">Voir profil</button>
    </div>
  </article>`;
}

function filterExperts() {
  const term = (qs('#search-input')?.value || '').toLowerCase();
  const maxPrice = parseFloat(qs('#price-range')?.value || '10');
  const minRating = parseFloat(qs('#rating-range')?.value || '0');
  const availability = Array.from(document.querySelectorAll('.sidebar input[type="checkbox"]:checked')).map((i) => i.value);
  const cats = Array.from(document.querySelectorAll('#filter-categories input:checked')).map((c) => c.value);
  const badges = Array.from(document.querySelectorAll('.filter-group input[value="verifie"], .filter-group input[value="top"], .filter-group input[value="certifie"]')).filter((i) => i.checked).map((i) => i.value);

  return experts
    .filter((exp) => exp.nom.toLowerCase().includes(term) || exp.metier.toLowerCase().includes(term))
    .filter((exp) => exp.tarif <= maxPrice)
    .filter((exp) => exp.note >= minRating)
    .filter((exp) => (availability.length ? availability.includes(exp.statut === 'disponible' ? 'disponible' : 'planning') : true))
    .filter((exp) => (cats.length ? cats.includes(exp.category) : true))
    .filter((exp) => (badges.length ? badges.every((b) => exp.badges.includes(b)) : true));
}

function sortExperts(list) {
  const sort = qs('#sort-select')?.value;
  if (sort === 'note') return list.sort((a, b) => b.note - a.note);
  if (sort === 'prix-asc') return list.sort((a, b) => a.tarif - b.tarif);
  if (sort === 'prix-desc') return list.sort((a, b) => b.tarif - a.tarif);
  if (sort === 'dispo') return list.sort((a, b) => (a.statut === 'disponible' ? -1 : 1) - (b.statut === 'disponible' ? -1 : 1));
  return list;
}

function renderExpertsPage() {
  const grid = document.getElementById('experts-grid');
  if (!grid) return;
  const filtered = sortExperts(filterExperts());
  const pages = Math.ceil(filtered.length / perPage);
  currentPage = Math.min(currentPage, pages || 1);
  const items = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);
  grid.innerHTML = items.map(renderExpertCard).join('') || '<p class="muted">Aucun expert pour ces filtres.</p>';
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = Array.from({ length: pages }, (_, i) => i + 1)
    .map((p) => `<button class="${p === currentPage ? 'active' : ''}" data-page="${p}">${p}</button>`)
    .join('');
  pagination.querySelectorAll('button').forEach((btn) => btn.addEventListener('click', () => { currentPage = Number(btn.dataset.page); renderExpertsPage(); }));
}

function calculator() {
  const result = document.getElementById('calculator-result');
  if (!result) return;
  const calls = document.getElementById('calls-range');
  const duration = document.getElementById('duration-range');
  const rate = document.getElementById('rate-range');
  const update = () => {
    const callsVal = Number(calls.value);
    const durationVal = Number(duration.value);
    const rateVal = Number(rate.value);
    document.getElementById('calls-value').textContent = callsVal;
    document.getElementById('duration-value').textContent = durationVal;
    document.getElementById('rate-value').textContent = `${rateVal}€`;
    const monthly = callsVal * durationVal * rateVal * 4 * 0.85;
    result.innerHTML = `<h3>💰 Revenus estimés : ${Math.round(monthly)}€/mois</h3><p class="muted">${callsVal} appels × ${durationVal} min × ${rateVal}€ × 4 semaines × 0.85</p>`;
  };
  update();
  [calls, duration, rate].forEach((input) => input?.addEventListener('input', update));
}

function bindControls() {
  const price = qs('#price-range');
  if (price) price.addEventListener('input', (e) => { qs('#price-value').textContent = e.target.value; renderExpertsPage(); });
  const rating = qs('#rating-range');
  if (rating) rating.addEventListener('input', (e) => { qs('#rating-value').textContent = e.target.value; renderExpertsPage(); });
  document.querySelectorAll('.sidebar input').forEach((input) => input.addEventListener('change', renderExpertsPage));
  const search = qs('#search-input');
  search?.addEventListener('input', renderExpertsPage);
  const sort = qs('#sort-select');
  sort?.addEventListener('change', renderExpertsPage);
  const clear = qs('#clear-filters');
  clear?.addEventListener('click', () => {
    document.querySelectorAll('.sidebar input').forEach((input) => { if (input.type === 'checkbox' || input.type === 'radio') input.checked = input.defaultChecked; });
    if (price) price.value = 10;
    if (rating) rating.value = 0;
    if (qs('#price-value')) qs('#price-value').textContent = '10€';
    if (qs('#rating-value')) qs('#rating-value').textContent = '0';
    renderExpertsPage();
  });
}

function mobileMenu() {
  const burger = document.querySelector('.burger');
  const menu = document.getElementById('mobile-menu');
  burger?.addEventListener('click', () => menu?.classList.toggle('show'));
}

renderSteps();
renderCategories();
renderAvailable();
renderReasons();
renderTestimonial('testimonial', 'testimonial-dots', testimonials);
renderTestimonial('expert-testimonial', 'expert-testimonial-dots', expertTestimonials);
renderAccordion('faq', faq);
renderAccordion('pricing-faq', pricingFaq);
renderClientSteps();
renderExpertSteps();
renderExpertBenefits();
renderTimeline();
renderFilters();
renderExpertsPage();
calculator();
bindControls();
mobileMenu();
