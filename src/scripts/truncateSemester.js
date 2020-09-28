import DataBase from '../DataBase';
import {ask, ProgressBar} from 'stdio';
import config from '../config.json';

const levels = [
    { collection: 'subject', identifier: 'semesterID' },
    { collection: 'module', identifier: 'subjectID' },
    { collection: 'activity', identifier: 'moduleID' }
]
const RESULTS = { subject: [], module:[], activity: [] }

/**
 * script para borrar todos los datos de un semestre en especifico
 */
export default async function truncateSemster (SEMESTER) {
    console.log('Searching all references for semester ' + SEMESTER)

    await findReferences([parseInt(SEMESTER)])

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
    let progress = new ProgressBar(99, {tickSize: 33})
    console.log(`Deleting ${size} resources`)
    await deleteAllReferences(RESULTS, progress)
    console.log('Program finished')
}

async function findReferences(idValues, level = 0) {
    if (level === levels.length -1) {
        return await getAllReferences(
            idValues, 
            levels[level].collection, 
            {identifier: levels[level].identifier}
        )
    } else {
        await findReferences(await getAllReferences(
            idValues,
            levels[level].collection,
            {identifier: levels[level].identifier}
        ), level + 1)
    }
}

async function getAllReferences (values, collectionName, { identifier }) {
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

async function getIds (collectionName, { identifier, idValue }) {
    let client
    let collection
    let querier = { [identifier]: idValue }

    try {
        [collection, client] = await DataBase.getCollection(collectionName)
        let query = await new Promise( (resolve, reject) => {
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
    } finally {
        client.close()
    }
}

async function deleteAllReferences (results, bar) {
    let { 
        subjectQuery, 
        moduleQuery, 
        activityQuery 
    } = prepareQueries(results)
    let collection
    let client

    try {
        [collection, client] = await DataBase.getCollection('activity')
        await collection.deleteMany({ $or: activityQuery })
        bar.tick()
        await client
                .db(config.database.mongodb.db)
                .collection('module')
                .deleteMany({ $or: moduleQuery })
        bar.tick()
        await client
                .db(config.database.mongodb.db)
                .collection('subject')
                .deleteMany({ $or: subjectQuery })
        bar.tick();
    } catch (error) {
        console.log(error)
    } finally {
        client.close()
    }
}

function prepareQueries (results) {
    return {
        subjectQuery: results.subject.map(s => ({ subjectID: s })),
        moduleQuery: results.module.map(m => ({ moduleID: m })),
        activityQuery: results.activity.map(a => ({ activityID: a }))
    }
}