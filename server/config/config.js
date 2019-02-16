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
    urlDB = 'mongodb+srv://admin:admin@cluster0-pligm.gcp.mongodb.net/cafe?retryWrites=true';
}
process.env.URLDB = urlDB;