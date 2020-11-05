const { MapSubjects } = require('../dist/lifters/MapSubjects')

const semester = process.env.SEMESTER || 1
const subjectsLength = [18, 19, 20, 19, 17, 16, 14, 4]

describe('Getting the subjects and "Planes de trabajo" from the FCA webpage', () => {
    let subjects

    it('generates a response', async () => {
        const subject_manager = new MapSubjects(semester)
        const result = await subject_manager.getSubjects()
        console.log(result.errors)
        expect(result.success).toBe(true)
        expect(result.data).toBeDefined()
        expect(result.data.length).toBe(subjectsLength[semester-1])
        subjects = result.data
    })

    it('generate a great response', () => {
        subjects.forEach(sub => {
            expect(sub).toBeTruthy()
            expect(sub.clave).toBeDefined()
            expect(sub.nombre).toBeDefined()
            expect(sub.planDeTrabajoURL).toBeDefined()
        })
    })
})