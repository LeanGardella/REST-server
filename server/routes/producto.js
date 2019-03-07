const express = require('express');

// middlewares
const { verificaToken } = require('../middleware/autenticacion');

const app = express();
const _ = require('underscore'); // libreria underscore

const Producto = require('../models/producto');

// Listar productos
app.get('/producto', verificaToken, (req, res) => {
    // trae todos
    //populate categoria y usuario
    // paginado

    let condicion = { disponible: true };

    let desde = Number(req.query.desde || 0);
    let limite = Number(req.query.limite || 5);

    Producto.find(condicion, 'nombre precioUni descripcion disponible categoria usuario') // el segundo parámetro, string, me permite definir que campos quiero mostrar.
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Producto.count(condicion, (err, cuenta) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                res.json({
                    ok: true,
                    cuenta,
                    productos
                });
            });
        });
});

// Buscar productos
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
    let regex = new RegExp(req.params.termino, 'i');

    Producto.find({ nombre: regex })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Producto.count({ nombre: regex }, (err, cuenta) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                res.json({
                    ok: true,
                    cuenta,
                    productos
                });
            });
        });
});

// Listar producto por id
app.get('/producto/:id', verificaToken, (req, res) => {
    //populate categoria y usuario
    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, prodDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: prodDB
            });
        });
});

// Crear producto 
app.post('/producto', verificaToken, (req, res) => {
    //grabar categoria y usuario
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion || '',
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });
});

// Actualizar producto 
app.put('/producto/:id', verificaToken, (req, res) => {
    //actualizasr todo, incluso categoria y usuario
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'descripcion', 'disponible', 'categoria', 'precioUni']);

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, prodDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto: prodDB
        });
    });
});

// Eliminar producto 
app.delete('/producto/:id', verificaToken, (req, res) => {
    // cambiar estado de "disponible" a falso
    let id = req.params.id;

    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true }, (err, prodDB) => { // Marca como disponible false, para indicar que no hay
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto: prodDB
        });
    });
});

module.exports = app;