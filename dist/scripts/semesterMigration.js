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
const Subjects_creator_1 = __importDefault(require("../creators/Subjects.creator"));
const Modules_creator_1 = __importDefault(require("../creators/Modules.creator"));
const MigrateSubjects_1 = __importDefault(require("../migrations/MigrateSubjects"));
const MigrateModules_1 = __importDefault(require("../migrations/MigrateModules"));
const MigrateActivities_1 = __importDefault(require("../migrations/MigrateActivities"));
/**
 * This function should create the records into the FCA database for the
 * subjects, modules and activities for an specified semester:
 * 1. generate subjects
 * 2. generate modules and activities
 * 3. migrate subjects
 * 4. migrate modules and activities
 */
function semesterMigration(SEMESTER) {
    return __awaiter(this, void 0, void 0, function* () {
        const start = Date.now(); //counting execution time
        //getting subjects for indicated semester.
        let subjectsCreatorManager = new Subjects_creator_1.default(SEMESTER);
        let pureSubjects = yield subjectsCreatorManager.createSubjects();
        console.log(`Created ${pureSubjects.length} subjects`);
        //getting modules and activities for each subject.
        let [modulesToMigrate, activitiesToMigrate] = yield createModulesAndActivities(pureSubjects);
        yield Promise.all([
            { label: 'subjects', migrator: MigrateSubjects_1.default, objects: pureSubjects },
            { label: 'modules', migrator: MigrateModules_1.default, objects: modulesToMigrate },
            { label: 'activities', migrator: MigrateActivities_1.default, objects: activitiesToMigrate }
        ].map((tm) => __awaiter(this, void 0, void 0, function* () { return yield migrateObjects(tm); })));
        console.log(`Program finished in : ${Date.now() - start}ms`);
    });
}
exports.default = semesterMigration;
/**
 *
 * @param {} subjects
 */
function createModulesAndActivities(subjects) {
    return __awaiter(this, void 0, void 0, function* () {
        let modulesToMigrate = [];
        let activitiesToMigrate = [];
        for (let subject of subjects) {
            let modulesCreatorManager = new Modules_creator_1.default(subject);
            let { modules, activities } = yield modulesCreatorManager.createModules();
            modulesToMigrate.push(...modules);
            activitiesToMigrate.push(...activities);
            console.log(`subject ${subject.key.key}`);
            console.log(`----Created ${modules.length} modules`);
            console.log(`----Created ${activities.length} activities`);
        }
        return [modulesToMigrate, activitiesToMigrate];
    });
}
function migrateObjects({ label, migrator, objects }) {
    return __awaiter(this, void 0, void 0, function* () {
        let migrationManager = new migrator(objects);
        let result = yield migrationManager.migrate();
        if (!result.success) {
            console.log(result.errors);
            return false;
        }
        console.log("Migrated " + objects.length + " " + label);
        return true;
    });
}
//# sourceMappingURL=semesterMigration.js.map