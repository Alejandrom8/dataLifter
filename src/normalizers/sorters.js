exports.insertionSort = (subjects) => {
    for(let i = 1; i < subjects.length; i++){
        let val = subjects[i];
        let index = i;
        while(index > 0 && parseInt(subjects[index-1].clave.number) > parseInt(val.clave.number)){
            subjects[index] = subjects[index-1];
            index = index-1;
        }
        subjects[index] = val;
    }
    return subjects;
}