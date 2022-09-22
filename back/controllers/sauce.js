const Sauce = require('../models/Sauce');
//const fs = require('fs');

//CREER une sauce
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


//MODIFIER une sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    //Ajout de la nouvelle image
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
  } : { ...req.body };
  delete sauceObject._userId;
  Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        if(sauce.userId != req.auth.userId) {
          res.status(401).json({ message: "non autorisé" });
        } else {
    //mise à jour de la base de donnée
      Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => { res.status(200).json({ message: 'Sauce modifiée!' }); })
        .catch( error => { res.status(401).json({ error })});
      }
  
  })
  .catch( error => { res.status(400).json({ error })}); 
};


//SUPPRIMER une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce supprimée' }))
        .catch(error => res.status(400).json({ error }));
};


//AFFICHER UNE sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};


//AFFICHER TOUTES les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then((sauces) => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};


//LIKE, DISLIKE, - LIKE, - DISLIKE
exports.likeDislikeSauce = (req, res, next) => {
    //LIKE
    if(req.body.like === 1) {
      Sauce.updateOne(
        { _id: req.params.id },
        {
          $inc: { likes: req.body.like++ },
          $push: { usersLiked: req.body.userId }
        }
      )
      .then((sauce) => res.status(200).json({ message: "Like ajouté" }))
      .catch((error) => res.status(400).json({ error }));
    }
    //DISLIKE
    else if(req.body.like === -1) {
      Sauce.updateOne(
        { _id:req.params.id },
        {
          $inc: { dislikes: req.body.like++ * -1 },
          $push: {usersDisliked: req.body.userId }
        }
      )
      .then((sauce) => res.status(200).json({ message : "Dislike ajouté"}))
      .catch((error) => res.status(400).json({ error }));
    }
    //Si l'utilisateur a déjà voté et qu'il veut enlever son vote
    else{ 
      Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
          //Si l'utilisateur a déjà mis un like et qu'il l'enlève
          if(sauce.usersLiked.includes(req.body.userId)) {
            Sauce.updateOne(
              { _id: req.params.id },
              { 
                $inc: { likes: -1 },
                $pull: { usersLiked: req.body.userId }
              }
            )
            .then((sauce) => res.status(200).json({ message: "Moins un like" }))
            .catch((error) => res.status(400).json({ error }));
          }
          //Si l'utilisateur a déjà mis un dislike et qu'il l'enlève
          else if(sauce.usersDisliked.includes(req.body.userId)) {
            Sauce.updateOne(
              { _id: req.params.id },
              { 
                $inc: { dislikes: -1 },
                $pull: { usersDisliked: req.body.userId }
              }
            )
            .then((sauce) => res.status(200).json({ message: "Moins un dislike" }))
            .catch((error) => res.status(400).json({ error }));
          }
        })
        .catch((error) => res.status(400).json({ error }));
    }
};

