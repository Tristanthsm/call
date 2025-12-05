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

describe('Auth API', () => {
  it('enregistre un nouvel utilisateur', async () => {
    const response = await fetch(`${baseUrl}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'demo@example.com', password: 'StrongPass1!' }),
    });

    assert.strictEqual(response.status, 201);
    const payload = await response.json();
    assert.ok(payload.user.id);
    assert.strictEqual(payload.user.email, 'demo@example.com');
    assert.ok(!payload.user.passwordHash);
  });

  it('permet la connexion après inscription', async () => {
    await fetch(`${baseUrl}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'login@example.com', password: 'AnotherPass1!' }),
    });

    const response = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'login@example.com', password: 'AnotherPass1!' }),
    });

    assert.strictEqual(response.status, 200);
    const payload = await response.json();
    assert.ok(payload.token);
    assert.strictEqual(payload.user.email, 'login@example.com');
  });

  it('refuse un email déjà utilisé', async () => {
    await fetch(`${baseUrl}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'duplicate@example.com', password: 'Password#123' }),
    });

    const response = await fetch(`${baseUrl}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'duplicate@example.com', password: 'Password#123' }),
    });

    assert.strictEqual(response.status, 400);
    const payload = await response.json();
    assert.ok(payload.message.includes('Email déjà enregistré'));
  });

  it('refuse une connexion avec un mauvais mot de passe', async () => {
    await fetch(`${baseUrl}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'wrongpass@example.com', password: 'Password#123' }),
    });

    const response = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'wrongpass@example.com', password: 'bad' }),
    });

    assert.strictEqual(response.status, 400);
    const payload = await response.json();
    assert.ok(payload.message.includes('Identifiants invalides'));
  });
});
