import Key from "./entities/Key";

export interface ServiceResult {
    success: boolean
	data?: any
	errors?: any
	messages?: string
}

export interface Material {
    key: Key;
    apunteURL: string;
    actividadesURL: string;
}

export interface Subject {
    subjectID: string;
    semesterID: number;
    name: string;
    key: Key;
    planDeTrabajoURL: string;
    apunteURL: string | string[];
    actividadesURL: string | string[];
}