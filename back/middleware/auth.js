const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try { 
        //Extraire le token du header Autorization (tous ce qui est après l'espace)
        const token = req.headers.authorization.split(' ')[1];
        //verify() pour décoder le token (vérifier qu'il est valide)
        const decodedToken = jwt.verify(token, 'PIIQUANTE_TOKEN_SECRET');
        const userId = decodedToken.userId;
        //Extraire l'id utilisateur du token pour l'utiliser pour les routes
        req.auth = {
            userId: userId
        };
        next();
    } catch(error) {
        res.status(403).json({ message: 'unauthorized request' });
    }
};