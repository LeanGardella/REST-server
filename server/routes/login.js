const express = require('express');
const app = express();
const bcrypt = require('bcrypt'); // encriptar la clave
const jwt = require('jsonwebtoken'); //JWT
const Usuario = require('../models/usuario');

// Google signin
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

// Configuraciones de Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };
}


app.post('/google', async(req, res) => {
    let token = req.body.idtoken;
    let usuarioGoogle = await verify(token).catch(err => {
        return res.status(403).json({
            ok: false,
            err
        });
    });

    Usuario.findOne({ email: usuarioGoogle.email }, (err, usuarioDB) => {
        if (err) { // si ocurre error
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (usuarioDB) { // si el usuario existe
            if (!usuarioDB.google) { //si no es de google
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe usar la autenticación nativa.'
                    }
                });
            } else {
                //renovar token
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
                res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });

            }

        } else { // es un usuario nuevo que no existe en mi bd
            let usuario = new Usuario();
            usuario.nombre = usuarioGoogle.nombre;
            usuario.email = usuarioGoogle.email;
            usuario.google = usuarioGoogle.google;
            usuario.password = ':)';
            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        msg: err
                    });
                }
                res.json({
                    ok: true,
                    usuario: usuarioDB
                });
            });
        }

    });

});


// Login propio

app.post('/login', (req, res) => {
    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, userDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!userDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña inválidos.'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña inválidos.'
                }
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