const $ = require('cheerio'),
	  Material = require('../entities/Material'),
	  Scraper = require('./Scraper');

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
		this.semestreID =  semestreID;
		this.plan = plan;
	}

	/**
	*	getMateriales - returns an array with the subjects of the specified semester.
	*	@return {Array} - an array of Asignatura objects.
	*/
	async getMateriales(){
		let result = {success: false};
		try{
			const url = `${this.baseURL}plan${this.plan}_${this.semestreID}.php`;
			const pageHTML = await Scraper.scrap(url, 'utf8');
			if(!pageHTML) throw "We couldn't get the content of the specified URL";
			const materiales_asignaturas = this.processHTML(pageHTML);

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
	 * @return {[Material]} an array with the materials extracted of the HTML.
	 */
	processHTML(html){
		//gettin the 'claves'. patron: center-left-center-center. [clave, nombre, apunte, actividades];
		const generalSelector = `table.tablaamarilla > tbody tr >`,
			  type_1 = `${generalSelector} td.tablaamarilla[valign="middle"][bgcolor="#E6E6E6"]`,
			  type_2 = `${generalSelector} td.estilos[valign="middle"][bgcolor="#E6E6E6"]`,
			  selector = `${type_1}, ${type_2}`;

		let subjects_materials = this.getElementsFromHTML(selector, html);
		subjects_materials = this.classifyMaterials(subjects_materials);

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
			
			if('children' in element){
				if('attribs' in element.children[0]){
					if('alt' in element.children[0].attribs){
						if(element.children[0].attribs.alt == 'Video Clase'){
							continue;
						}
					}	
				}
			}

			if(linkCounter >= 2){
				if(element.name != 'a'){
					elementsFiltered.push(null);
					continue;
				}
				element = this.baseURL + element.attribs.href;
			}else{
				element = element.data;
			}

			elementsFiltered.push(element);
			linkCounter = linkCounter == 3 ? 0 : linkCounter+1;
		}

		return elementsFiltered;
    }

	/**
	 * 
	 * @param {[Material]} subjects 
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
}

async function main(){
	let materialsManager = new MapMaterials(5);
	let materiales = await materialsManager.getMateriales();
	console.log(materiales);
}

main();

// module.exports = MapMaterials;