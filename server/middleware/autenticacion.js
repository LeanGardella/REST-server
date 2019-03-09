const jwt = require('jsonwebtoken');

// Verificar token

let verificaToken = (req, res, next) => {
    let token = req.get('token'); // leo el token del header del get
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(403).json({ // manejo el error
                ok: false,
                err
            });
        }
        req.usuario = decoded.usuario; //devuelvo el usuario
        next(); // continuo la ejecuciòn normal
    });
};

// Verificar token por url

let verificaTokenURL = (req, res, next) => {
    let token = req.query.token; // leo el token del url del get

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(403).json({ // manejo el error
                ok: false,
                err
            });
        }
        req.usuario = decoded.usuario; //devuelvo el usuario
        next(); // continuo la ejecuciòn normal
    });
};

//Verificar AdminRole
let verificaAdminRole = (req, res, next) => {
    let usuario = req.usuario;

    console.log(JSON.stringify(usuario));

    if (usuario.role !== 'ADMIN_ROLE') {
        return res.status(401).json({ // manejo el error
            ok: false,
            err: {
                message: 'El usuario no tiene permisos suficientes para realizar la acción solicitada.'
            }
        });
    }

    next(); // continuo la ejecuciòn normal
    return;
};


module.exports = {
    verificaToken,
    verificaAdminRole,
    verificaTokenURL
}