const Subject = require('../entities/Subject');

/**
 * this class has the only propouse to merge an Array of Subjects and another of
 * Materials.
 * @class
 */
class Joiner {

    /**
     * 
     * @param {Subject[]} subjectsList 
     * @param {Material[]} materialsList 
     */
    constructor(subjectsList, materialsList) {
        this.subjectsList = subjectsList;
        this.materialsList = materialsList;
    }

    /**
     * Join a list of subject and material objects by it's key number.
     * @returns {Subject[]}
     */
    joinThem() {
        let {subjectsList, materialsList} = this;

        for(let i = 0; i < subjectsList.length; i++) {
            let current = subjectsList[i];
            let {key} = current;
            let [apuntes, actividades] = this.searchCoincidences(
                key,
                materialsList
            );

            subjectsList[i].setMaterials(
                apuntes.length === 1 ? apuntes[0] : apuntes,
                actividades.length === 1 ? actividades[0] : actividades
            );
        }

        return subjectsList;
    }

    /**
     *
     * @param {object} key
     * @param {Material[]} materialsList
     * @returns {[][]}
     */
    searchCoincidences(key, materialsList) {
        //ISSUE - cuando en pt se especifica una letra fuera de orden [a, c, i], 
        //en materialsList se genera otra deacuerdo al orden en el que se leen 
        //las materias, lo que hace que no matche en ningun elemento.
        let apuntes = [], actividades = [];
        
        if(typeof key.letter == 'string' && key.conciderLetter) {
            for(let i = 0; i < materialsList.length; i++) {
                if(materialsList[i].key.number === key.number &&
                    materialsList[i].key.letter === key.letter) {
                    apuntes.push(materialsList[i].apunteURL);
                    actividades.push(materialsList[i].actividadesURL);
                    break;
                }
            }
        } else {
            for(let i = 0; i < materialsList.length; i++){
                if(materialsList[i].key.number === key.number) {
                    apuntes.push(materialsList[i].apunteURL);
                    actividades.push(materialsList[i].actividadesURL);
                }
            }
        }
        return [apuntes, actividades];
    } 
}

module.exports = Joiner;