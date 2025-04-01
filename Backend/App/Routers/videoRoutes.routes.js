const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');  // Importar la configuración de Multer

// Ruta para subir un video
router.post('/upload/video', upload.single('video'), (req, res) => {
  if (req.file) {
    // Genera la URL del video
    const videoUrl = `http://192.168.16.246:3003/api/uploads/videosNovedades/${req.file.filename}`;
    console.log('URL del video:', videoUrl);  // Verifica que la URL sea correcta
    res.json({ videoUrl });  // Devuelve la URL
  } else {
    res.status(400).json({ error: 'No se subió un archivo de video.' });
  }
});

module.exports = router;