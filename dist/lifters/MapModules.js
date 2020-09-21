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
const converters_1 = require("../helpers/converters");
const Scraper_1 = __importDefault(require("./Scraper"));
const Modules_1 = __importDefault(require("../entities/groupers/Modules"));
class Line {
    constructor(line) {
        /**
         * get just the numbers of a line of thext.
         * @param {String} line - the line of text where the numbers will be
         * extracted.
         * @returns {String} the first number founded.
         */
        this.getNumber = () => this.getElement(/[0-9]+/g);
        this.line = line;
    }
    /**
     *
     * @param {string} line
     * @param {RegExp} matcher
     * @returns {String} the first element that matches with the matcher RegExp
     */
    getElement(matcher) {
        if (!this.line)
            return '';
        let result = this.line.match(matcher);
        return result ? result[0] : '';
    }
    /**
     *
     * @param {String} line
     * @returns {Boolean} true if the line is '' or null or undefined or does not
     * contain anything but spaces.
     */
    isEmpty() {
        return !this.line ||
            this.line.replace(/\s+/g, '').length === 0;
    }
    /**
     * creates a new string with just letters.
     * @param {String} line
     * @returns {String} a line with just alfabetic characters (a-zA-Z)
     */
    getText() {
        if (!this.line)
            return '';
        let result = this.line.toLowerCase();
        result = result.replace(/[\s.;:,?%0-9]+/g, '');
        return result;
    }
}
class MapActivities {
    /**
     *
     * @param {number} semesterID - the number of the semester to which this
     * activities belongs.
     * @param {String} subjectID - the university key of the subject to which
     * this activities belongs.
     * @param {String} pdfURL - where the data will be scrapped.
     */
    constructor(semesterID, subjectID, pdfURL) {
        this.semesterID = semesterID;
        this.subjectID = subjectID;
        this.pdfURL = pdfURL;
    }
    /**
     * formGroups - the main process of this class. generates a single object
     * that contains the asked activities.
     * @returns {Promise} - the object that contains the modules and
     * the activities for each module.
     */
    formGroups() {
        return __awaiter(this, void 0, void 0, function* () {
            let fileContent = yield Scraper_1.default.scrapPDF(this.pdfURL);
            let modules = this.getModules(fileContent.text);
            let modulesAndActivities = this.getActivities(modules);
            let modulesContainer = new Modules_1.default(this.subjectID, modulesAndActivities);
            return modulesContainer;
        });
    }
    /**
     *
     * @param {String} content - the html content of the scrapped webpage.
     * @returns {Object[]} - an array of objects with the following structure:
     * - object.unidad: Number || String - the number of the module.
     * - object.text: String - the segmented text for each module.
     */
    getModules(content) {
        const lines = content.split('\n').map(l => new Line(l));
        let modules = this.getElements(lines, 'unidad');
        return modules;
    }
    /**
     *
     * @param {Object[]} modules - the array of the segmented subjects.
     * @returns {Object[]} - the new array with the segmented modules and its own
     * activityes. Each object contains the following properties:
     * - object.unidad: Number || String - the number of the module.
     * - object.text: String - the segmented text for each module.
     * - object.actividades: Object[] - the activities for the module.
     */
    getActivities(modules) {
        let modulesAndActivities = modules.map(unity => {
            let lines = unity.text.split('\n').map(l => new Line(l));
            let activities = this.getElements(lines, 'actividad');
            let moduleobj = {
                unidad: unity.unidad,
                actividades: activities
            };
            return moduleobj;
        });
        return modulesAndActivities;
    }
    /**
     * Reads every line of the given text to find the divider. If the divider is
     * found, then this function will form a group for the given divider.
     * @param {String[]} lines - the section of the text where the function will
     * search.
     * @param {String} divider - the delimiter string that should stop the
     * grouping process.
     * @returns {object[]} - an array of the segmented texts divided by the
     * divider argument.
     */
    getElements(lines, divider) {
        let blocks = [];
        let lineText;
        for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
            lineText = lines[lineNumber].getText();
            if (lineText === divider) {
                let { block, analyzedLines } = this.blocker(lineNumber, lines, divider);
                blocks.push(block);
                //We continue where the parser of the blocker function is left.
                lineNumber += analyzedLines - 1;
            }
        }
        return blocks;
    }
    /**
     *
     * @param {Number} index
     * @param {String[]} lines
     * @param {String} divider
     * @returns {Object[]} ??
     */
    blocker(index, lines, divider) {
        let result = { block: null, analyzedLines: 0 }, block = { text: '' }, textLines = [], j = index, blank = 0, currentLine, isNotDivider;
        block[divider] =
            lines[j].getNumber() ||
                lines[j + 1].getNumber() ||
                lines[j + 1];
        currentLine = lines[++j]; //then we skip it to do not work with that text
        do {
            !currentLine.isEmpty() ?
                textLines.push(currentLine.line) :
                blank++;
            j++;
            result.analyzedLines++;
            currentLine = lines[j];
            isNotDivider = currentLine && currentLine.getText() !== divider;
        } while (isNotDivider && blank < 10 && j < lines.length);
        block.text = converters_1.arrayToText(textLines);
        result.block = block;
        return result;
    }
}
exports.default = MapActivities;
module.exports = MapActivities;
//FAST TEST
// (async function main(){
//     let url = 'http://fcaenlinea1.unam.mx/planes_trabajo/deliver.php?f=asesor/upload/1353_TODOS.pdf';
//     console.log(`Getting materials from: ${url}`);
//     let time = Date.now();
//     let mapper = new MapActivities(3, '1353', url);
//     let result = await mapper.formGroups();
//     console.log(`RESOLVED IN ${Date.now() - time}ms`);
//     // console.log(result);
//     for(let uni of result.modules){
//         console.log(uni);
//         // for(let act of uni.actividades){
//         //     console.log(act);
//         // }
//     }
// })();
//# sourceMappingURL=MapModules.js.map