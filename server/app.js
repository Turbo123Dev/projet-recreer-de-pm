// server/index.js (ou le nom de votre fichier principal, ex: app.js)

require('dotenv').config(); // Charge les variables d'environnement du fichier .env

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http'); // NOUVEAU: Importe le module HTTP de Node.js
const { Server } = require("socket.io"); // NOUVEAU: Importe la classe Server de socket.io

// Importe vos routes existantes
const authRoutes = require('./routes/authRoutes');
const subjectsRoutes = require('./routes/subjects');
const dashboardRoutes = require('./routes/dashboardRoutes');

// NOUVEAU: Importe le modèle de Message (nous allons le créer juste après)
const Message = require('./models/Message'); // Assurez-vous que ce chemin est correct

const app = express();
const server = http.createServer(app); // NOUVEAU: Crée un serveur HTTP à partir de votre application Express

// Configure le port d'écoute. Utilise 3000 pour être cohérent avec votre configuration locale Ionic.
// Assurez-vous que process.env.PORT est configuré sur Vercel si vous changez le 3000 par défaut.
const PORT = process.env.PORT || 3000;

// Configuration CORS pour Express et Socket.IO
// Pour le développement local, nous autorisons uniquement l'origine de votre frontend Ionic local.
// Lors du déploiement sur Vercel, vous devrez ajouter l'URL de votre frontend Vercel ici.
const allowedOrigins = [
  "http://localhost:8100", // Votre frontend Ionic en développement
  // "https://votre-frontend-soutiens-moi.vercel.app" // À DÉCOMMENTER ET REMPLACER LORS DU DÉPLOIEMENT SUR VERCEL
];

// Middleware Express CORS
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Connexion à la base de données MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connecté à MongoDB Atlas'))
  .catch(err => console.error('Erreur de connexion MongoDB :', err));

// Initialisation de Socket.IO
const io = new Server(server, { // NOUVEAU: Attache Socket.IO au serveur HTTP
    cors: {
        origin: allowedOrigins, // Applique les mêmes origines CORS pour Socket.IO
        methods: ["GET", "POST"]
    }
});

// Routes API Express (vos routes existantes)
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectsRoutes);
app.use('/api/dashboard', dashboardRoutes);

// NOUVELLE ROUTE POUR LE CHAT (API REST pour récupérer l'historique)
app.get('/api/messages', async (req, res) => {
    try {
        // Pour un chat simple et général, on récupère les derniers messages.
        // Pour un chat privé, cette route devrait être adaptée pour filtrer
        // les messages entre deux utilisateurs spécifiques (par exemple, via des query params)
        const messages = await Message.find().sort({ timestamp: 1 }).limit(100); // Récupère les 100 derniers messages
        res.json(messages);
    } catch (error) {
        console.error('Erreur lors de la récupération des messages:', error);
        res.status(500).json({ message: 'Erreur serveur interne.' });
    }
});


// Logique Socket.IO
io.on('connection', (socket) => {
    console.log(`Un utilisateur s'est connecté via Socket.IO : ${socket.id}`);

    // Écoute l'événement 'chat message' envoyé par le client
    socket.on('chat message', async (msg) => {
        console.log('Message reçu du client :', msg);
        try {
            // Sauvegarde le message en base de données
            const newMessage = new Message(msg); // Crée une nouvelle instance du modèle Message
            await newMessage.save(); // Sauvegarde le message
            console.log('Message sauvegardé :', newMessage);

            // Émet le message à TOUS les clients connectés via Socket.IO
            // Pour un chat privé, tu devrais gérer des "rooms" ou émettre uniquement
            // aux sockets des utilisateurs concernés.
            io.emit('chat message', { // Renvoie le message complet, y compris l'ID généré par MongoDB
                _id: newMessage._id,
                text: newMessage.text,
                sender: newMessage.sender,
                recipient: newMessage.recipient, // Important pour le backend si tu fais du chat privé
                timestamp: newMessage.timestamp
            });
        } catch (error) {
            console.error('Erreur lors de la sauvegarde ou de l\'émission du message :', error);
        }
    });

    // Gère la déconnexion d'un utilisateur
    socket.on('disconnect', () => {
        console.log(`L'utilisateur ${socket.id} s'est déconnecté.`);
    });
});

// Route de test simple (inchangée)
app.get('/', (req, res) => {
  res.send('API Backend fonctionne !');
});

// Lancement du serveur HTTP (qui gère Express et Socket.IO)
server.listen(PORT, () => { // NOUVEAU: Écoute sur 'server', pas 'app'
  console.log(`Serveur backend démarré sur le port ${PORT}`);
});