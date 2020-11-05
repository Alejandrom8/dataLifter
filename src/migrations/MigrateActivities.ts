import DataBase from '../DataBase'
import Activity from '../entities/Activity'
import { ServiceResult } from '../types'

export default class MigrateActivities {

    private activities: Activity[]

    constructor (activities: Activity[]) {
        this.activities = activities
    }

    async migrate (): Promise<ServiceResult> {
        let result: ServiceResult = { success: false }

        try {
            let collection = DataBase.getCollection('activity')
            let insert = await collection.insertMany(this.activities)
            if(!insert.result.ok) throw 'No se logro insertar el dato'
            result.success = true
        } catch (error) {
            result.errors = error
        }

        return result
    }
}
