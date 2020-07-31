const MapSubjects = require('../lifters/MapSubjects');
const MapMaterials = require('../lifters/MapMaterials');
const Joiner = require('../normalizers/Joiner');

class SubjectsCreator{
    constructor(semesterID){
        this.semesterID = semesterID;
    }

    async createSubjects(){
        let subject_manager = new MapSubjects(this.semesterID);
        let material_manager = new MapMaterials(this.semesterID);

        try{
            let subjects = await subject_manager.getSubjects();
            let materials = await material_manager.getMateriales();

            if(subjects.errors || materials.errors)
                throw subjects.errors || materials.errors;

            let join_manager = new Joiner(subjects.data, materials.data);
            let joined_data = join_manager.joinThem();

            return joined_data;
        }catch(error){
            console.log(error);
        }
    }
}

module.exports = SubjectsCreator;