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
const DataBase_1 = __importDefault(require("../DataBase"));
class MigrateSubjects {
    /**
     *
     * @param subjects - the subjects to be migrated
     */
    constructor(subjects) {
        this.subjects = subjects;
    }
    /**
     * @returns {Promise} {succes, errors?}
     */
    migrate() {
        return __awaiter(this, void 0, void 0, function* () {
            let result = { success: false };
            let collection;
            let client;
            try {
                [collection, client] = yield DataBase_1.default.getCollection('subject');
                let insert = yield collection.insertMany(this.subjects);
                if (!insert.result.ok)
                    throw 'No se logro subir correctamente las asignaturas';
                result.success = true;
            }
            catch (error) {
                console.log(error);
                result.errors = error;
            }
            finally {
                client.close();
            }
            return result;
        });
    }
}
exports.default = MigrateSubjects;
//# sourceMappingURL=MigrateSubjects.js.map