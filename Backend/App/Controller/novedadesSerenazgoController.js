const NovedadesSerenazgo = require('../Models/NovedadesSerenazgo.model');
const Usuario = require('../Models/usuario.model')
const path = require('path');
const fs = require('fs');

exports.createNovedadSerenazgo = async (req, res) => {
  try {
    const { nombre_cliente, descripcion, latitud, longitud } = req.body;
    const usuarioId = req.userId; // <-- tomado del token

    const foto = req.files?.foto ? req.files.foto[0].filename : null;
    const video = req.files?.video ? req.files.video[0].filename : null;

    const novedad = await NovedadesSerenazgo.create({
      nombre_cliente,
      descripcion,
      latitud,
      longitud,
      foto,
      video,
      usuarioId
    });

    res.status(201).json(novedad);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear novedad' });
  }
};


exports.getAllNovedadesSerenazgo = async (req, res) => {
  try {
    // Obtener todas las novedades sin hacer include o asociación con Usuario
    const novedades = await NovedadesSerenazgo.findAll({
      order: [['created_at', 'DESC']],  // Ordenar por fecha de creación
    });

    res.status(200).json(novedades);  // Retornar las novedades
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las novedades' });
  }
};