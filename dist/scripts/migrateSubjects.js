var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const SubjectsCreator = require('../creators/Subjects.creator');
const MigrateSubjects = require('../migrations/MigrateSubjects');
const semester = process.env.SEMESTER || 1;
function generateSubjects(semesterID) {
    return __awaiter(this, void 0, void 0, function* () {
        let subjects_manager = new SubjectsCreator(semesterID);
        let subjects = yield subjects_manager.createSubjects();
        if (!subjects) {
            console.log('No se obtuvieron las asignaturas');
            return;
        }
        return subjects;
    });
}
function migrateSubjecs(subjects) {
    return __awaiter(this, void 0, void 0, function* () {
        let migration_manager = new MigrateSubjects(subjects);
        let result = yield migration_manager.uploadSubjects();
        return result.success;
    });
}
(function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let subjects = yield generateSubjects(semester);
        let migration_result = yield migrateSubjecs(subjects);
        migration_result ?
            console.log('Se han insertado correctamente las asignaturas') :
            console.log('Hubo un error durante la migración de las asignaturas');
    });
})();
//# sourceMappingURL=migrateSubjects.js.map