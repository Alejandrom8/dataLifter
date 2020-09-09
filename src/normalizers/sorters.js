exports.insertionSort = subjects => {
    let val, index;

    for(let i = 1; i < subjects.length; i++){
        val = subjects[i];
        index = i;
        while(index > 0 && parseInt(subjects[index-1].key.number) > parseInt(val.key.number)){
            subjects[index] = subjects[index-1];
            index--;
        }
        subjects[index] = val;
    }

    return subjects;
}