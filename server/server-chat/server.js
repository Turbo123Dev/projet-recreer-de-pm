const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let messages = [
  { user: 'Admin', text: 'Bienvenue sur le chat de Soutiens-moi !' },
  { user: 'Samy', text: 'Bonjour tout le monde !' }
];

app.get('/messages', (req, res) => {
  res.json(messages);
});

app.post('/messages', (req, res) => {
  const newMessage = req.body;
  if (newMessage && newMessage.user && newMessage.text) {
    messages.push(newMessage);
    console.log('Nouveau message reçu :', newMessage);
    res.status(201).send({ status: 'Message reçu' });
  } else {
    res.status(400).send({ error: 'Le format du message est incorrect.' });
  }
});

app.listen(port, () => {
  console.log(`Le serveur de chat écoute sur http://localhost:${port}`);
});