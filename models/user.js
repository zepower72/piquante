//Déclaration des constantes
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

//Schéma pour utiliser une adresse email unique
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema); //

