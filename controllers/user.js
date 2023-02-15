//Déclaration des constantes
const User = require("../models/user");
const bcrypt = require("bcrypt"); //bcrypt pour crypter le mot de passe
const jwt = require("jsonwebtoken"); //
const passwordValidator = require("password-validator"); // password-validator pour vérifier la complexité du mot de passe
const passwordVerify = new passwordValidator();
require("dotenv").config(); // pour utiliser les variables d'environnement

// Condition de mot de passe avec les options de Password validator
passwordVerify 
  .is()
  .min(8)
  .is()
  .max(50)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits()
  .has()
  .not()
  .symbols();

// Partie Inscription
exports.signup = (req, res, next) => {
  if (!passwordVerify.validate(req.body.password)) { // Si le mot de passe ne correspond pas aux options de passwordVerify
    bcrypt // On crypte le mot de passe
      .hash(req.body.password, 10)// On hash le mot de passe avec 10 tours de cryptage
      .then((hash) => { // On crée un nouvel utilisateur avec le mot de passe crypté
        const user = new User({ // On crée un nouvel utilisateur
          email: req.body.email, // On récupère l'email
          password: hash, // On récupère le mot de passe crypté
        });
        user // On enregistre l'utilisateur
          .save()
          .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
          .catch((error) => res.status(400).json({ error }));
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).json({ error });
      });
  }
};
// Partie Connexion
exports.login = (req, res, next) => { // On récupère l'utilisateur
  User.findOne({ email: req.body.email }) // On cherche l'utilisateur dans la base de données
    .then((user) => { // On récupère l'utilisateur
      if (!user) { // Si l'utilisateur n'existe pas
        return res.status(401).json({ error: "Utilisateur non trouvé !" });//on renvoie une erreur
      }
      bcrypt // On compare le mot de passe
        .compare(req.body.password, user.password) // On compare le mot de passe entré avec le mot de passe crypté
        .then((valid) => { // On récupère le résultat de la comparaison
          if (!valid) { // Si le mot de passe n'est pas valide
            return res.status(401).json({ error: "Mot de passe incorrect !" }); // On renvoie une erreur
          }
          res.status(200).json({ //si le mot de passe est valide
            userId: user._id, // On renvoie l'ID de l'utilisateur
            token: jwt.sign({ userId: user._id }, process.env.SECRET_TOKEN, { // On renvoie un token
              expiresIn: "24h", // qui expire dans 24h
            }),
          });
        })
        .catch((error) => res.status(500).json({ error })); //Erreur serveur
    })
    .catch((error) => res.status(500).json({ error }));