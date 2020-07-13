const MapSubjects = require('./lifters/MapSubjects'),
      MapMaterials = require('./lifters/MapMaterials'),
      Joiner = require('./normalizers/Joiner');

const semester = process.env.SEMESTER || 1;

async function main(){
    let subjects_manager = new MapSubjects(semester);
    let materials_manager = new MapMaterials(semester);

    let subjects = await subjects_manager.getSubjects();
    let materials = await materials_manager.getMateriales();

    if(!subjects.success || !materials.success){
        console.log(subjects.errors || materials.errors);
        return;
    }
    
    let join_manager = new Joiner(subjects.data, materials.data);
    let joined = join_manager.joinThem();
    console.log(joined);
}

main();