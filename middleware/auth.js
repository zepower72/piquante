//Déclaration des constantes
const jwt = require("jsonwebtoken"); //on importe le package jsonwebtoken
require("dotenv").config();//on importe le package dotenv

// Middleware pour l'authentification
module.exports = (req, res, next) => {
  try { // on utilise try/catch pour gérer les erreurs
    const token = req.headers.authorization.split(" ")[1]; //on récupère le token dans le header de la requête
    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN); //on utilise la fonction verify() pour décoder le token
    const userId = decodedToken.userId; //on extrait l'userId du token
    if (req.body.userId && req.body.userId !== userId) { //on compare l'userId extrait du token avec celui de la requête
      throw "Invalid user ID"; //si les deux ne correspondent pas on renvoie une erreur
    } else { //si les deux correspondent on passe au middleware suivant
      next();
    }
  } catch { //si une erreur est détectée on renvoie un statut 401 Unauthorized
    res.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
};
