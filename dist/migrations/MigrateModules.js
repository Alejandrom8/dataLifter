"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DataBase_1 = __importDefault(require("../DataBase"));
class MigrateModules {
    constructor(modules) {
        this.modules = modules;
    }
    migrate() {
        return __awaiter(this, void 0, void 0, function* () {
            let result = { success: false };
            try {
                if (!this.modules.length)
                    throw `The modules array is empty, pass migration`;
                let [collection, client] = yield DataBase_1.default.getCollection('module');
                let insert = yield collection.insertMany(this.modules);
                client.close();
                if (!insert.result.ok)
                    throw 'No se logro insertar el dato';
                result.success = true;
            }
            catch (error) {
                result.errors = error;
                console.log(error);
            }
            return result;
        });
    }
}
exports.default = MigrateModules;
//# sourceMappingURL=MigrateModules.js.map