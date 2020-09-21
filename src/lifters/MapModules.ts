import { arrayToText } from '../helpers/converters';
import Scraper from './Scraper';
import Modules from '../entities/groupers/Modules';
import {Block, BlockingResult, PreModule} from '../types';

class Line {

    public line: string;

    constructor(line: string) {
        this.line = line;
    }

    /**
     * get just the numbers of a line of thext.
     * @param {String} line - the line of text where the numbers will be 
     * extracted.
     * @returns {String} the first number founded.
     */
    public getNumber = (): string => this.getElement(/[0-9]+/g);

    /**
     * 
     * @param {string} line 
     * @param {RegExp} matcher 
     * @returns {String} the first element that matches with the matcher RegExp
     */
    public getElement(matcher: RegExp): string {
        if(!this.line) return '';
        let result = this.line.match(matcher);
        return result ? result[0] : '';
    }

    /**
     * 
     * @param {String} line 
     * @returns {Boolean} true if the line is '' or null or undefined or does not
     * contain anything but spaces.
     */
    public isEmpty(): boolean {
        return !this.line ||
                this.line.replace(/\s+/g, '').length === 0;
    }

    /**
     * creates a new string with just letters.
     * @param {String} line
     * @returns {String} a line with just alfabetic characters (a-zA-Z)
     */
    public getText(): string {
        if(!this.line) return '';
        let result = this.line.toLowerCase();
        result = result.replace(/[\s.;:,?%0-9]+/g, '');
        return result;
    }
}


export default class MapActivities {

    public semesterID: number;
    public subjectID: string;
    public pdfURL: string;

    /**
     * 
     * @param {number} semesterID - the number of the semester to which this
     * activities belongs.
     * @param {String} subjectID - the university key of the subject to which
     * this activities belongs.
     * @param {String} pdfURL - where the data will be scrapped.
     */
    constructor(semesterID: number, subjectID: string, pdfURL: string) {
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
    public async formGroups(): Promise<Modules> {
        let fileContent = await Scraper.scrapPDF(this.pdfURL);
        let modules = this.getModules(fileContent.text);
        let modulesAndActivities = this.getActivities(modules);

        let modulesContainer = new Modules(
            this.subjectID, 
            modulesAndActivities
        );
        return modulesContainer;
    }
    
    /**
     * 
     * @param {String} content - the html content of the scrapped webpage.
     * @returns {Object[]} - an array of objects with the following structure:
     * - object.unidad: Number || String - the number of the module.
     * - object.text: String - the segmented text for each module. 
     */
    private getModules(content: string): Block[] {
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
    private getActivities(modules: Block[]): PreModule[] {
        let modulesAndActivities = modules.map( unity => {
            let lines = unity.text.split('\n').map(l => new Line(l));
            let activities = this.getElements(lines, 'actividad');
            let moduleobj: PreModule = {
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
    private getElements(lines: Line[], divider: string): Block[] {
        let blocks = [];
        let lineText: string;

        for(let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
 
            lineText = lines[lineNumber].getText();

            if(lineText === divider) {
                let { 
                    block,
                    analyzedLines
                } = this.blocker(lineNumber, lines, divider);
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
    private blocker(index: number, lines: Line[], divider: string): BlockingResult {
        let result: BlockingResult = {block: null, analyzedLines: 0},
            block: Block = {text: ''},
            textLines: string[] = [],
            j = index,
            blank = 0, 
            currentLine: Line,
            isNotDivider: boolean;

        block[divider] = 
                lines[j].getNumber() ||
                lines[j+1].getNumber() ||
                lines[j+1];
        
        currentLine = lines[++j];//then we skip it to do not work with that text

        do {
            !currentLine.isEmpty() ?
                textLines.push(currentLine.line) :
                blank++;

            j++;
            result.analyzedLines++;
            currentLine = lines[j];
            isNotDivider = currentLine && currentLine.getText() !== divider;
        } while(isNotDivider && blank < 10 && j < lines.length);

        block.text = arrayToText(textLines);
        result.block = block;

        return result;
    }
}

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