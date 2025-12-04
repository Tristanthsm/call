const { createServer } = require('./app');

const port = Number(process.env.PORT || 4000);
const server = createServer();

server.listen(port, () => {
  // Journalisation simple pour le MVP
  console.log(`Nexbuzzer API démarrée sur http://localhost:${port}`);
});
