const express = require('express');

const app = express();

const bcrypt = require('bcrypt'); // encriptar la clave
const _ = require('underscore'); // libreria underscore

const Usuario = require('../models/usuario');

// middlewares
const { verificaToken, verificaAdminRole } = require('../middleware/autenticacion');

app.get('/usuario', verificaToken,
    function(req, res) {

        let condicion = { estado: true };

        let desde = Number(req.query.desde || 0);
        let limite = Number(req.query.limite || 5);

        Usuario.find(condicion, 'nombre email role google estado img') // el segundo parámetro, string, me permite definir que campos quiero mostrar.
            .skip(desde)
            .limit(limite)
            .exec((err, usuarios) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        msg: err
                    });
                }
                Usuario.count(condicion, (err, cuenta) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            msg: err
                        });
                    }
                    res.json({
                        ok: true,
                        cuenta,
                        usuarios
                    });
                });
            });
    });

app.post('/usuario', [verificaToken, verificaAdminRole], function(req, res) {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

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
});

app.put('/usuario/:id', [verificaToken, verificaAdminRole], function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'img', 'email', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                msg: err
            });
        }
        res.json({
            ok: true,
            usuario: userDB
        });
    });

});

app.delete('/usuario/:id', [verificaToken, verificaAdminRole], function(req, res) {
    let id = req.params.id;

    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, userDB) => { // Marca como estado false, para indicar que esta inactivo
        if (err) {
            return res.status(400).json({
                ok: false,
                msg: err
            });
        }
        res.json({
            ok: true,
            usuario: userDB
        });
    });

});

module.exports = app;