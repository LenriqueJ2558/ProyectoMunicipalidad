const express = require('express');
const multer = require('multer');
const path = require('path');
const { authJwt } = require("../middleware");
const novedadesSerenazgoController =  require('../Controller/novedadesSerenazgoController'); // Asegúrate de ajustar la ruta
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, path.join(__dirname, '../uploads/imagenesNovedades'));
      } else if (file.mimetype.startsWith('video/')) {
        cb(null, path.join(__dirname, '../uploads/videosNovedades'));
      } else {
        cb(new Error('Tipo de archivo no permitido'), false);
      }
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });
  
  const upload = multer({ storage: storage });
  
  // Ruta para crear una novedad con fotos y videos
  router.post(
    '/novedades-serenazgo',
    [authJwt.verifyToken],
    upload.fields([{ name: 'foto' }, { name: 'video' }]),
    novedadesSerenazgoController.createNovedadSerenazgo
  );
  router.get(
    '/novedades-serenazgo/mis-novedades',
    
    novedadesSerenazgoController.getAllNovedadesSerenazgo
  );
  
  module.exports = router;