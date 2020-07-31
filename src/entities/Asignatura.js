const Clave = require('../entities/Clave');

class Asignatura{
    /**
     *
     * @param {String} nombre - nombre de la asignatura
     * @param {Number} clave - clave de la asignatura
     * @param {String} planDeTrabajoURL - dircción url del plan de trabajo de esta asignatura
     */
    constructor(semesterID,
                nombre, 
                clave, 
                planDeTrabajoURL = '', 
                apunteURL = '', 
                actividadesURL = ''){
        this.semesterID = semesterID;
        this.key = this.generateRandomKey();
        this.nombre = nombre;
        this.clave = new Clave(clave);
        this.planDeTrabajoURL = planDeTrabajoURL;
        this.apunteURL = apunteURL;
        this.actividadesURL = actividadesURL;
    }

    generateRandomKey(length = 6){
        let letters = ['A', 'B', 'C', 'D', 'E', 'F'];
        let numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        let elements = [letters, numbers];
        let key = '';

        while(length){
            let list = elements[Math.floor(Math.random() * elements.length)];
            key += list[Math.floor(Math.random() * list.length)];
            length--;
        }

        return key;
    }

    setMaterials({apunteURL, actividadesURL} = {}){
        this.apunteURL = apunteURL;
        this.actividadesURL = actividadesURL;
    }
}

module.exports = Asignatura;
