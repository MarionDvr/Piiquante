const Sauce = require('../models/Sauce');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject.userId;
    const sauce = new Sauce({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: 0,
      dislikes: 0,
      usersLiked:[],
      usersDisliked:[]
    });
    sauce.save()
        .then(() => { res.status(201).json({message: 'Sauce enregistrée !'})})
        .catch(error => { res.status(400).json({ error }), console.log('error:', error)})
};


exports.modifySauce = (req, res, next) => {
    Sauce.updateOne({ _id: req.params.id }, {...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifiée' }))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce supprimée' }))
        .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then((sauces) => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

exports.likeDislikeSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then((Sauce) => {
      //si l'utilisateur n'a pas encore mis de like
      if(!Sauce.usersLiked.includes(req.body.userId) && req.body.likes === 1){
        Sauce.updateOne(
          {_id: req.params.id},
          //Incrementer like de 1 et mettre le userId dans le tableau usersLiked
          {
            $inc: {likes: 1},
            $push: {usersLiked: req.body.userId}
          }
          )
        .then(() => res.status(201).json({ message : "Je like"}))
        .catch(error => res.status(400).json({ error}));
      }

      //si l'utilisateur a enlevé son like
      else if(Sauce.usersLiked.includes(req.body.userId) && req.body.likes === 0){
        Sauce.updateOne(
          {_id: req.params.id},
          //Incrementer like de -1 et enlever le userId du tableau UserLiked
          {
            $inc: {likes: -1},
            $pull: {usersLiked: req.body.userId}
          }
          )
        .then(() => res.status(201).json({ message : "J'enlève le like"}))
        .catch(error => res.status(400).json({ error}));
      }

      //si l'utilisateur n'a pas encore mis de dislike
      else if(!Sauce.usersDisliked.includes(req.body.userId) && req.body.dislikes === 1){
        Sauce.updateOne(
          {_id: req.params.id},
          //Incrementer like de -1 et mettre le userId dans le tableau usersDisliked
          {
            $inc: {likes: -1},
            $push: {usersDisliked: req.body.userId}
          }
          )
        .then(() => res.status(201).json({ message : "Je dislike"}))
        .catch(error => res.status(400).json({ error}));
      }

      //si l'utilisateur a enlevé son dislike
      else if(Sauce.usersDisliked.includes(req.body.userId) && req.body.dislikes === 0){
        Sauce.updateOne(
          {_id: req.params.id},
          //Incrementer dislike de 1 et enlever le userId du tableau usersDisliked
          {
            $inc: {dislikes: 1},
            $pull: {usersDisliked: req.body.userId}
          }
          )
        .then(() => res.status(201).json({ message : "J'enlève le dislike"}))
        .catch(error => res.status(400).json({ error}));
      }
    })
    .catch(error => res.status(404).json({ error}));
};

