const express = require('express');
const multer = require('multer');
// Variable global para almacenar la información del archivo
let uploadedFileInfo;
const fs = require('fs');
const app = express();
const port = 3000;
app.use(express.json());
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

/*// Ruta para cargar el archivo de texto
app.post('/upload', upload.single('file'), (req, res) => {
  res.redirect('/');
});*/
// Ruta para cargar el archivo de texto
/*app.post('/upload', upload.single('file'), (req, res) => {
  // Guardar la información del archivo en la variable global
  uploadedFileInfo = {
    filename: req.file.filename,
    filePath: 'uploads/' + req.file.filename,
  };

  res.redirect('/');
});*/
app.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      throw new Error('No se ha seleccionado ningún archivo.');
    }

    // Resto del código para procesar la carga del archivo...
    // Guardar la información del archivo en la variable global
      uploadedFileInfo = {
           filename: req.file.filename,
         filePath: 'uploads/' + req.file.filename,
          } ;
          res.redirect('/');
        }catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: 'Error durante la carga del archivo.' });
  }
  console.log=(`archivo cargado e la variable ${uploadedFileInfo}`);
});




// Ruta para manejar la solicitud AJAX y recuperar la palabra
app.post('/getWord', (req, res) => {
    try {
      const { lineNumber, wordNumber } = req.body;
      // Utilizar la información del archivo almacenada en la variable global
    const filePath = uploadedFileInfo ? uploadedFileInfo.filePath : '';
      //const filePath = 'uploads/' + req.file.filename;
  
      fs.readFile(filePath, 'utf-8', (err, data) => {
        // Verificar si uploadedFileInfo está definido y su propiedad filePath no está vacía
    if (!uploadedFileInfo || !uploadedFileInfo.filePath) {
      res.status(500).json({ error: true, message: 'No se ha cargado ningún archivo.' });
      return;
    }

    // Verificar si el archivo existe
    if (!fs.existsSync(uploadedFileInfo.filePath)) {
      res.status(500).json({ error: true, message: 'El archivo no existe.' });
      return;
    }
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
