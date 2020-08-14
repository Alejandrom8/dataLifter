module.exports = {
    database: {
        mongodb: {
            url: 'mongodb://localhost:27017',
            db: 'FCA',
            options: {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        }
    },
    scraping: {
        baseURLForMaterials: "http://fcasua.contad.unam.mx/apuntes/interiores/",
        baseURLForSubjects: "http://fcaenlinea1.unam.mx/planes_trabajo/grupos.php?sem=",
        baseURLForWorkPlans: "http://fcaenlinea1.unam.mx/planes_trabajo/",
    }
};