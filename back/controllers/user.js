const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//S'enregistrer
exports.signup = (req, res, next) => {
    //Hachage du mot de passe
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            //Création du nouvel utilisateur (email entrée et le mot de passe haché)
            const user = new User({
                email: req.body.email,
                password: hash
            });
            //Sauvegarde du nouvel utilisateur
            user.save()
                .then(() => res.status(201).json({message: 'Utilisateur créé'}))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

//Se connecter
exports.login = (req, res, next) => {
    //Rechercher l'email dans la base de données
    User.findOne({ email: req.body.email})
        .then(user => {
            //Si l'email n'est trouvé, renvoyer un message d'erreur
            if(!user) {
                return res.status(401).json({ message: 'Paire identifiant/mot de passe incorrecte' });
            } 
            else {
                //comparer le mot de passe entré avec le hash enregistré dans la base de données
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if(!valid) {
                            return res.status(401).json({ message: 'Paire identifiant/mot de passe incorrecte' });
                        } 
                        else {
                            //Si le mot de passe est valide, renvoie de la réponse avec l'id utilisateur et le token
                            res.status(200).json({
                                userId: user._id,
                                //sign() pour chiffrer un nouveau token (qui contient L'id utilisateur, la clef secret pour crypter le token et la durée de validité du token)
                                token: jwt.sign(
                                    { userId: user._id },
                                    'PIIQUANTE_TOKEN_SECRET',
                                    { expiresIn: '24h' }
                                )
                            })
                        }
                    })
                    .catch(error => res.status(500).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }));
};