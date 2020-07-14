const $ = require('cheerio'),
	  Material = require('../entities/Material'),
	  Scraper = require('./Scraper'),
	  { insertionSort } = require('../normalizers/sorters');

/*
	Materiales - an object that gets the URL's of the 'apuntes' and 'actividades'
	of each subject of the specified semester.
*/
class MapMaterials{
	/**
	*	@param {number} semestreID - the number of the semester.
	*	@param {string} plan - the year of the study plan.
	*/
	constructor(semestreID, plan = '2016'){
		//where we are going to get the data.
		this.baseURL = "http://fcasua.contad.unam.mx/apuntes/interiores/";
		this.plan = plan;
		this.semestreID =  semestreID;
		this.URL = `${this.baseURL}plan${this.plan}_${this.semestreID}.php`;
	}

	/**
	*	getMateriales - returns an array with the subjects of the specified semester.
	*	@return {Array} - an array of Asignatura objects.
	*/
	async getMateriales(){
		let result = {success: false};
		try{
			const pageHTML = await Scraper.scrap(this.URL, 'utf8');
			if(!pageHTML) throw "We couldn't get the content of the specified URL";
			let materiales_asignaturas = this.processHTML(pageHTML);
			materiales_asignaturas =  insertionSort(materiales_asignaturas);

			result.data = materiales_asignaturas;
			result.success = true;
		}catch(err){
			result.errors = err;
		}
		return result;
	}

	/**
	 * processHTML - proccess the recived html and return an array of Material objects.
	 * @param {string} html - an html structrure in string type.
	 * @return {[Material]} an array with the materials extracted from the HTML.
	 */
	processHTML(html){
		//gettin the 'claves'. patron: center-left-center-center. [clave, nombre, apunte, actividades];
		const generalSelector = `table.tablaamarilla > tbody tr >`,
			  type_1 = `${generalSelector} td.tablaamarilla[valign="middle"][bgcolor="#E6E6E6"]`,
			  type_2 = `${generalSelector} td.estilos[valign="middle"][bgcolor="#E6E6E6"]`,
			  selector = `${type_1}, ${type_2}`;

		let subjects_materials = this.getElementsFromHTML(selector, html);
		subjects_materials = this.classifyMaterials(subjects_materials);
		subjects_materials = this.checkSimilarSubjects(subjects_materials);

		return subjects_materials;
	}

	/**
	 * 
	 * @param {string} cssSelector 
	 * @param {string} html 
	 */
	getElementsFromHTML(cssSelector, html){
		const htmlElements = $(cssSelector, html);
		let elementsFiltered = [], linkCounter = 0;

		for (let i = 0; i < htmlElements.length; i++) {
			if(typeof htmlElements[i] == 'undefined') continue;

			let element = htmlElements[i].children[0];
			//if the element is a colspan of two, skip two elements.
			if('data' in element){
				if(element.data === 'Consultar plan de trabajo' || element.data === 'Consulta el plan de trabajo'){
					elementsFiltered.push(element.data);
					elementsFiltered.push(element.data);
					linkCounter = 0;
					continue;
				}
			}
			
			if('attribs' in htmlElements[i] && 'colspan' in htmlElements[i].attribs){
				if(htmlElements[i].attribs.colspan == '2'){
					elementsFiltered.push(element.data);
					elementsFiltered.push(element.data);
					linkCounter = 0;
					continue;
				}
			}
			
			if('children' in element){ //if the element is a Video clase, skiped
				if(element.children.length > 0){
					if('attribs' in element.children[0]){
						if('alt' in element.children[0].attribs){
							if(element.children[0].attribs.alt == 'Video Clase'){
								continue;
							}
						}	
					}
				}
			}

			if(linkCounter >= 2){//apply this for elements in count 23 67 1011
				//here are just the links 
				if(element.name != 'a'){ //if the element is not the expected (a)
					elementsFiltered.push(null);
					continue;
				}

				element = this.baseURL + element.attribs.href;
			}else{
				if(element.name == 'p'){ //if element has p children even text
					element = element.children[0];
				}
				element = element.data;
			}

			elementsFiltered.push(element);
			linkCounter = linkCounter == 3 ? 0 : linkCounter+1; //to determine when a block of 4 is done
		}

		return elementsFiltered;
	}

	/**
	 * 
	 * @param {Array} subjects 
	 * @return {[Material]}
	 */
	classifyMaterials(subjects){
		let sorted = [], clave, apunteURL, actividadesURL, material;

		for(let i = 0; i < subjects.length; i += 4){
			clave = typeof subjects[i] == 'undefined' ? subjects[i+1] : subjects[i];
			clave = (clave.replace(/(^\s*(?!.+)\n+)|(\n+\s+(?!.+)$)/g, "")).trim();
			apunteURL = subjects[i+2];
			actividadesURL = subjects[i+3];

			material = new Material(clave, apunteURL, actividadesURL);
			sorted.push(material);
		}

		return sorted;
	}

	checkSimilarSubjects(mt){
        let checked = [];
        const withoutModifications = mt.slice();
        let generalRoundSubjectsChecked = [];
        let final = [];
  
        for(let i = 0; i < mt.length; i++){
			let conciderit = false;

			//searching in all the array the keys that are repited
          	let coincidences = withoutModifications.filter((sub, index) => {
				if(withoutModifications[i].clave.number == sub.clave.number) checked.push(index);
				return withoutModifications[i].clave.number == sub.clave.number;
			});
			
			if(coincidences.length < 1 || 
				generalRoundSubjectsChecked.indexOf(withoutModifications[i].clave.number)){
				checked = [];
				continue;
			}
  
			//ISSUE - habrá problemas cuando admimistración e informática tengan
			//una matería en común pero contaduría no. en tal caso, quedaría así:
			//1151a (administración) 1151c (informática)...
			let additionalIndexes = ['a', 'c', 'i'];
			let changedKeys = coincidences.map((c, index) => {
				c.clave.letter = additionalIndexes[index];
				return c;
			});
	
			for(let indexCoincidences = 0; indexCoincidences < changedKeys.length; indexCoincidences++){
				let index = checked[indexCoincidences];
				final.push(changedKeys[indexCoincidences]);
			}
	
			checked = [];
			generalRoundSubjectsChecked.push(withoutModifications[i].clave);
        }
  
        return mt;
    }
}

module.exports = MapMaterials;
