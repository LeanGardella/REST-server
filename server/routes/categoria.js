const express = require('express');

// middlewares
const { verificaToken, verificaAdminRole } = require('../middleware/autenticacion');

const app = express();

const Categoria = require('../models/categoria');

const _ = require('underscore'); // libreria underscore

// Mostra todas las categorias
app.get('/categoria', verificaToken, (req, res) => {
    let condicion = {};
    Categoria.find(condicion) // el segundo parámetro, string, me permite definir que campos quiero mostrar; no lo uso acá
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Categoria.count(condicion, (err, cuenta) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                res.json({
                    ok: true,
                    cuenta,
                    categorias
                });
            });
        });
});

// Mostrar categoria por id
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categDB
        });
    });
});

// Crear una nueva categoria
app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;

    let categ = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });


    categ.save((err, categDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                msg: err
            });
        }
        res.json({
            ok: true,
            categoria: categDB
        });
    });
});

// Actualizar categoria
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion']);

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categDB
        });
    });
});

// Borrar categoria
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    // solo un admin puede borrar
    let id = req.params.id;

    Categoria.findByIdAndDelete(id, (err, categDB) => { // Eliminar de la base una categoria
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categDB
        });
    });
});

module.exports = app;