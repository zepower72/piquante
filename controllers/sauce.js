//Déclaration des constantes
const Sauce = require("../models/Sauce");
const fs = require("fs"); //file system
//Le module fs est livré nativement avec Node js et permet de gérer les fichiers et les dossiers.

//Récupération de toutes les sauces // pas d'id dans la route
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(404).json({ error }));
};
//Récupération d'une sauce // id dans la route
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};
//Création d'une sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce); //transforme le corps de la requête en objet JS
  delete sauceObject._id; //supprime l'id généré automatiquement
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      //création de l'url de l'image
      req.file.filename //récupération du nom du fichier
    }`,
    likes: 0, //initialisation des likes à 0
    dislikes: 0, //initialisation des dislikes à 0
    usersLiked: [" "], //initialisation du tableau des likes à un tableau vide
    usersdisLiked: [" "], //initialisation du tableau des dislikes à un tableau vide
  });
  //fonction en promesse save() pour enregistrer la sauce dans la base de données
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée" }))
    .catch((error) => res.status(400).json({ error }));
};
//Modification d'une sauce

exports.updateSauce = (req, res, next) => { //fonction de modification générale de la sauce
    const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce), //on transforme le corps de la requête en objet JS
        imageUrl: `${req.protocol}://${req.get("host")}/images/${ //on crée l'url de l'image
             req.file.filename //on récupère le nom du fichier
        }`,
      }
    : { ...req.body }; //sinon on récupère le corps de la requête

  Sauce.updateOne( //fonction en promesse updateOne() pour modifier une sauce particulière
    { _id: req.params.id }, //on récupère l'id de la sauce
    { ...sauceObject, _id: req.params.id } //
  )
    .then(res.status(200).json({ message: "Sauce modifiée" }))
    .catch((error) => res.status(400).json({ error }));
};
//Suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) //fonction en promesse findOne() pour trouver la sauce dans la base de données
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1]; //
      fs.unlink(`images/${filename}`, () => {
        //fonction unlink() pour supprimer le fichier image
        Sauce.deleteOne({ _id: req.params.id }) //fonction en promesse deleteOne() pour supprimer la sauce dans la base de données
          .then(res.status(200).json({ message: "Sauce supprimée" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};
//Gestion des likes et dislikes
exports.likeDislikeSauce = (req, res, next) => {
  //fonction likeDislikeSauce() pour gérer les likes et dislikes
  let like = req.body.like; //on récupère le like ou le dis
  let userId = req.body.userId; //on récupère l'id de l'utilisateur
  let sauceId = req.params.id; //on récupère l'id de la sauce

  switch (
    like //switch pour gérer les cas
  ) {
    case 1: //si l'utilisateur aime la sauce
      Sauce.updateOne(
        //fonction en promesse updateOne() pour modifier l'avis sur la sauce dans la base de données
        { _id: sauceId }, //on récupère l'id de la sauce
        { $push: { usersLiked: userId }, $inc: { likes: +1 } } //on incrémente le nombre de likes
      )
        .then(() => res.status(200).json({ message: `J'aime` }))
        .catch((error) => res.status(400).json({ error }));

      break; //on sort du switch

    case 0: //si l'utilisateur annule son avis
      Sauce.findOne({ _id: sauceId }) //fonction en promesse findOne() pour trouver la sauce dans la base de données
        .then((sauce) => {
          //on récupère la sauce
          if (sauce.usersLiked.includes(userId)) {
            //si l'utilisateur a déjà liké la sauce
            Sauce.updateOne(
              // on met à jour la sauce  dans la base de données
              { _id: sauceId }, //on récupère l'id de la sauce
              { $pull: { usersLiked: userId }, $inc: { likes: -1 } } //on décrémente le nombre de likes
            )
              .then(() => res.status(200).json({ message: `Neutre` }))
              .catch((error) => res.status(400).json({ error }));
          }
          if (sauce.usersDisliked.includes(userId)) {
            //si l'utilisateur a déjà disliké la sauce
            Sauce.updateOne(
              // on met à jour la sauce  dans la base de données
              { _id: sauceId }, //
              { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } } // on décrémente le nombre de dislikes
            )
              .then(() => res.status(200).json({ message: `Neutre` }))
              .catch((error) => res.status(400).json({ error }));
          }
        })
        .catch((error) => res.status(404).json({ error }));
      break; //on sort du switch

    case -1: //si l'utilisateur n'aime pas la sauce
      Sauce.updateOne(
        //fonction en promesse updateOne() pour modifier l'avis sur la sauce dans la base de données
        { _id: sauceId }, //on récupère l'id de la sauce
        { $push: { usersDisliked: userId }, $inc: { dislikes: +1 } } //on incrémente le nombre de dislikes
      )
        .then(() => {
          res.status(200).json({ message: `Je n'aime pas` });
        })
        .catch((error) => res.status(400).json({ error }));
      break; //on sort du switch

    default: //si aucun des cas n'est vérifié
      console.log(error); //on affiche l'erreur
  }
};
