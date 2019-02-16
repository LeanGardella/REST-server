// importo la config del servidor.
require('./config/config');

const express = require('express');

// Using Node.js `require()`
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// importo las rutas del usuario
app.use(require('./routes/routes'));

mongoose.set('useCreateIndex', true); // elimina el warning de ensureIndex.

mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err, res) => {
    if (err) throw err;
    console.log("MongoDB ONLINE");
});


app.listen(process.env.PORT, () => console.log("Escuchando el puerto ", process.env.PORT));