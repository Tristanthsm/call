const fs = require('fs');
const path = require('path');
const http = require('http');
const { URL } = require('url');
const { state, resetData, createCall, updateExpertRating } = require('./data');
const { parseJsonBody, sendJson, notFound, badRequest } = require('./utils');


const DEFAULT_COMMISSION = Number(process.env.PLATFORM_COMMISSION || 0.18);
const frontendDir = path.resolve(__dirname, '..', '..', 'frontend');

function contentTypeFor(filePath) {
  const ext = path.extname(filePath);
  switch (ext) {
    case '.html':
      return 'text/html; charset=utf-8';
    case '.css':
      return 'text/css; charset=utf-8';
    case '.js':
      return 'application/javascript; charset=utf-8';
    case '.json':
      return 'application/json; charset=utf-8';
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.svg':
      return 'image/svg+xml';
    default:
      return 'application/octet-stream';
  }
}

async function tryServeFrontend(url, res) {
  if (url.pathname.includes('..')) return false;

  const requestedPath = url.pathname === '/' ? '/index.html' : url.pathname;
  const filePath = path.join(frontendDir, requestedPath);
  if (!filePath.startsWith(frontendDir)) return false;

  try {
    const file = await fs.promises.readFile(filePath);
    res.writeHead(200, { 'Content-Type': contentTypeFor(filePath) });
    res.end(file);
    return true;
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error('Erreur de lecture de ressource front', error);
      res.writeHead(500);
      res.end('Erreur serveur');
      return true;
    }
  }

  return false;
}

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

    if (req.method === 'GET') {
      const served = await tryServeFrontend(url, res);
      if (served) return;
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
