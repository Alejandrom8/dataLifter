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
const Subject_1 = __importDefault(require("../entities/Subject"));
const Scraper_1 = __importDefault(require("./Scraper"));
const config_json_1 = __importDefault(require("../config.json"));
const sorters_1 = require("../normalizers/sorters");
class MapSubjects {
    constructor(semesterID) {
        this.semesterID = semesterID;
        this.baseURL = config_json_1.default.scraping.baseURLForSubjects;
        this.subjectKeys = [];
    }
    /**
     * @returns {Promise} - {success, errors?, data?}
     */
    getSubjects() {
        return __awaiter(this, void 0, void 0, function* () {
            let result = { success: false };
            const url = this.baseURL + this.semesterID;
            console.log(`Getting subjects for semester: ${this.semesterID}. From: ${url}`);
            try {
                const pageContent = yield Scraper_1.default.scrap(url, 'latin1');
                let asignaturas = this.processHTML(pageContent);
                if (!asignaturas)
                    throw 'Hubo un error al completar las asignaturas';
                asignaturas = sorters_1.sortSubjects(asignaturas);
                result.data = asignaturas;
                result.success = true;
            }
            catch (err) {
                result.errors = err;
            }
            return result;
        });
    }
    /**
     * If the font change, this function should be adapted to extract the specified
     * data from the new page.
     * @param {String} html - the html content from where will be extracted the
     * subjects.
     * @return {Subject[]} the extracted subjects.
     */
    processHTML(html) {
        const filter = element => element.children[0].data;
        const subjectElementsClassifier = {
            cssSelector: 'td[width="87%"].asignatura > strong',
            html: html,
            filter: filter
        };
        const keyElementsClassifier = {
            cssSelector: 'td[width=44].grupo > div',
            html: html,
            filter: filter,
            steps: {
                init: 1,
                size: 2
            }
        };
        const urlsElementsClassifier = {
            cssSelector: 'td[width=51].nombre > span.grupo',
            html: html,
            filter: (element) => {
                var _a, _b;
                let generic_link = (_b = (_a = element === null || element === void 0 ? void 0 : element.children[1]) === null || _a === void 0 ? void 0 : _a.attribs) === null || _b === void 0 ? void 0 : _b.href;
                return config_json_1.default.scraping.baseURLForWorkPlans + generic_link; /*here should be generic_link*/
            }
        };
        let subjectNames = Scraper_1.default.getElementsFromHTML(subjectElementsClassifier);
        let keys = Scraper_1.default.getElementsFromHTML(keyElementsClassifier);
        let urls = Scraper_1.default.getElementsFromHTML(urlsElementsClassifier);
        if (subjectNames.length !== keys.length || subjectNames.length !== urls.length) {
            throw 'There was a problem while trying to process the specified html';
        }
        let asignaturas = this.classifySubjects(subjectNames, keys, urls);
        return this.mapImportance(asignaturas);
    }
    /**
     * Groups the extracted info from processHTML into Subject objects.
     * @param {String[]} names - the names of the subjects
     * @param {String[]} keys - the real key of the subject (that obe generated
     * by the university).
     * @param {String[]} pt_urls - an array of URL for the work plans for each
     * subject.
     * @returns {Subject[]} the grouped data into Subject objects.
     */
    classifySubjects(names, keys, pt_urls) {
        let subjects = [];
        for (let subjectIndex in names) {
            let subject = new Subject_1.default(this.semesterID, names[subjectIndex], (keys[subjectIndex]
                .replace(/(^\s*(?!.+)\n+)|(\n+\s+(?!.+)$)/g, "")).trim(), pt_urls[subjectIndex]);
            subjects.push(subject);
            this.subjectKeys.push(subject.key);
        }
        return subjects;
    }
    /**
     * specify if the letter property of the Key object of each Subject should
     * be considered to group the subject. Therefore, sets to true or false the
     * "considerLetter" property of each "key" property of each Subject.
     * @param {Subject[]} subjects - the array of Subject objects that will be
     * mapped.
     */
    mapImportance(subjects) {
        for (let i = 0; i < subjects.length; i++) {
            let current = subjects[i];
            if (typeof current.key.letter !== 'string')
                continue;
            let coincidences = subjects.filter(sub => (current.key.number == sub.key.number));
            if (coincidences.length > 1)
                (subjects[i].key.conciderLetter = true);
        }
        return subjects;
    }
}
exports.default = MapSubjects;
//# sourceMappingURL=MapSubjects.js.map