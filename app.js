const express = require('express');
const multer = require('multer');
const fs = require('fs');
const app = express();
const port = 3000;

// Configuración de multer para gestionar la carga de archivos
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

app.use(express.static('public'));

// Página principal con el formulario de carga de archivos
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Ruta para cargar el archivo de texto
app.post('/upload', upload.single('file'), (req, res) => {
  res.redirect('/');
});

// Ruta para manejar la solicitud AJAX y recuperar la palabra
app.post('/getWord', (req, res) => {
    try {
      const { lineNumber, wordNumber } = req.body;
      const filePath = 'uploads/' + req.file.filename;
  
      fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: true, message: 'Error al leer el archivo.' });
          return;
        }
  
        const lines = data.split('\n');
        const line = lines[lineNumber - 1];
  
        if (!line) {
          res.status(500).json({ error: true, message: 'Número de línea fuera de rango.' });
          return;
        }
  
        const words = line.split(' ');
        const word = words[wordNumber - 1];
  
        if (!word) {
          res.status(500).json({ error: true, message: 'Número de palabra fuera de rango.' });
          return;
        }
  
        res.json({ word });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: true, message: 'Error interno del servidor.' });
    }
  });
  

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
