const crawler = require('crawler-request');
const Actividades = require('../entities/Actividades');

class MapActivities{

    constructor(semesterID, subjectID, file){
        this.semesterID = semesterID;
        this.subjectID = subjectID;
        this.file = file;
    }

    async formGroups(){
        let fileContent = await this.parseFile(this.file);
        let unities = this.clasifyUnities(fileContent.text);
        unities = unities.map(uni => {
            delete uni.text;
            return uni;
        });
        let activities = new Actividades(this.semesterID, this.subjectID, unities);
        return activities;
    }

    async parseFile(path){
        const response = await crawler(path);
        return response;
    }

    clasifyUnities(fileContent){
        let unities = this.getUnities(fileContent);
        let byActivities = this.getActivities(unities);
        return byActivities;
    }
    
    getUnities(content){
        const lines = content.split('\n');
        let unities = this.getElements(lines, 'unidad');
        return unities;
    }

    getActivities(unities){
        let byActivities = unities.map( unity => {
            let lines = unity.text.split('\n');
            let activities = this.getElements(lines, 'actividad');
            unity.actividades = activities;
            return unity;
        });

        return byActivities;
    }

    getElements(lines, divider){
        let blocks = [];
        let currentLine, lineText;

        for(let lineIndex = 0; lineIndex < lines.length; lineIndex++){
            currentLine = lines[lineIndex];
            lineText = this.getText(currentLine);
            if(lineText === divider){
                let { block, analizedLines } = this.blocker(lineIndex, lines, divider);
                blocks.push(block);
                lineIndex += analizedLines - 1;
            }
        }

        return blocks;
    }

    blocker(index, lines, divider){
        let result = {};
        let block = {};
        let j = index, blank = 0, analyzedLines = 0;
        block[divider] = 
                this.getNumber(lines[j]) ||
                this.getNumber(lines[j+1]) ||
                lines[j+1];
        block.text = [];

        j++;//then we skip it to do not work with that text
        let currentLine = lines[j];
        let isNotDivider;

        do{
            if(!this.isEmpty(currentLine)){
                block.text.push(currentLine);
            }else{
                blank++;
            }

            j++;
            analyzedLines++;
            currentLine = lines[j];
            isNotDivider = (this.getText(currentLine) != divider);
        }while(isNotDivider && j < lines.length && blank < 10);
        // console.log(`ENDS WITH: Line: ${currentLine}, IS Not DIVIDER: ${isNotDivider}, J: ${j}, SPACES: ${blank}`);

        block.text = block.text.reduce((acumulator, current) => {
            return acumulator + current + '\n';
        }, '');
        result.block = block;
        result.analizedLines = analyzedLines;
        return result;
    }

    /**
     * 
     * @param {string} line 
     * @param {*} matcher 
     */
    getElement(line, matcher){
        if(!line) return;
        let result = line.match(matcher);
        return result ? result[0] : result;
    }

    getText(line){
        if(!line) return '';
        let result = line.toLowerCase();
        result = result.replace(/[\s.;:,?%0-9]+/g, '');
        return result;
    }

    getNumber = line => this.getElement(line,/[0-9]+/g);

    isEmpty(line){
        if(!line ||
            line == '' ||
            line.replace(/\s+/g, '').length == 0){
               return true
           }
        return false
    }
}

// async function main(){
//     let url = 'http://fcaenlinea1.unam.mx/planes_trabajo/deliver.php?f=asesor/upload/1353_TODOS.pdf';
//     console.log(`Getting materials from: ${url}`);
//     let time = Date.now();
//     let mapper = new MapActivities(3, '1353',url);
//     let result = await mapper.formGroups();
//     console.log(`RESOLVED IN ${Date.now() - time}ms`);
//     console.log(result);

//     // for(let uni of result){
//     //     console.log(uni);
//     //     // for(let act of uni.actividades){
//     //     //     console.log(act);
//     //     // }
//     // }
// }

// main();

module.exports = MapActivities;