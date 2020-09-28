import { ask } from 'stdio'
import semesterMigration from './scripts/semesterMigration'
import truncateSemester from './scripts/truncateSemester';

const options = ['semester migration', 'truncate semester', 'exit']

;(async function main () {
    let selectedoption: number

    do {
        process.stdout.write('\x1Bc');
        selectedoption = await askOption()
        switch (selectedoption) {
            case 1:
                await performSemesterMigration()
                break
            case 2:
                await performTruncateSemester()
                break
            case options.length:
                console.log('Program finished...')
                return
            default:
                console.log('Incorrect option')
                break
        }
        await ask('\npress any key to proceed');
    } while (selectedoption !== options.length)
})()

/**
 * asks the user to select an option of the printed menu
 * and returns it as a number
 */
async function askOption (): Promise<number> {
    console.log('\n  Menu');
    options.forEach( (opt, i) => console.log(`  ${i+1}. ${opt}.`))
    return parseInt(
        await ask('\nWhich option do you want to perform? ')
    )
}

function semesterIsValid (semester: number) {
    if(!semester || semester > 9 || semester < 1) return false;
    return true;
}

async function performSemesterMigration () {
    let selectedSemester = parseInt(await ask('Which semester do you want to migrate? '))
    while (!semesterIsValid(selectedSemester)) {
        selectedSemester = parseInt(await ask('invalid semester, select other: '))
    }
    await semesterMigration(selectedSemester)
}


async function performTruncateSemester () {
    let selectedSemester = parseInt(await ask('Which semester do you want to delete? '));
    while (!semesterIsValid(selectedSemester)) {
        selectedSemester = parseInt(await ask('invalid semester, select other: '))
    }
    await truncateSemester(selectedSemester)
}