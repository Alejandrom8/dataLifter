'use strict';

const Asignatura = require('../entities/Asignatura'),
      Scraper = require('./Scraper'),
      { insertionSort } = require('../normalizers/sorters');


class MapSubjects{
    constructor(semesterID){
        this.semesterID = semesterID;
        this.URL = "http://fcaenlinea1.unam.mx/planes_trabajo/grupos.php?sem=";
    }

    /**
     * @return {Object} - {success, errors?, data?}
     */
    async getSubjects(){
        let result = {success: false};

        try{
          const url = this.URL + this.semesterID;
          const pageContent = await Scraper.scrap(url, 'latin1');
          let asignaturas = this.processHTML(pageContent);
          if(!asignaturas) throw "Hubo un error al completar las asignaturas";
          asignaturas = insertionSort(asignaturas);

          result.data = asignaturas;
          result.success = true;
        }catch(err){
          result.errors = err;
        }

        return result;
    }

    /**
     * If the font change, this function should be addapted to extract the specified
     * data from the new page.
     * @param {string} html 
     * @return {[Asignatura]}
     */
    processHTML(html){
      const filter = element => element.children[0].data;

      const subjectElementsClassifier = {
        cssSelector: 'td[width="87%"].asignatura > strong',
        html: html,
        filter: filter,
        steps: [0, 1]
      }

      const claveElementsClassifier = {
        cssSelector: 'td[width=44].grupo > div',
        html: html,
        filter: filter,
        steps: [1, 2]
      }

      const urlsElementsClassifier = {
        cssSelector: 'td[width=51].nombre > span.grupo',
        html: html,
        filter: element => {
          let generic_link = element.children[1].attribs.href;
          let url = `http://fcaenlinea1.unam.mx/planes_trabajo/${generic_link}`;
          return url
        },
        steps: [0, 1]
      }

      let names = Scraper.getElementsFromHTML(subjectElementsClassifier),
          keys = Scraper.getElementsFromHTML(claveElementsClassifier),
          urls = Scraper.getElementsFromHTML(urlsElementsClassifier);

      if(names.length != keys.length || names.length != urls.length){
          throw "Hubo un error al intentar procesar el html solicitado";
      }

      let asignaturas = this.classifySubjects(names, keys, urls);
      asignaturas = this.mapImportance(asignaturas);

      return asignaturas;
    }

    /**
     * Groups the extracted info from proccessHTML into Asignatura objects.
     * @param {[string]} names 
     * @param {[string]} keys 
     * @param {[string]} pt_urls 
     * @return {[Asignatura]}
     */
    classifySubjects(names, keys, pt_urls){
      let subjects = [];

      for(let subjectIndex = 0; subjectIndex < names.length; subjectIndex++){
          let subject = new Asignatura(
              names[subjectIndex ],
              (keys[subjectIndex].replace(/(^\s*(?!.+)\n+)|(\n+\s+(?!.+)$)/g, "")).trim(),
              pt_urls[subjectIndex]
          );

          subjects.push(subject);
      }

      return subjects;
    }

    mapImportance(subjects){
      for(let i = 0; i < subjects.length; i++){
        let current = subjects[i];
        if(typeof current.clave.letter != 'string') continue;
        let coincidences = subjects.filter((sub, index) => {
          return current.clave.number == sub.clave.number;
        });
        if(coincidences.length > 1) subjects[i].clave.conciderLetter = true;
      }
      return subjects;
    }
}

module.exports = MapSubjects;
