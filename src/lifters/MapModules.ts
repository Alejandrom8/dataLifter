import { arrayToText } from '../helpers/converters'
import Scraper from './Scraper'
import Modules from '../entities/groupers/Modules'
import { Block, BlockingResult, PreModule } from '../types'
import Line from './Line'

export default class MapActivities {

    public semesterID: number
    public subjectID: string
    public pdfURL: string

    /**
     * 
     * @param {number} semesterID - the number of the semester to which this
     * activities belongs.
     * @param {String} subjectID - the university key of the subject to which
     * this activities belongs.
     * @param {String} pdfURL - where the data will be scrapped.
     */
    constructor (semesterID: number, subjectID: string, pdfURL: string) {
        this.semesterID = semesterID
        this.subjectID = subjectID
        this.pdfURL = pdfURL
    }

    /**
     * formGroups - the main process of this class. generates a single object
     * that contains the asked activities.
     * @returns {Promise} - the object that contains the modules and
     * the activities for each module.
     */
    public async formGroups (): Promise<Modules> {
        let fileContent = await Scraper.scrapPDF(this.pdfURL)
        let modules = this.getModules(fileContent.text)
        let modulesAndActivities = this.getActivities(modules)

        return new Modules(
            this.subjectID, 
            modulesAndActivities
        )
    }
    
    /**
     * 
     * @param {String} content - the html content of the scrapped webpage.
     * @returns {Object[]} - an array of objects with the following structure:
     * - object.unidad: Number || String - the number of the module.
     * - object.text: String - the segmented text for each module. 
     */
    private getModules (content: string): Block[] {
        const lines = content.split('\n').map(l => new Line(l))
        return this.getElements(lines, 'unidad')
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
    private getActivities (modules: Block[]): PreModule[] {
        return modules.map( unity => {
            let lines = unity.text.split('\n').map(l => new Line(l))
            let activities = this.getElements(lines, 'actividad')
            return {
                unidad: unity.unidad,
                actividades: activities
            }
        })
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
    private getElements (lines: Line[], divider: string): Block[] {
        let blocks = []
        let lineText: string

        for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
            lineText = lines[lineNumber].getText()

            if (lineText === divider) {
                let { 
                    block,
                    analyzedLines
                } = this.blocker(lineNumber, lines, divider)
                blocks.push(block)
                //We continue where the parser of the blocker function is left.
                lineNumber += analyzedLines - 1
            }
        }

        return blocks
    }

    /**
     * 
     * @param {Number} index 
     * @param {String[]} lines 
     * @param {String} divider
     * @returns {Object[]} ??
     */
    private blocker (index: number, lines: Line[], divider: string): BlockingResult {
        let result: BlockingResult = {block: null, analyzedLines: 0}
        let block: Block = {text: ''}
        let textLines: string[] = []
        let j = index
        let blank = 0 
        let currentLine: Line
        let isNotDivider: boolean

        block[divider] = 
                lines[j].getNumber() ||
                lines[j+1].getNumber() ||
                lines[j+1]
        
        currentLine = lines[++j]//then we skip it to do not work with that text

        do {
            !currentLine.isEmpty() ?
                textLines.push(currentLine.line) :
                blank++;

            j++;
            result.analyzedLines++
            currentLine = lines[j]
            isNotDivider = currentLine?.getText() !== divider
        } while (isNotDivider && blank < 10 && j < lines.length)

        block.text = arrayToText(textLines)
        result.block = block

        return result
    }
}

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