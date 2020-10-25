import { ask } from 'stdio'
import semesterMigration from './scripts/semesterMigration'
import truncateSemester from './scripts/truncateSemester'

const options = ['semester migration', 'truncate semester', 'update semester', 'exit']

;(async function main () {
    let selectedoption: number

    do {
        process.stdout.write('\x1Bc')
        selectedoption = await askOption()
        switch (selectedoption) {
            case 1:
                await performSemesterMigration()
                await ask('\npress any key to proceed')
                break
            case 2:
                await performTruncateSemester()
                await ask('\npress any key to proceed')
                break
            case 3:
                await performSemesterUpdate()
                await ask('\npress any key to proceed')
                break
            case options.length:
                break
            default:
                console.log('Incorrect option')
                break
        }
    } while (selectedoption !== options.length)

    return console.log('Program finished...')
})()

/**
 * asks the user to select an option of the printed menu
 * and returns it as a number
 */
async function askOption (): Promise<number> {
    console.log('\n  Menu')
    options.forEach( (opt, i) => console.log(`  ${i+1}. ${opt}.`))
    return parseInt(
        await ask('\nWhich option do you want to perform?')
    )
}

function semesterIsValid (semester: number): boolean {
    return !(!semester || semester > 9 || semester < 1)
}

async function askSemester (message: string): Promise<number> {
    let selectedSemester = parseInt(await ask(message))
    while (!semesterIsValid(selectedSemester)) {
        selectedSemester = parseInt(await ask('invalid semester, select other: '))
    }
    return selectedSemester
}

async function performSemesterMigration () {
    await semesterMigration(await askSemester('Which semester do you want to migrate?'))
}

async function performTruncateSemester () {
    await truncateSemester(await askSemester('Which semester do you want to delete?'))
}

async function performSemesterUpdate () {
    return 
}