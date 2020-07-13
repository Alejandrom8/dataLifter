const Clave = require('../entities/Clave');

class Material{
    constructor(clave, apunte, actividades){
        this.clave = new Clave(clave);
        this.apunteURL = apunte;
        this.actividadesURL = actividades;
    }
}

module.exports = Material;