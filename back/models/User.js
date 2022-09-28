const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//Création du schéma de données pour les utilisateurs
const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, require:true}
});
//Plugin pour qu'un utilisateur ne soit créé qu'une seule fois (pas possible de créer deux utilisateurs avec la même adresse mail)
userSchema.plugin(uniqueValidator);
//Exportation du schéma en tant que modèle mongoose et disponible pour l'app
module.exports = mongoose.model('User', userSchema);