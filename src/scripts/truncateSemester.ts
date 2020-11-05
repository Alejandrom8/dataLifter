import DataBase from '../DataBase'
import { ask } from 'stdio'
import config from '../config.json'
import Subject from '../entities/Subject'
import Module from '../entities/Module'
import Activity from '../entities/Activity'

interface RESULTS {
    subject: Subject[]
    module: Module[]
    activity: Activity[]
}

const levels = [
    { collection: 'subject', identifier: 'semesterID' },
    { collection: 'module', identifier: 'subjectID' },
    { collection: 'activity', identifier: 'moduleID' }
]
const RESULTS: RESULTS = { subject: [], module:[], activity: [] }

/**
 * script para borrar todos los datos de un semestre en especifico
 */
export default async function truncateSemster (SEMESTER: number) {
    console.log('Searching all references for semester ' + SEMESTER)

    await findReferences([SEMESTER])

    console.log('Attempting to delete the following resources: ')
    console.log(`---Subjects: ${RESULTS.subject.length}`)
    console.log(`---Modules: ${RESULTS.module.length}`)
    console.log(`---Activities: ${RESULTS.activity.length}`)
    
    let proceed = (await ask('Do you want to proceed? (Y/n) ')).toLowerCase()

    if (proceed === 'n') {
        console.log('Aborted...')
        return
    }

    let size = RESULTS.subject.length + RESULTS.module.length + RESULTS.activity.length

    console.log(`Deleting ${size} resources`)

    await deleteAllReferences()

    console.log('Program finished')
}

async function findReferences (
    idValues: (string | number)[], 
    level: number = 0
) {
    if (level === levels.length - 1) {
        return await getAllReferences(
            idValues, 
            levels[level].collection, 
            { identifier: levels[level].identifier }
        )
    } else {
        await findReferences(
            await getAllReferences(
                idValues,
                levels[level].collection,
                {identifier: levels[level].identifier}
            )
        , level + 1)
    }
}

async function getAllReferences (
    values: (string | number)[], 
    collectionName: string, { identifier }
) {
    let references = []
    for (let id of values) {
        let data = await getIds(collectionName, {
            identifier,
            idValue: id
        })
        references.push(...data)
    }
    RESULTS[collectionName] = references
    return references
}

async function getIds (
    collectionName: string, 
    { identifier, idValue }
): Promise<string[]> {
    let querier = { [identifier]: idValue }

    try {
        const collection = DataBase.getCollection(collectionName)
        let query: string[] = await new Promise( (resolve, reject) => {
            collection.find(querier).toArray((error, data) => {
                if(error) reject(error)
                data = data.map(element => (
                    element[collectionName + 'ID']
                ))
                resolve(data)
            })
        })

        if(!query) throw 'there are no results for this query'

        return query
    } catch (error) {
        console.log(error)
    }
}

async function deleteAllReferences () {
    let { 
        subjectQuery, 
        moduleQuery, 
        activityQuery 
    } = prepareQueries(RESULTS)

    try {
        const client = DataBase.getConnection()
        const collection = await DataBase.getCollection('activity')
        await collection.deleteMany({ $or: activityQuery })
        await client
                .db(config.database.mongodb.db)
                .collection('module')
                .deleteMany({ $or: moduleQuery })
        await client
                .db(config.database.mongodb.db)
                .collection('subject')
                .deleteMany({ $or: subjectQuery })
    } catch (error) {
        console.log(error)
    }
}

function prepareQueries (results: RESULTS) {
    return {
        subjectQuery: results.subject.map(s => ({ subjectID: s })),
        moduleQuery: results.module.map(m => ({ moduleID: m })),
        activityQuery: results.activity.map(a => ({ activityID: a }))
    }
}