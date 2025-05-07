require('dotenv').config();
const express = require("express");
const cors = require("cors");
const path = require('path');
const fs = require('fs');

const empleado = require('./App/Routers/empleado.routes')
const actividad = require ('./App/Routers/actividad.routes')
const InfoEstudio = require ('./App/Routers/infoEstudio.routes.js')
const NovedadesCamara = require ('./App/Routers/novedades.routes.js')
const InfoEmpleado = require('./App/Routers/info_empleado.routes.js')
const ReporteEmpleado = require('./App/Routers/reporte.routes.js')
const NombreSupervisores = require('./App/Routers/Supervisores.routes.js')
const tipodeincidencias = require('./App/Routers/tipoDeIncidencias.routes.js')
const sequelize = require('./App/config/db.config');
const videoRoutes = require('./App/Routers/videoRoutes.routes.js');
const novedadesSerenazgoRoutes = require('./App/Routers/novedadesSerenazgoRoutes.js');

const app = express();

app.get('/api/uploads/videosNovedades/:videoName', (req, res) => {
    const videoName = req.params.videoName;
    const videoPath = path.join(__dirname, 'App', 'uploads', 'videosNovedades', videoName);

    fs.stat(videoPath, (err, stats) => {
        if (err) {
            return res.status(404).send('Video no encontrado');
        }

        const videoSize = stats.size;
        const range = req.headers.range;

        if (range) {
            // Si hay una solicitud con el encabezado Range (para streaming)
            const CHUNK_SIZE = 10 ** 6; // 1MB
            const start = Number(range.replace(/\D/g, ""));
            const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
            const contentLength = end - start + 1;

            // Establecer los encabezados adecuados para el rango
            res.writeHead(206, {
                "Content-Range": `bytes ${start}-${end}/${videoSize}`,
                "Accept-Ranges": "bytes",
                "Content-Length": contentLength,
                "Content-Type": "video/mp4",
            });

            const videoStream = fs.createReadStream(videoPath, { start, end });
            videoStream.pipe(res);
        } else {
            // Si no hay Range, enviar el archivo completo
            res.writeHead(200, {
                "Content-Length": videoSize,
                "Content-Type": "video/mp4",
            });

            fs.createReadStream(videoPath).pipe(res);
        }
    });
});
// Middleware CORS
app.use(cors());
app.use(cors({
    origin: '*', // Cambia esto a tu dominio frontend si es necesario
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Range'] // Permite el encabezado 'Range'
}));

// Middleware para parsear JSON y URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Hola desde Render");
});
require("./App/Routers/auth.routes.js")(app);
require("./App/Routers/user.routes.js")(app);

// Rutas API
app.use('/api',empleado,actividad,NovedadesCamara,InfoEstudio,InfoEmpleado,ReporteEmpleado,NombreSupervisores,tipodeincidencias,videoRoutes);
app.use('/api/mobile', novedadesSerenazgoRoutes);
// Ruta para archivos estáticos (imagenes de empleados)
app.use('/ProyectoMuni/App/imagenesEmpleados', express.static(path.join(__dirname, 'App/imagenesEmpleados')));

// Ruta para servir videos de la carpeta correcta
app.use('/api/uploads/videosNovedades', express.static(path.join(__dirname, 'App', 'uploads', 'videosNovedades')));

// Sincronización de Sequelize y escucha del servidor
const PORT = process.env.PORT || 3003;
sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
}).catch((error) => {
    console.error('Error al sincronizar con la base de datos:', error);
});