"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MapSubjects_1 = __importDefault(require("../lifters/MapSubjects"));
const MapMaterials_1 = __importDefault(require("../lifters/MapMaterials"));
const Joiner_1 = __importDefault(require("../normalizers/Joiner"));
/**
 * SubjectsCreator it's a "creator", that means that the only purpose of this
 * object it's to generate subject objects according to a certain semesterID.
 * @class
 */
class SubjectsCreator {
    /**
     *
     * @param {Number} semesterID - the semester where will be selected the
     * subjects.
     */
    constructor(semesterID) {
        this.semesterID = semesterID;
    }
    /**
     * creates an array of subjects that belongs to the selected semester.
     * @returns {Promise<Subject[]>} an array with Subject objects.
     */
    createSubjects() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let subjects = yield this.createSubjectObjects();
                let materials = yield this.createMaterialObjects();
                let joinManager = new Joiner_1.default(subjects, materials);
                return joinManager.joinThem();
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    /**
     * @returns {Promise<Subject[]>} an array of subject objects.
     */
    createSubjectObjects() {
        return __awaiter(this, void 0, void 0, function* () {
            let subjectManager = new MapSubjects_1.default(this.semesterID);
            let subjects = yield subjectManager.getSubjects();
            if (!subjects || !subjects.success)
                throw subjects.errors || 'we cannot get the subjects correctly';
            return subjects.data;
        });
    }
    /**
     * @returns {Promise<Material[]>} an array of material objects.
     */
    createMaterialObjects() {
        return __awaiter(this, void 0, void 0, function* () {
            let materialManager = new MapMaterials_1.default(this.semesterID);
            let materials = yield materialManager.getMaterials();
            if (!materials || !materials.success)
                throw materials.errors || 'we cannot get the subjects correctly';
            return materials.data;
        });
    }
}
exports.default = SubjectsCreator;
//# sourceMappingURL=Subjects.creator.js.map