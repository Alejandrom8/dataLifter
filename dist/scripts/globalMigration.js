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
let SEMESTER = parseInt(process.env.SEMESTER);
if (!SEMESTER) {
    console.log("SEMESTER option is not specified");
    return;
}
(function main() {
    return __awaiter(this, void 0, void 0, function* () {
        /**
         * This function should create the records into the FCA database for the
         * subjects, modules and activities for an specified semester:
         * 1. generate subjects
         * 2. generate modules and activities
         * 3. migrate subjects
         * 4. migrate modules and activities
         */
        const start = Date.now(); // starting time
        //getting subjects.
        let subjectsCreatorManager = new Subjects_creator_1.default(SEMESTER);
        let pureSubjects = yield subjectsCreatorManager.createSubjects();
        console.log(`Created ${pureSubjects.length} subjects`);
        //getting modules and activities for each subject.
        let [modulesToMigrate, activitiesToMigrate] = yield createModulesAndActivities(pureSubjects);
        let migrators = [MigrateSubjects_1.default, MigrateModules_1.default, MigrateActivities_1.default];
        let elementsToMigrate = [pureSubjects, modulesToMigrate, activitiesToMigrate];
        let labels = ['subjects', 'modules', 'activities'];
        for (let i = 0; i < elementsToMigrate.length; i++) {
            let ok = yield migrateObjects(migrators[i], elementsToMigrate[i], labels[i]);
            if (!ok)
                break;
        }
        console.log(`Program finished in : ${Date.now() - start}ms`);
    });
})();
function migrateObjects(migrator, objects, label) {
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
function createModulesAndActivities(subjects) {
    return __awaiter(this, void 0, void 0, function* () {
        let modulesToMigrate = [], activitiesToMigrate = [];
        for (let subject of subjects) {
            //creating modules and activities
            let modulesCreatorManager = new Modules_creator_1.default(subject);
            let result = yield modulesCreatorManager.createModules();
            modulesToMigrate.push(...result.modules);
            activitiesToMigrate.push(...result.activities);
            console.log(`subject ${subject.key.key}`);
            console.log(`----Created ${result.modules.length} modules`);
            console.log(`----Created ${result.activities.length} activities`);
        }
        return [modulesToMigrate, activitiesToMigrate];
    });
}
//# sourceMappingURL=globalMigration.js.map