class Semestre{
    /**
     * 
     * @param {number} semesterID - numero de semestre
     * @param {[Asignatura]} subjects - lista de asignaturas pertenecientes a este semestre
     */
    constructor(semesterID, subjects = []){
        this.semesterID = semesterID;
        this.subjects = subjects;
    }

    /**
     * 
     * @param {Asignatura} subject
     */
    addSubject(subject){
        this.subjects.push(subject);
    }
}

module.exports = Semestre;