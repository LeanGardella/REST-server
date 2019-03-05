// importo la config del servidor.
require('./config/config');

// Uso express
const express = require('express');

// Uso path de node para resolver ruta public
const path = require('path');

// Using Node.js `require()`
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');

// Hago publica la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// importo las rutas del server
app.use(require('./routes/index'));

mongoose.set('useCreateIndex', true); // elimina el warning de ensureIndex.

mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err, res) => {
    if (err) throw err;
    console.log("MongoDB ONLINE");
});


app.listen(process.env.PORT, () => console.log("Escuchando el puerto ", process.env.PORT));