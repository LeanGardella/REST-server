const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

//FS
let fs = require('fs');
let path = require('path');

// default options
app.use(fileUpload({ useTempFiles: true })); // declaro el middleware que transforma los archivos y los mete en req.files

app.put('/upload/:tipo/:id', function(req, res) {
    if (Object.keys(req.files).length == 0) { // manejo el error si no se seleccionaron archivos
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No hay archivos seleccionados.'
            }
        });
    }

    let tipo = req.params.tipo;
    let id = req.params.id;

    // The name of the input field (i.e. "archivoASubir") is used to retrieve the uploaded file
    let archivoASubir = req.files.archivo;
    let nombre = archivoASubir.name;
    let nombreCortado = nombre.split('.');

    // Validar extensión
    let extensionesValidas = ['jpg', 'png', 'gif', 'jpeg', 'pdf'];
    let extension = nombreCortado[nombreCortado.length - 1];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones válidas son ' + extensionesValidas.join(', ') + '.'
            }
        });
    }

    // validar tipo
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos válidos son ' + tiposValidos.join(', ') + '.'
            }
        });
    }

    // modifico el nombre
    nombre = `${id}-${new Date().getTime()}.${extension}`;

    // Use the mv() method to place the file somewhere on your server
    archivoASubir.mv(`upload/${tipo}/${nombre}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });
        if (tipo === 'usuarios')
            imagenUsuario(id, res, nombre);
        if (tipo === 'productos')
            imagenProducto(id, res, nombre);
    });
});


function imagenUsuario(id, res, nombre) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) { //valido error
            borrarArchivo(nombre, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) { // valido que encuentre el usuario
            borrarArchivo(nombre, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado.'
                }
            });
        }

        borrarArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombre; //pongo el nombre del archivo como img del usuario

        usuarioDB.save((err, usuarioGuardado) => {
            if (err) { //valido error
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            return res.json({ // devuelvo el usuario
                ok: true,
                usuario: usuarioGuardado,
                imagen: nombre
            });
        });
    });
}

function imagenProducto(id, res, nombre) {
    Producto.findById(id, (err, productoDB) => {
        if (err) { //valido error
            borrarArchivo(nombre, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) { // valido que encuentre el usuario
            borrarArchivo(nombre, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado.'
                }
            });
        }
        borrarArchivo(productoDB.img, 'productos');
        productoDB.img = nombre; //pongo el nombre del archivo como img del usuario

        productoDB.save((err, productoGuardado) => {
            if (err) { //valido error
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            return res.json({ // devuelvo el producto
                ok: true,
                producto: productoGuardado,
                imagen: nombre
            });
        });
    });
}

function borrarArchivo(file, type) {
    // borrar imagen si ya existía
    let pathImg = path.resolve(__dirname, `../../upload/${type}/${file}`);
    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
    }
}

module.exports = app;