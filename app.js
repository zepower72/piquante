// Déclaration des constantes et require
const express = require("express"); // Importation du framework Express
const app = express(); // Création de l'application Express
const mongoose = require("mongoose"); // Importation du package Mongoose
const mongoSanitize = require("express-mongo-sanitize"); // Importation du package Express Mongo Sanitize
const helmet = require("helmet"); // Importation du package Helmet
const path = require("path"); // Importation du package Path

const userRoutes = require("./routes/user"); // Importation des routes pour les utilisateurs
const sauceRoutes = require("./routes/sauce"); // Importation des routes pour les sauces
require("dotenv").config();

// Connexion à la base de données MongoDB
mongoose.set("strictQuery", false); // Pour éviter les erreurs de dépréciation
mongoose
  .connect(process.env.SECRET_DB, { // Utilisation de la variable d'environnement pour la connexion à la base de données
    useNewUrlParser: true, 
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !")) // Si la connexion à la base de données est réussie
  .catch(() => console.log("Connexion à MongoDB échouée !")); // Si la connexion à la base de données échoue

// Configuration des headers pour éviter les erreurs CORS
/* CORS (Cross-Origin Resource Sharing) est un mécanisme qui permet aux ressources d'une origine d'accéder à des ressources 
d'une autre origine. Le CORS permet de prendre en charge des requêtes multi-origines sécurisées et des transferts de données 
entre des navigateurs et des serveurs web.*/

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Accès à l'API depuis n'importe quelle origine
  res.setHeader(
    "Access-Control-Allow-Headers", // Ajout des headers mentionnés aux requêtes envoyées vers l'API
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods", // Envoyer des requêtes avec les méthodes mentionnées
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// Mongo Sanitize pour éviter les injections NoSQL
//Cela éliminera entièrement toutes les entrées avec des caractères interdits dans MongoDB comme le signe '$'.
app.use(mongoSanitize());

// module qui aide à sécuriser vos applications en définissant divers en-têtes HTTP.
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

//Récupération des requetes en format Json
app.use(express.json());

// Gestion des images
//Les fichiers statiques sont des fichiers que les clients téléchargent tels quels depuis le serveur
app.use("/images", express.static(path.join(__dirname, "images")));

// Routes pour les utilisateurs et les sauces

app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);

module.exports = app;
