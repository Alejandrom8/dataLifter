const MapSubjects = require('../lifters/MapSubjects'),
      MapMaterials = require('../lifters/MapMaterials'),
      Joiner = require('../normalizers/Joiner');

class SubjectsCreator {
    constructor(semesterID) {
        this.semesterID = semesterID;
    }

    /**
     * @returns {Promise} an array with Subject objects.
     */
    async createSubjects() { 
        let subjectManager = new MapSubjects(this.semesterID),
            materialManager = new MapMaterials(this.semesterID);

        try {
            let subjects = await subjectManager.getSubjects();
            let materials = await materialManager.getMaterials();

            if(subjects.errors || materials.errors)
                throw subjects.errors || materials.errors;

            let joinManager = new Joiner(subjects.data, materials.data);
            let joinedData = joinManager.joinThem();

            return joinedData;
        } catch(error) {
            console.log(error);
        }
    }
}

module.exports = SubjectsCreator;