const MapMaterials = require('../src/lifters/MapMaterials');

const semester = process.env.SEMESTER || 1;

describe("Getting materials from the FCA website", () => {

    console.log(`Testing for semester ${semester}`);
    let resultingSubjects;
    
    it('get the hole elements from the web page', async () => {
        let materials_manager = new MapMaterials(semester);
        let result = await materials_manager.getMaterials();

        expect(result.success).toBe(true);
        expect(result.data).toBeTruthy();

        let subjects = result.data;

        expect(subjects.length).toBe(19);
        resultingSubjects = subjects;
    });

    it('each element should be defined', () => {
        resultingSubjects.forEach(sub => {
            //subjectID
            expect(sub).toBeTruthy();
            expect(sub.clave).toBeDefined();
            expect(sub.clave.length).toBeLessThanOrEqual(5);
            //apunteURL
            expect(sub.apunteURL).toBeTruthy();
            //actividadesURL
            expect(sub.actividadesURL).toBeTruthy();
        });
    });
});