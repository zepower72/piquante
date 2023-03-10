// Déclaration de Multer
const multer = require("multer");

// Déclaration de MIME_TYPES pour indiquer à multer quelles sont les extensions de fichiers autorisées

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// Middleware images
const storage = multer.diskStorage({
  //diskStorage() pour indiquer à multer où enregistrer les fichiers entrants
  destination: (req, file, callback) => {
    //destination() pour indiquer à multer d'enregistrer les fichiers dans le dossier images
    callback(null, "images"); //null pour dire qu'il n'y a pas d'erreur
  },
  //filename() pour indiquer à multer d'utiliser le nom d'origine

  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

module.exports = multer({ storage: storage }).single("image");
