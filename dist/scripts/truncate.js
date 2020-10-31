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
const stdio_1 = require("stdio");
const config_json_1 = __importDefault(require("../config.json"));
/**
 * script para borrar todos los datos de un semestre en especifico
 */
const levels = [
    { collection: 'subject', identifier: 'semesterID' },
    { collection: 'module', identifier: 'subjectID' },
    { collection: 'activity', identifier: 'moduleID' }
];
const RESULTS = { subject: [], module: [], activity: [] };
(function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let SEMESTER, isValid = false;
        do {
            SEMESTER = yield stdio_1.ask("What semester do you want to delete? ");
            isValid = semesterIsValid(SEMESTER);
            if (!isValid)
                console.log("The introduced semester is not valid, try again with other value");
        } while (!isValid);
        console.log("Searching all references for semester " + SEMESTER);
        yield findReferences([parseInt(SEMESTER)]);
        console.log("Attempting to delete the following resources: ");
        console.log(`---Subjects: ${RESULTS.subject.length}`);
        console.log(`---Modules: ${RESULTS.module.length}`);
        console.log(`---Activities: ${RESULTS.activity.length}`);
        let proceed = (yield stdio_1.ask("Do you want to proceed? (Y/n) ")).toLowerCase();
        if (proceed === 'n') {
            console.log("Aborted...");
            return;
        }
        let size = RESULTS.subject.length + RESULTS.module.length + RESULTS.activity.length;
        let progress = new stdio_1.ProgressBar(99, { tickSize: 33 });
        console.log(`Deleting ${size} resources`);
        yield deleteAllReferences(RESULTS, progress);
        console.log("Program finished");
    });
})();
function semesterIsValid(semester) {
    if (!(semester = parseInt(semester)))
        return false;
    if (semester > 9 || semester < 1)
        return false;
    return true;
}
function findReferences(idValues, level = 0) {
    return __awaiter(this, void 0, void 0, function* () {
        if (level === levels.length - 1) {
            return yield getAllReferences(idValues, levels[level].collection, { identifier: levels[level].identifier });
        }
        else {
            yield findReferences(yield getAllReferences(idValues, levels[level].collection, { identifier: levels[level].identifier }), level + 1);
        }
    });
}
function getAllReferences(values, collectionName, { identifier }) {
    return __awaiter(this, void 0, void 0, function* () {
        let references = [];
        for (let id of values) {
            let data = yield getIds(collectionName, {
                identifier,
                idValue: id
            });
            references.push(...data);
        }
        RESULTS[collectionName] = references;
        return references;
    });
}
function getIds(collectionName, { identifier, idValue }) {
    return __awaiter(this, void 0, void 0, function* () {
        let client, collection;
        let querier = {};
        querier[identifier] = idValue;
        try {
            [collection, client] = yield DataBase_1.default.getCollection(collectionName);
            let query = yield new Promise((resolve, reject) => {
                collection.find(querier).toArray((error, data) => {
                    if (error)
                        reject(error);
                    data = data.map(element => (element[collectionName + 'ID']));
                    resolve(data);
                });
            });
            if (!query)
                throw 'there are no results for this query';
            return query;
        }
        catch (error) {
            console.log(error);
        }
        finally {
            client.close();
        }
    });
}
function deleteAllReferences(results, bar) {
    return __awaiter(this, void 0, void 0, function* () {
        let { subjectQuery, moduleQuery, activityQuery } = prepareQueries(results);
        let collection, client;
        try {
            [collection, client] = yield DataBase_1.default.getCollection('activity');
            yield collection.deleteMany({ $or: activityQuery });
            bar.tick();
            yield client.db(config_json_1.default.database.mongodb.db).collection('module').deleteMany({ $or: moduleQuery });
            bar.tick();
            yield client.db(config_json_1.default.database.mongodb.db).collection('subject').deleteMany({ $or: subjectQuery });
            bar.tick();
        }
        catch (error) {
            console.log(error);
        }
        finally {
            client.close();
        }
    });
}
function prepareQueries(results) {
    let result = {
        subjectQuery: results.subject.map(s => ({ subjectID: s })),
        moduleQuery: results.module.map(m => ({ moduleID: m })),
        activityQuery: results.activity.map(a => ({ activityID: a }))
    };
    return result;
}
//# sourceMappingURL=truncate.js.map