//Déclaration des constantes
const express = require("express");
const router = express.Router()
const userCtrl = require("../controllers/user");

// Routes pour s'inscrire ou se connecter 
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;