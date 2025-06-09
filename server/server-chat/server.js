// server.js - Configuration du serveur avec Socket.io
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:8100", // URL de ton app Ionic
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Connexion MongoDB
mongoose.connect('mongodb://localhost:27017/soutiens_moi');

// Schémas MongoDB
const messageSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  profilePicture: String,
  role: String, // 'student' ou 'tutor'
  isOnline: { type: Boolean, default: false }
});

const contractSchema = new mongoose.Schema({
  studentId: String,
  tutorId: String,
  subject: String,
  status: String, // 'active', 'completed', 'cancelled'
  createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);
const User = mongoose.model('User', userSchema);
const Contract = mongoose.model('Contract', contractSchema);

// Données fictives pour les tests
const initFakeData = async () => {
  try {
    // Vérifier si les données existent déjà
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      // Créer un étudiant
      await User.create({
        id: 'student_1',
        name: 'Samy Etudiant',
        email: 'samy@email.com',
        profilePicture: 'https://via.placeholder.com/150/007BFF/FFFFFF?text=S',
        role: 'student'
      });

      // Créer des tuteurs fictifs
      const tutors = [
  {
    id: 'tutor_1',
    name: 'Marie Dupont',
    email: 'marie@email.com',
    profilePicture: 'https://i.pravatar.cc/150?img=3',
    role: 'tutor',
    isOnline: true
  },
  {
    id: 'tutor_2',
    name: 'Jean Martin',
    email: 'jean@email.com',
    profilePicture: 'https://i.pravatar.cc/150?img=65',
    role: 'tutor',
    isOnline: false
  },
  {
    id: 'tutor_3',
    name: 'Sophie Leblanc',
    email: 'sophie@email.com',
    profilePicture: 'https://i.pravatar.cc/150?img=47',
    role: 'tutor',
    isOnline: true
  }
];
a
      await User.insertMany(tutors);

      // Créer des contrats fictifs
      const contracts = [
        { studentId: 'student_1', tutorId: 'tutor_1', subject: 'Mathématiques', status: 'active' },
        { studentId: 'student_1', tutorId: 'tutor_2', subject: 'Physique', status: 'active' },
        { studentId: 'student_1', tutorId: 'tutor_3', subject: 'Chimie', status: 'active' }
      ];

      await Contract.insertMany(contracts);
      console.log('Données fictives créées avec succès');
    }
  } catch (error) {
    console.error('Erreur lors de la création des données fictives:', error);
  }
};

// Initialiser les données fictives au démarrage
initFakeData();

// Routes API
app.get('/api/tutors/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    
    // Récupérer les contrats actifs de l'étudiant
    const contracts = await Contract.find({ 
      studentId: studentId, 
      status: 'active' 
    });
    
    // Récupérer les informations des tuteurs
    const tutorIds = contracts.map(contract => contract.tutorId);
    const tutors = await User.find({ 
      id: { $in: tutorIds }, 
      role: 'tutor' 
    });

    // Ajouter les informations du contrat à chaque tuteur
    const tutorsWithContract = tutors.map(tutor => {
      const contract = contracts.find(c => c.tutorId === tutor.id);
      return {
        ...tutor.toObject(),
        subject: contract.subject,
        contractId: contract._id
      };
    });

    res.json(tutorsWithContract);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/messages/:userId/:contactId', async (req, res) => {
  try {
    const { userId, contactId } = req.params;
    
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: contactId },
        { senderId: contactId, receiverId: userId }
      ]
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Gestion des connexions Socket.io
io.on('connection', (socket) => {
  console.log('Utilisateur connecté:', socket.id);

  // Rejoindre une room basée sur l'userId
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`Utilisateur ${userId} a rejoint sa room`);
  });

  // Gérer l'envoi de messages
  socket.on('sendMessage', async (data) => {
    try {
      const { senderId, receiverId, message } = data;

      // Sauvegarder le message en base
      const newMessage = new Message({
        senderId,
        receiverId,
        message,
        timestamp: new Date()
      });

      await newMessage.save();

      // Envoyer le message aux deux utilisateurs
      io.to(senderId).emit('messageReceived', newMessage);
      io.to(receiverId).emit('messageReceived', newMessage);

    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Utilisateur déconnecté:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});