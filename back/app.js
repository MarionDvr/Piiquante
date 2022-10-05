const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
const app = express();

//Extraire le corps JSON des requêtes
app.use(express.json());

//Connexion à MangoDB
mongoose.connect('mongodb+srv://Piiquante:devroede@cluster0.vxlb0rv.mongodb.net/Piiquante?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//headers pour débloquer les erreurs CORS (Puisque les resuêtes viennent de deux server différents)
app.use((req, res, next) => {
  //accéder à l'API depuis n'importe quelle origine
  res.setHeader('Access-Control-Allow-Origin', '*');
  //envoyer des requêtes avec les méthodes GET, POST, PUT, DELETE, PATCH et OPTIONS
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  //ajouter les headers aux requêtes envoyées vers l'API
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  next();
});

//Attribution des middlewares aux bonnes routes
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
//Indiquer à express qu'il faut gérer la ressource images de manière statique (pour éviter les problèmes de réponse)
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;