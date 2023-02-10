// Déclaration des constantes et require
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const path = require("path");
const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");
require("dotenv").config();

// Connexion à la base de données MongoDB
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.SECRET_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// Configuration des headers pour éviter les erreurs CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// Mongo Sanitize pour éviter les injections NoSQL 
//Cela éliminera entièrement toutes les entrées avec des caractères interdits dans MongoDB comme le signe '$'.
app.use(mongoSanitize());

// Sécurisation des headers HTTP
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

//Récupération des requetes en format Json
app.use(express.json());

// Gestion des images
app.use("/images", express.static(path.join(__dirname, "images")));

// Routes pour les utilisateurs et les sauces

app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);

module.exports = app;
