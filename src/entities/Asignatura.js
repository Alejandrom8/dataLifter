const Clave = require('../entities/Clave');

class Asignatura{
    /**
     *
     * @param {String} nombre - nombre de la asignatura
     * @param {Number} clave - clave de la asignatura
     * @param {String} planDeTrabajoURL - dircción url del plan de trabajo de esta asignatura
     */
    constructor(nombre, clave, planDeTrabajoURL = '', apunteURL = '', actividadesURL = ''){
        this.nombre = nombre;
        this.clave = new Clave(clave);
        this.planDeTrabajoURL = planDeTrabajoURL;
        this.apunteURL = apunteURL;
        this.actividadesURL = actividadesURL;
    }

    setMaterials({apunteURL, actividadesURL} = {}){
        this.apunteURL = apunteURL;
        this.actividadesURL = actividadesURL;
    }

    static mergeSubjects(subject, toMergeSubject){
        return new Asignatura(
            subject.nombre ? subject.nombre : toMergeSubject.nombre,
            subject.clave ? subject.clave : toMergeSubject.clave,
            subject.planDeTrabajoURL ? subject.planDeTrabajoURL : toMergeSubject.planDeTrabajoURL,
            subject.apunteURL ? subject.apunteURL : toMergeSubject.apunteURL,
            subject.actividadesURL ? subject.actividadesURL : toMergeSubject.actividadesURL,
        );
    }
}

module.exports = Asignatura;
