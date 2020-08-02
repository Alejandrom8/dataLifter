const MapActivities = require('../lifters/MapActivities');

class ActivitiesCreator{
    constructor({semesterID, key, planDeTrabajoURL}){
        this.semesterID = semesterID;
        this.subjectID = key;
        this.subjectPDF = planDeTrabajoURL;
    }

    async createActivities(){
        let map_manager = new MapActivities(this.semesterID, this.subjectID, this.subjectPDF);
        let actividades = await map_manager.formGroups();
        return actividades;
    }
}

module.exports = ActivitiesCreator;