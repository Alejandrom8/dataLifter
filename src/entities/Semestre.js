class Semestre{
    /**
     * 
     * @param {Number} numero - numero de semestre
     * @param {[Asignatura]} asignaturas - lista de asignaturas pertenecientes a este semestre
     */
    constructor(numero, asignaturas = []){
        this.numero = numero;
        this.asignaturas = asignaturas;
    }

    /**
     * 
     * @param {Asignatura} subject
     */
    addSubject(subject){
        this.asignaturas.push(subject);
    }
}

module.exports = Semestre;