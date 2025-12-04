const http = require('http');
const { URL } = require('url');
const { state, resetData, createCall, updateExpertRating } = require('./data');
const { parseJsonBody, sendJson, sendHtml, notFound, badRequest } = require('./utils');

const DEFAULT_COMMISSION = Number(process.env.PLATFORM_COMMISSION || 0.18);

const landingPage = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nexbuzzer · Trouvez votre expert</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: radial-gradient(120% 120% at 15% 20%, #1a2b4c 0%, #0b1324 35%, #050910 70%);
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      color: #eef2ff;
      min-height: 100vh;
    }
    header {
      padding: 32px 24px 12px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background: rgba(99, 102, 241, 0.15);
      border: 1px solid rgba(99, 102, 241, 0.35);
      border-radius: 999px;
      color: #c7d2fe;
      font-weight: 600;
      letter-spacing: 0.01em;
      text-transform: uppercase;
      font-size: 12px;
    }
    h1 {
      margin: 14px 0 6px;
      font-size: clamp(28px, 4vw, 42px);
      letter-spacing: -0.02em;
    }
    .subtitle {
      margin: 0;
      max-width: 780px;
      color: #c7d2fe;
      line-height: 1.6;
    }
    .toolbar {
      display: grid;
      grid-template-columns: 1fr 1fr auto;
      gap: 12px;
      margin: 24px 0 10px;
    }
    .input, .pill {
      width: 100%;
      padding: 14px 14px;
      border-radius: 14px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(255, 255, 255, 0.04);
      color: #f8fafc;
      font-size: 15px;
    }
    .pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      width: auto;
      padding-inline: 16px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .pill:hover, .pill:focus-visible {
      background: rgba(99, 102, 241, 0.18);
      border-color: rgba(99, 102, 241, 0.4);
    }
    .grid {
      max-width: 1200px;
      margin: 12px auto 48px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 18px;
      padding: 0 24px;
    }
    .card {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 18px;
      padding: 18px;
      backdrop-filter: blur(6px);
      box-shadow: 0 20px 80px rgba(0,0,0,0.35);
      transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .card:hover {
      transform: translateY(-4px);
      border-color: rgba(99, 102, 241, 0.35);
      box-shadow: 0 24px 90px rgba(76, 81, 191, 0.25);
    }
    .card h3 { margin: 0 0 4px; }
    .card .meta {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #cbd5e1;
      font-size: 14px;
    }
    .tag {
      display: inline-flex;
      padding: 6px 10px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 10px;
      font-size: 13px;
      margin: 4px 4px 0 0;
      color: #e2e8f0;
    }
    .cta {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 14px;
      border-radius: 12px;
      border: none;
      color: #0b1020;
      background: linear-gradient(120deg, #a78bfa, #7c3aed);
      font-weight: 700;
      cursor: pointer;
      margin-top: 12px;
      width: 100%;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .cta:hover { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(124,58,237,0.35); }
    .status {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 10px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 600;
    }
    .dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
    .status.online { background: rgba(52, 211, 153, 0.18); color: #34d399; }
    .status.online .dot { background: #34d399; }
    .status.busy { background: rgba(250, 204, 21, 0.18); color: #facc15; }
    .status.busy .dot { background: #facc15; }
    .status.offline { background: rgba(148, 163, 184, 0.18); color: #cbd5e1; }
    .status.offline .dot { background: #cbd5e1; }
    .empty {
      grid-column: 1/-1;
      text-align: center;
      padding: 32px;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 16px;
      border: 1px dashed rgba(255, 255, 255, 0.1);
      color: #cbd5e1;
    }
    footer {
      text-align: center;
      padding: 24px;
      color: #94a3b8;
      font-size: 13px;
    }
    @media (max-width: 780px) {
      .toolbar { grid-template-columns: 1fr; }
      header { padding: 28px 18px 8px; }
      .grid { padding: 0 18px; }
    }
  </style>
</head>
<body>
  <header>
    <div class="badge">Nexbuzzer · Appel minute</div>
    <h1>Bookez un expert en quelques secondes.</h1>
    <p class="subtitle">Parcourez les profils, vérifiez la disponibilité en temps réel et lancez un appel audio/vidéo facturé à la minute. Paiement sécurisé, avis vérifiés.</p>
    <div class="toolbar">
      <input id="search" class="input" type="search" placeholder="Rechercher un nom, une spécialité, une bio..." />
      <select id="statut" class="input">
        <option value="">Tous les statuts</option>
        <option value="disponible_maintenant">Disponible maintenant</option>
        <option value="occupé">Occupé</option>
        <option value="hors_ligne">Hors ligne</option>
      </select>
      <button class="pill" id="refresh">↻ Actualiser</button>
    </div>
  </header>
  <section class="grid" id="experts"></section>
  <footer>API MVP sans dépendances · Données éphémères réinitialisables via /reset-fixtures</footer>
  <script>
    const statusMap = {
      disponible_maintenant: { label: 'Disponible', className: 'online' },
      occupé: { label: 'Occupé', className: 'busy' },
      hors_ligne: { label: 'Hors ligne', className: 'offline' },
    };

    const container = document.getElementById('experts');
    const searchInput = document.getElementById('search');
    const statutSelect = document.getElementById('statut');
    const refreshBtn = document.getElementById('refresh');

    function renderExperts(list) {
      if (!list.length) {
        container.innerHTML = '<div class="empty">Aucun profil ne correspond à votre recherche pour le moment.</div>';
        return;
      }

      container.innerHTML = list.map((expert) => {
        const status = statusMap[expert.statut] || statusMap.hors_ligne;
        return \`
          <article class="card">
            <div class="meta">
              <span class="status \${status.className}"><span class="dot"></span>\${status.label}</span>
              <span>€\${expert.tarif_minute.toFixed(2)}/min</span>
              <span>★ \${expert.note_moyenne.toFixed(1)} · \${expert.nombre_avis} avis</span>
            </div>
            <h3>\${expert.nom}</h3>
            <p style="color:#cbd5e1; line-height:1.5; margin: 6px 0 10px;">\${expert.bio}</p>
            <div>\${expert.specialites.map((tag) => \`<span class="tag">\${tag}</span>\`).join('')}</div>
            <button class="cta">Appeler en 1 clic</button>
          </article>
        \`;
      }).join('');
    }

    async function fetchExperts() {
      const params = new URLSearchParams();
      if (searchInput.value) params.set('q', searchInput.value);
      if (statutSelect.value) params.set('statut', statutSelect.value);
        const url = params.toString() ? \`/experts?\${params.toString()}\` : '/experts';
      container.innerHTML = '<div class="empty">Chargement des profils…</div>';
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Impossible de charger les experts');
        const payload = await response.json();
        renderExperts(payload.results || []);
        } catch (error) {
          container.innerHTML = \`<div class="empty">\${error.message}</div>\`;
        }
      }

    searchInput.addEventListener('input', () => {
      clearTimeout(searchInput._t);
      searchInput._t = setTimeout(fetchExperts, 180);
    });
    statutSelect.addEventListener('change', fetchExperts);
    refreshBtn.addEventListener('click', fetchExperts);

    fetchExperts();
  </script>
</body>
</html>`;

function filterExperts(url) {
  const search = url.searchParams.get('q');
  const statut = url.searchParams.get('statut');
  const tarifMax = Number(url.searchParams.get('tarif_max') || Infinity);
  const noteMin = Number(url.searchParams.get('note_min') || 0);

  return state.experts.filter((expert) => {
    const matchesSearch =
      !search ||
      expert.nom.toLowerCase().includes(search.toLowerCase()) ||
      expert.bio.toLowerCase().includes(search.toLowerCase()) ||
      expert.specialites.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
    const matchesStatut = !statut || expert.statut === statut;
    const matchesTarif = expert.tarif_minute <= tarifMax;
    const matchesNote = expert.note_moyenne >= noteMin;
    return matchesSearch && matchesStatut && matchesTarif && matchesNote;
  });
}

function validateCallPayload(body) {
  if (!body.expertId) return 'expertId requis';
  if (!body.clientId) return 'clientId requis';
  if (!body.dureeMax || Number.isNaN(Number(body.dureeMax))) return 'dureeMax invalide';
  return null;
}

function computeCallAmounts(expert, durationMinutes) {
  const montantTotal = Number((expert.tarif_minute * durationMinutes).toFixed(2));
  const commissionPlateforme = Number((montantTotal * DEFAULT_COMMISSION).toFixed(2));
  const montantExpert = Number((montantTotal - commissionPlateforme).toFixed(2));
  return { montantTotal, commissionPlateforme, montantExpert };
}

function createServer() {
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    if (req.method === 'GET' && url.pathname === '/') {
      sendHtml(res, 200, landingPage);
      return;
    }

    if (req.method === 'GET' && url.pathname === '/health') {
      sendJson(res, 200, { status: 'ok', uptime: process.uptime() });
      return;
    }

    if (req.method === 'GET' && url.pathname === '/reset-fixtures') {
      resetData();
      sendJson(res, 200, { status: 'reset' });
      return;
    }

    if (req.method === 'GET' && url.pathname === '/experts') {
      const experts = filterExperts(url);
      sendJson(res, 200, { results: experts, total: experts.length });
      return;
    }

    if (req.method === 'GET' && url.pathname.startsWith('/experts/')) {
      const expertId = url.pathname.split('/')[2];
      const expert = state.experts.find((item) => item.id === expertId);
      if (!expert) {
        notFound(res);
        return;
      }
      sendJson(res, 200, expert);
      return;
    }

    if (req.method === 'PATCH' && url.pathname.startsWith('/experts/') && url.pathname.endsWith('/statut')) {
      const expertId = url.pathname.split('/')[2];
      const expertIndex = state.experts.findIndex((item) => item.id === expertId);
      if (expertIndex === -1) {
        notFound(res);
        return;
      }
      try {
        const body = await parseJsonBody(req);
        const allowed = ['disponible_maintenant', 'occupé', 'hors_ligne'];
        if (!allowed.includes(body.statut)) {
          badRequest(res, 'Statut invalide');
          return;
        }
        state.experts[expertIndex] = { ...state.experts[expertIndex], statut: body.statut };
        sendJson(res, 200, state.experts[expertIndex]);
      } catch (error) {
        badRequest(res, error.message);
      }
      return;
    }

    if (req.method === 'POST' && url.pathname === '/calls') {
      try {
        const body = await parseJsonBody(req);
        const validationError = validateCallPayload(body);
        if (validationError) {
          badRequest(res, validationError);
          return;
        }

        const expert = state.experts.find((item) => item.id === body.expertId);
        if (!expert) {
          notFound(res);
          return;
        }
        if (expert.statut !== 'disponible_maintenant') {
          badRequest(res, 'Expert indisponible pour un appel immédiat');
          return;
        }

        const call = createCall({
          expertId: expert.id,
          clientId: body.clientId,
          dureeMax: Number(body.dureeMax),
        });

        const montantPreautorise = Number((expert.tarif_minute * call.dureeMax).toFixed(2));
        call.montantPreautorise = montantPreautorise;
        const expertIndex = state.experts.findIndex((item) => item.id === expert.id);
        state.experts[expertIndex] = { ...expert, statut: 'occupé' };

        sendJson(res, 201, {
          call,
          paiement: {
            preautorisation: montantPreautorise,
            plafond_minutes: call.dureeMax,
          },
          message: 'Appel initialisé, pré-autorisation Stripe simulée.',
        });
      } catch (error) {
        badRequest(res, error.message);
      }
      return;
    }

    if (req.method === 'PATCH' && url.pathname.startsWith('/calls/') && url.pathname.endsWith('/fin')) {
      const callId = url.pathname.split('/')[2];
      const call = state.calls.find((item) => item.id === callId);
      if (!call) {
        notFound(res);
        return;
      }
      try {
        const body = await parseJsonBody(req);
        const dureeReelle = Number(body.dureeReelle);
        if (!dureeReelle && dureeReelle !== 0) {
          badRequest(res, 'dureeReelle requise');
          return;
        }
        const expert = state.experts.find((item) => item.id === call.expertId);
        const amounts = computeCallAmounts(expert, dureeReelle);
        const montantPreautorise = call.montantPreautorise ||
          Number((expert.tarif_minute * call.dureeMax).toFixed(2));

        call.dureeReelle = dureeReelle;
        call.endedAt = new Date().toISOString();
        call.statut = 'terminé';
        call.montantTotal = amounts.montantTotal;
        call.montantExpert = amounts.montantExpert;
        call.commissionPlateforme = amounts.commissionPlateforme;

        const expertIndex = state.experts.findIndex((item) => item.id === expert.id);
        if (expertIndex !== -1) {
          state.experts[expertIndex] = { ...expert, statut: 'disponible_maintenant' };
        }

        const remboursement = Number((montantPreautorise - amounts.montantTotal).toFixed(2));

        sendJson(res, 200, {
          call,
          paiement: {
            capture: amounts.montantTotal,
            remboursement: remboursement > 0 ? remboursement : 0,
          },
          message: 'Appel terminé, capture et remboursement simulés.',
        });
      } catch (error) {
        badRequest(res, error.message);
      }
      return;
    }

    if (req.method === 'POST' && url.pathname === '/reviews') {
      try {
        const body = await parseJsonBody(req);
        const { callId, reviewerId, reviewedId, rating, commentaire } = body;
        if (!callId || !reviewerId || !reviewedId || !rating) {
          badRequest(res, 'Champs obligatoires manquants');
          return;
        }
        if (rating < 1 || rating > 5) {
          badRequest(res, 'La note doit être comprise entre 1 et 5');
          return;
        }
        const call = state.calls.find((item) => item.id === callId);
        if (!call || call.statut !== 'terminé') {
          badRequest(res, 'Impossible de noter un appel non terminé');
          return;
        }
        const review = {
          id: `${callId}-${reviewerId}`,
          call_id: callId,
          reviewer_id: reviewerId,
          reviewed_id: reviewedId,
          rating,
          commentaire: commentaire || '',
          created_at: new Date().toISOString(),
        };
        state.reviews.push(review);
        updateExpertRating(reviewedId);
        sendJson(res, 201, review);
      } catch (error) {
        badRequest(res, error.message);
      }
      return;
    }

    notFound(res);
  });

  return server;
}

module.exports = { createServer };
