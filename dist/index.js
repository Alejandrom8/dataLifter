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
const stdio_1 = require("stdio");
const semesterMigration_1 = __importDefault(require("./scripts/semesterMigration"));
const truncateSemester_1 = __importDefault(require("./scripts/truncateSemester"));
const options = ['semester migration', 'truncate semester', 'exit'];
(function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let selectedoption;
        do {
            process.stdout.write('\x1Bc');
            selectedoption = yield askOption();
            switch (selectedoption) {
                case 1:
                    yield performSemesterMigration();
                    yield stdio_1.ask('\npress any key to proceed');
                    break;
                case 2:
                    yield performTruncateSemester();
                    yield stdio_1.ask('\npress any key to proceed');
                    break;
                case options.length:
                    break;
                default:
                    console.log('Incorrect option');
                    break;
            }
        } while (selectedoption !== options.length);
        console.log('Program finished...');
        return Promise.resolve();
    });
})();
/**
 * asks the user to select an option of the printed menu
 * and returns it as a number
 */
function askOption() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('\n  Menu');
        options.forEach((opt, i) => console.log(`  ${i + 1}. ${opt}.`));
        return parseInt(yield stdio_1.ask('\nWhich option do you want to perform?'));
    });
}
function semesterIsValid(semester) {
    return !(!semester || semester > 9 || semester < 1);
}
function performSemesterMigration() {
    return __awaiter(this, void 0, void 0, function* () {
        let selectedSemester = parseInt(yield stdio_1.ask('Which semester do you want to migrate? '));
        while (!semesterIsValid(selectedSemester)) {
            selectedSemester = parseInt(yield stdio_1.ask('invalid semester, select other: '));
        }
        yield semesterMigration_1.default(selectedSemester);
    });
}
function performTruncateSemester() {
    return __awaiter(this, void 0, void 0, function* () {
        let selectedSemester = parseInt(yield stdio_1.ask('Which semester do you want to delete? '));
        while (!semesterIsValid(selectedSemester)) {
            selectedSemester = parseInt(yield stdio_1.ask('invalid semester, select other: '));
        }
        yield truncateSemester_1.default(selectedSemester);
    });
}
//# sourceMappingURL=index.js.map