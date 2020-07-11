const Asignatura = require('../entities/Asignatura'),
      Semestre = require('../entities/Semestre'),
      Scraper = require('./Scraper');


class MapSubjects{
    constructor(semesterID){
        this.semesterID = semesterID;
        this.URL = "http://fcaenlinea1.unam.mx/planes_trabajo/grupos.php?sem=";
    }

    async createSemester(){
        let result = {success: false};

        try{
          const subject_materials = new Materiales(this.semesterID);
          const materiales = await subject_materials.getMateriales();

          const url = this.URL + this.numero;
          const pageContent = await Scraper.scrap(url, 'latin1');
          let asignaturas = this.processHTML(pageContent);
          asignaturas = this.mergeSubjects(asignaturas, materiales);
          if(!asignaturas) throw "Hubo un error al completar las asignaturas";

          result.data = new Semestre(this.numero, asignaturas);
          result.success = true;
        }catch(err){
          result.errors = err;
        }

        return result;
    }

    classifySubjects(names, keys, pt_urls){
      let subjects = [];

      for(let subjectIndex = 0; subjectIndex < names.length; subjectIndex++){
          let subject = new Asignatura(
              names[subjectIndex],
              (keys[subjectIndex].replace(/(^\s*(?!.+)\n+)|(\n+\s+(?!.+)$)/g, "")).trim(),
              pt_urls[subjectIndex]
          );
          subjects.push(subject);
      }

      return subjects;
    }

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

        return asignaturas;
    }

    static checkSimilarSubjects(mt){
      let checked = [];
      const withoutModifications = mt.slice();
      let generalRoundSubjectsChecked = [];
      let final = [];

      for(let i = 0; i < mt.length; i++){
        let coincidences = withoutModifications.filter((sub, index) => {
          if(withoutModifications[i].clave == sub.clave) checked.push(index);
          return withoutModifications[i].clave == sub.clave;
        });

        if(!(coincidences.length > 1) || generalRoundSubjectsChecked.some(s => s == withoutModifications[i].clave)){
          checked = [];
          continue;
        }

        //ISSUE - habrá problemas cuando admimistración e informática tengan
        //una matería en común pero contaduría no. en tal caso, quedaría así:
        //1151a (administración) 1151c (informática)...
        let additionalIndexes = ['a', 'c', 'i'];
        let changedKeys = coincidences.map((c, index) => {
          c.clave += additionalIndexes[index];
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

    coincidencesInArrays(arr1, arr2){
      let i = 0, current, matches = [];
      while(current = arr1[i]){
        current = current ? current.clave : null;
        let hasLetter = current.length == 5;
        if(hasLetter){
            matches.push([current, 1]);
            i++;
            continue;
        }
        let j = 0, subcurrent, counter = 0;
        let coincidences = [];
        while(subcurrent = arr2[j]){
          subcurrent = subcurrent ? subcurrent.clave.match(/\d+/).toString() : null;
          if(subcurrent && subcurrent == current){
            coincidences.push([j, arr2[j]]);
            counter++;
            let thereAreNoMore = arr2.slice(j, arr2.length).some(s => s == subcurrent);
            if(counter == 3 || (counter == 2 && !thereAreNoMore)){
              let apuntes = [], actividades = [];
              for(let k = 0; k < counter; k++){
                apuntes.push(coincidences[k][1].apunteURL);
                actividades.push(coincidences[k][1].actividadesURL);
              }
              arr1[i].apunteURL = apuntes;
              arr1[i].actividadesURL = actividades;
              if(counter == 2) arr2.splice(j, 1);
              if(counter == 3) coincidences.forEach((c, ix) => { if(ix == 0) return; delete arr2[c[0]]; });
            }
          }
          j++;
        }
        matches.push([current, counter]);
        i++;
      }
      return {pt: arr1, mt: arr2};
    }

    mergeSubjects(pt_subjects, mt_subjects){
        let merged = [];
        //ahora no funciona para los semestres 1 y 2
        //mt_subjects = MapSemester.checkSimilarSubjects(mt_subjects); //adding 'a', 'c', 'i' tags to keys.
        //let {pt, mt} = this.coincidencesInArrays(pt_subjects, mt_subjects);
        let pt = pt_subjects, mt = mt_subjects;
        console.log(pt.length, mt.length);

        for(let mergeInterator = 0; mergeInterator < pt.length; mergeInterator++){
            let currentSubject = pt[mergeInterator];
            if(typeof currentSubject.apunteURL == 'Array' ||
               typeof currentSubject.actividadesURL == 'Array') {
                 merged.push(currentSubject);
                 continue;
            }
            console.log('pass');
            let toMergeSubject;
            for(let searchIterator = 0; searchIterator < pt.length; searchIterator++){
                if(mt[searchIterator].clave == currentSubject.clave){
                    toMergeSubject = mt[searchIterator];
                    break;
                }
            }
            console.log(toMergeSubject);
            merged.push(Asignatura.mergeSubjects(currentSubject, toMergeSubject));
        }

        return merged;
    }
}

// async function main(){
//     const prueba = new MapSemester(3);
//     console.log(await prueba.createSemester());
// }
//
// main();

module.exports = MapSubjects;
