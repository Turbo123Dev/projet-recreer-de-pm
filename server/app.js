const express = require('express')
const app = express(); // Crée une instance de l'application Express
const port = 3000; // Définit le port sur lequel ton serveur va écouter

// Définit une "route" : quand quelqu'un va sur la page d'accueil (/)
app.get('/', (req, res) => {
  res.send('Bonjour du serveur Express !'); // Envoie cette réponse
});

// Demarre le serveur et écoute sur le port défini
app.listen(port, () => {
  console.log(`Serveur Express démarré sur http://localhost:${port}`);
});