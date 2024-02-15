import { Ubigeo } from "./ubigeo";
import { DocumentType } from "./documentType";

export class Student {
    id: number | undefined;
    name: string = '';
    lastname: string = '';
    birthdate: string = '';
    cellphone: string = '';
    email: string = '';
    documentType: DocumentType = new DocumentType;
    documentNumber: string = '';
    ubigeo: Ubigeo = new Ubigeo;
    grade: string = '';
    section: string = '';
    active: string = '';
}
