import MapSubjects from '../lifters/MapSubjects';
import MapMaterials from '../lifters/MapMaterials';
import Joiner from '../normalizers/Joiner';
import Subject from '../entities/Subject';
import Material from '../entities/Material';

/**
 * SubjectsCreator it's a "creator", that means that the only purpose of this
 * object it's to generate subject objects according to a certain semesterID.
 * @class
 */
export default class SubjectsCreator {

    public semesterID: number;

    /**
     * 
     * @param {Number} semesterID - the semester where will be selected the
     * subjects.
     */
    constructor(semesterID: number) {
        this.semesterID = semesterID;
    }

    /**
     * creates an array of subjects that belongs to the selected semester.
     * @returns {Promise<Subject[]>} an array with Subject objects.
     */
    async createSubjects(): Promise<Subject[]> {
        try {
            let subjects = await this.createSubjectObjects();
            let materials = await this.createMaterialObjects();
            let joinManager = new Joiner(subjects, materials);
            return joinManager.joinThem();
        } catch(error) {
            console.log(error);
        }
    }

    /**
     * @returns {Promise<Subject[]>} an array of subject objects.
     */
    async createSubjectObjects(): Promise<Subject[]> {
        let subjectManager = new MapSubjects(this.semesterID);
        let subjects = await subjectManager.getSubjects();
        if(!subjects || !subjects.success)
                throw subjects.errors || 'we cannot get the subjects correctly';
        return subjects.data; 
    }

    /**
     * @returns {Promise<Material[]>} an array of material objects.
     */
    async createMaterialObjects(): Promise<Material[]> {
        let materialManager = new MapMaterials(this.semesterID);
        let materials = await materialManager.getMaterials();
        if(!materials || !materials.success)
                throw materials.errors || 'we cannot get the subjects correctly';
        return materials.data;
    }
}