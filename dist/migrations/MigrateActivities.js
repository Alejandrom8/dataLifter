var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const DataBase = require('../DataBase');
class MigrateActivities {
    constructor(activities) {
        this.activities = activities;
    }
    migrate() {
        return __awaiter(this, void 0, void 0, function* () {
            let client, collection, result = { success: false };
            try {
                [collection, client] = yield DataBase.getCollection('activity');
                let insert = yield collection.insertMany(this.activities);
                if (!insert.result.ok)
                    throw 'No se logro insertar el dato';
                result.success = true;
            }
            catch (error) {
                result.errors = error;
                console.log(error);
            }
            finally {
                client.close();
            }
            return result;
        });
    }
}
module.exports = MigrateActivities;
//# sourceMappingURL=MigrateActivities.js.map