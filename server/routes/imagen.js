const fs = require('fs');
const express = require('express');
const path = require('path');

const { verificaTokenURL } = require('../middleware/autenticacion');

let app = express();

app.get('/imagen/:tipo/:img', verificaTokenURL, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImg = path.resolve(__dirname, `../../upload/${tipo}/${img}`);

    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        res.sendFile(path.resolve(__dirname, '../assets/no-image.jpg'));
    }
});

module.exports = app;