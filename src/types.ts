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

export interface Block {
    text: string
    unidad?: string
    actividad?: string
}

export interface BlockingResult {
    block: Block
    analyzedLines: number
}

export interface PreModule {
    unidad: string
    actividades: Block[]
}