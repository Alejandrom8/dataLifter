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

    getPdfsFromSubjects(){
        if(this.subjects.length == 0) return [];
        let links = this.subjects.map(sub => {
            return sub.planDeTrabajoURL;
        });
        return links;
    }
}

module.exports = Semestre;