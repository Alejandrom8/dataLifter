const { arrayToText } = require('../helpers/converters'),
      Scraper = require('./Scraper'),
      Modules = require('../entities/groupers/Modules');

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
    async formGroups() {
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
    getModules(content) {
        const lines = content.split('\n');
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
        let modulesAndActivities = modules.map( unity => {
            let lines = unity.text.split('\n');
            let activities = this.getElements(lines, 'actividad');
            unity.actividades = activities;
            delete unity.text;
            return unity;
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

        for(let lineNumber = 0; lineNumber < lines.length; lineNumber++) {

            lineText = this.getText(lines[lineNumber]);

            if(lineText === divider) {
                let { 
                    block,
                    analizedLines
                } = this.blocker(lineNumber, lines, divider);
                blocks.push(block);
                //We continue where the parser of the blocker function is left.
                lineNumber += analizedLines - 1;
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
        let result = {},
            block = {},
            j = index,
            blank = 0, 
            analyzedLines = 0,
            currentLine,
            isNotDivider;

        block[divider] = 
                this.getNumber(lines[j]) ||
                this.getNumber(lines[j+1]) ||
                lines[j+1];
        block.text = [];

        currentLine = lines[++j];//then we skip it to do not work with that text

        do {
            !this.isEmpty(currentLine) ?
                block.text.push(currentLine) :
                blank++;

            j++;
            analyzedLines++;
            currentLine = lines[j];
            isNotDivider = this.getText(currentLine) !== divider;
        } while(isNotDivider && blank < 10 && j < lines.length);

        block.text = arrayToText(block.text);
        result.block = block;
        result.analizedLines = analyzedLines;

        return result;
    }
    
    /**
     * get just the numbers of a line of thext.
     * @param {String} line - the line of text where the numbers will be 
     * extracted.
     * @returns {String} the first number founded.
     */
    getNumber = line => this.getElement(line,/[0-9]+/g);

    /**
     * 
     * @param {string} line 
     * @param {RegExp} matcher 
     * @returns {String} the first element that matches with the matcher RegExp
     */
    getElement(line, matcher) {
        if(!line) return '';
        let result = line.match(matcher);
        return result ? result[0] : result;
    }

    /**
     * 
     * @param {String} line 
     * @returns {Boolean} true if the line is '' or null or undefined or does not
     * contain anything but spaces.
     */
    isEmpty(line) {
        return !line ||
                line.replace(/\s+/g, '').length === 0;
    }

    /**
     * creates a new string with just letters.
     * @param {String} line
     * @returns {String} a line with just alfabetic characters (a-zA-Z)
     */
    getText(line) {
        if(!line) return '';
        let result = line.toLowerCase();
        result = result.replace(/[\s.;:,?%0-9]+/g, '');
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