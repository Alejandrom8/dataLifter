class SubjectAddapter{

    constructor(pt_subjects, mt_subjects){
      this.pt_subjects = pt_subjects;
      this.mt_subjects = mt_subjects;
    }

    mergeSubjects(pt_subjects, mt_subjects){
      let merged = [];
      //ahora no funciona para los semestres 1 y 2
      mt_subjects = MapSemester.checkSimilarSubjects(mt_subjects); //adding 'a', 'c', 'i' tags to keys.
      let {pt, mt} = this.coincidencesInArrays(pt_subjects, mt_subjects);

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

    checkSimilarSubjects(mt){
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
}