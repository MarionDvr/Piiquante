const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};
//Configurer la destination et le nom de fichier pour les fichiers entrants
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    //Conserver le nom existant du fichier, enlever le point et l'extension et remplacer les espaces par des underscores
    const name = file.originalname.split(".")[0].split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    //Nommer avec le name, la date et l'extension appropriée (grâce à MIME_TYPES)
    callback(null, name + Date.now() + '.' + extension);
  }
});

//capture les fichiers de type image et les enregistres grâce à storage
module.exports = multer({storage: storage}).single('image');