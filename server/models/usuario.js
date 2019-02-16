const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator'); // validar que no haya mails repetidos 

let Schema = mongoose.Schema;

let rolesValidos = { // enum para validar el role
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: 'El rol {VALUE} no es válido.'
};

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido.']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es requerido.']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerida.']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});


usuarioSchema.methods.toJSON = function() {
    let user = this.toObject();
    delete user.password;
    return user;
};

usuarioSchema.plugin(uniqueValidator, { message: 'El {PATH} especificado ya se encuentra en uso.' });

module.exports = mongoose.model('Usuario', usuarioSchema);