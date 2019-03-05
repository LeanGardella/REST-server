// ***************************************************
// ***                    PORT                     ***
// ***************************************************
process.env.PORT = process.env.PORT || 3000;


// ***************************************************
// ***                  ENTORNO                    ***
// ***************************************************

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ***************************************************
// ***                    BD                       ***
// ***************************************************

let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;

// ***************************************************
// ***                VENCIMIENTO                  ***
// ***************************************************

// 30 días, en segundos.
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// ***************************************************
// ***                   SEED                      ***
// ***************************************************

// En Heroku se declara la variable SEED, sino se usa la de desarrollo.
process.env.SEED = process.env.SEED || 'este-es-el-seed-de-desarrollo';


// Google client ID
process.env.CLIENT_ID = process.env.CLIENT_ID || '702717162989-kje5ujm8tamuf1d27cesc5885nkcn3p9.apps.googleusercontent.com';