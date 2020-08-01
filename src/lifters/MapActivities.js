const crawler = require('crawler-request');

class MapActivities{

    constructor(file){
        this.file = file;
    }

    async getActivities(){
        let fileContent = await this.parseFile(this.file);
        let unities = await this.clasifyUnities(fileContent.text);
        return unities;
    }

    async parseFile(path){
        const response = await crawler(path);
        return response;
    }

    async clasifyUnities(fileContent){
        let unities = await this.getElements(fileContent);
        return unities;
    }

    getElement(line, matcher){
        if(!line) return;
        let result = line.match(matcher);
        return result ? result[0] : result;
    }

    getText = line => this.getElement(line, /[a-zA-Z]+/g);

    getNumber = line => this.getElement(line,/[0-9]+/g);

    blocker(index, lines, sortBy){
        let block = {};
        let element, blank = 0;
        let j = index;
        let analyzedLines = 0;


        if(sortBy === 'Unidad'){
            block[sortBy] = this.getNumber(lines[j]);
            block.actividades = [];
        }else{
            block[sortBy] = this.getNumber(lines[j-1]);
            block.lines = []
        }

        do{
            element = lines[j];
            if(sortBy === 'Unidad' && this.getText(element) === 'ACTIVIDAD'){
                let [actividad, al] = this.blocker(j+1, lines, 'ACTIVIDAD');
                block.actividades.push(actividad);
                j += al;
                analyzedLines += al;
            }else if(sortBy === 'ACTIVIDAD' && (element != ' ' && element != '')){
                if(this.getText(element) === 'Unidad') break;
                block.lines.push(element.trim());
            }

            if(element == '' || element == ' ') blank++;

            j++;
            analyzedLines++;
            element = lines[j];
        }while(this.getText(element) != sortBy && blank < 5 && j < lines.length);

        return [block, analyzedLines];
    }

    getElements(text){
        //const lines = ['Unidad 1', 'textox', '', 'ACTIVIDAD 1', 'blablabla', '', 'ACTIVIDAD 2', 'blablabla', '', 'Unidad 2', 'textox2', 'ACTIVIDAD 1', 'blablabla'];
        const lines = text.split('\n');
        let blocks = [];
        let line, justText;

        for(let i = 0; i < lines.length; i++){
            line = lines[i];
            justText = this.getText(line);
            if(justText === 'Unidad'){
                let [unity, al] = this.blocker(i, lines, 'Unidad');
                blocks.push(unity);
                i += al -1;
            }
        }

        return blocks;
    }
}

async function main(){
    let mapper = new MapActivities('http://fcaenlinea1.unam.mx/planes_trabajo/deliver.php?f=asesor/upload/1364_TODOS.pdf');
    console.log(await mapper.getActivities());
}

main();