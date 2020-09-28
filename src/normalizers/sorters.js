/**
 * 
 * @param {[]} s 
 * @param {number} a 
 * @param {number} b 
 */
function swap(s, a, b) {
    let tmpVal = s[a]
    s[a] = s[b]
    s[b] = tmpVal
}

export const sortSubjects = subjects => {
    for (let i = 1; i < subjects.length; i++) {
        let j = i
        while (j > 0 && parseInt(subjects[j].key.number) < parseInt(subjects[j-1].key.number)) {
            swap(subjects, j, j-1)
            j--
        }
    }

    return subjects
}