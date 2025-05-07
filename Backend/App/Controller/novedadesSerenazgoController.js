const NovedadesSerenazgo = require('../Models/NovedadesSerenazgo.model'); // Asegúrate de ajustar la ruta al modelo

exports.createNovedad = async (req, res) => {
    try {
      const { nombre_cliente, descripcion, latitud, longitud } = req.body;
  
      // Obtener los nombres de los archivos subidos (foto, video)
      const foto = req.files?.foto?.[0]?.filename || null;
      const video = req.files?.video?.[0]?.filename || null;
  
      // Crear la novedad en la base de datos
      const novedad = await NovedadesSerenazgo.create({
        nombre_cliente,
        descripcion,
        latitud,
        longitud,
        foto,
        video
      });
  
      res.status(201).json(novedad); // Responde con los datos de la novedad creada
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al crear la novedad' });
    }
  };