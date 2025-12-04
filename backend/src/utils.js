function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        const parsed = JSON.parse(body);
        resolve(parsed);
      } catch (error) {
        reject(new Error('Corps de requête invalide.')); 
      }
    });
  });
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
}

function sendHtml(res, statusCode, html) {
  res.writeHead(statusCode, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
}

function notFound(res) {
  sendJson(res, 404, { message: 'Ressource introuvable' });
}

function badRequest(res, message) {
  sendJson(res, 400, { message });
}

module.exports = {
  parseJsonBody,
  sendJson,
  sendHtml,
  notFound,
  badRequest,
};
