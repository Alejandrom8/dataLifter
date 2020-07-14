const MapSubjects = require('../lifters/MapSubjects'),
      MapMaterials = require('../lifters/MapMaterials'),
      Semestre = require('../entities/Semestre'),
      Joiner = require('../normalizers/Joiner');

class SemesterCreator {
    constructor(semesterID = 1){
        this.semesterID = semesterID;
    }

    async createSemester(semesterID_optional = ''){
        let id = semesterID_optional || this.semesterID;

        let subjects_manager = new MapSubjects(id);
        let materials_manager = new MapMaterials(id);

        let result = {success: false};
    
        try{
            console.log(`getting subjects`);
            let subjects = await subjects_manager.getSubjects();
            console.log(`getting materials`);
            let materials = await materials_manager.getMateriales();
        
            if(!subjects.success || !materials.success){
                throw subjects.errors || materials.errors;
            }
        
            console.log(`All resources get it right`);
            let join_manager = new Joiner(subjects.data, materials.data);
            console.log(`Joining data`);
            let joined = join_manager.joinThem();
        
            let semester = new Semestre(id, joined);
            result.data = semester;
            result.success = true;
        }catch(error){
            console.log(error);
            result.errors = error;
        }
        
        return result;
    }
}

module.exports = SemesterCreator;