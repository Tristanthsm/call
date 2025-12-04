const assert = require('node:assert');
const { describe, it, beforeEach, after } = require('node:test');
const { createServer } = require('../src/app');
const { resetData } = require('../src/data');

const server = createServer();
let baseUrl;

const serverReady = new Promise((resolve) => {
  server.listen(0, () => {
    const { port } = server.address();
    baseUrl = `http://127.0.0.1:${port}`;
    resolve();
  });
});

beforeEach(async () => {
  await serverReady;
  resetData();
});

after(() => {
  server.close();
});

describe('Nexbuzzer API', () => {
  it('renvoie un statut de santé', async () => {
    const response = await fetch(`${baseUrl}/health`);
    assert.strictEqual(response.status, 200);
    const body = await response.json();
    assert.ok(body.status);
  });

  it('filtre les experts disponibles', async () => {
    const response = await fetch(`${baseUrl}/experts?statut=disponible_maintenant`);
    const body = await response.json();
    assert.strictEqual(response.status, 200);
    assert.ok(body.results.length >= 1);
    body.results.forEach((expert) => {
      assert.strictEqual(expert.statut, 'disponible_maintenant');
    });
  });

  it('orchestrer un appel et un remboursement partiel', async () => {
    const startResponse = await fetch(`${baseUrl}/calls`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ expertId: 'exp-1', clientId: 'client-1', dureeMax: 10 }),
    });
    assert.strictEqual(startResponse.status, 201);
    const startPayload = await startResponse.json();
    assert.ok(startPayload.call?.id);

    const endResponse = await fetch(`${baseUrl}/calls/${startPayload.call.id}/fin`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dureeReelle: 7 }),
    });
    assert.strictEqual(endResponse.status, 200);
    const endPayload = await endResponse.json();
    assert.strictEqual(endPayload.call.dureeReelle, 7);
    assert.ok(endPayload.paiement.capture <= startPayload.paiement.preautorisation);
    assert.ok(endPayload.paiement.remboursement >= 0);
  });

  it('met à jour la note moyenne après un avis', async () => {
    const startResponse = await fetch(`${baseUrl}/calls`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ expertId: 'exp-1', clientId: 'client-1', dureeMax: 5 }),
    });
    const { call } = await startResponse.json();
    await fetch(`${baseUrl}/calls/${call.id}/fin`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dureeReelle: 5 }),
    });

    const reviewResponse = await fetch(`${baseUrl}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callId: call.id,
        reviewerId: 'client-1',
        reviewedId: 'exp-1',
        rating: 5,
        commentaire: 'Super call',
      }),
    });
    assert.strictEqual(reviewResponse.status, 201);
    const expertResponse = await fetch(`${baseUrl}/experts/exp-1`);
    const expert = await expertResponse.json();
    assert.ok(expert.note_moyenne >= 4.8);
    assert.ok(expert.nombre_avis >= 1);
  });
});
