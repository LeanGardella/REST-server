const express = require('express');
const app = express();
const bcrypt = require('bcrypt'); // encriptar la clave
const jwt = require('jsonwebtoken'); //JWT
const Usuario = require('../models/usuario');

app.post('/login', (req, res) => {
    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, userDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                msg: err
            });
        }
        if (!userDB) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña inválidos.'
            });
        }

        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña inválidos.'
            });
        }
        // LOGIN SUCCESSFUL

        let token = jwt.sign({
            usuario: userDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
        res.json({
            ok: true,
            usuario: userDB,
            token
        });
    });
});


module.exports = app;