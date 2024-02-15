import { Ubigeo } from "./ubigeo";
import { DocumentType } from "./documentType";

export class Teacher {
    id: number | undefined;
    documentType: DocumentType = new DocumentType();
    documentNumber: string = '';
    name: string = '';
    lastname: string = '';
    cellphone: string = '';
    email: string = '';
    birthdate: string = '';
    ubigeo: Ubigeo = new Ubigeo;
    typeCharge: string = '';
    typeCondition: string = '';
    workday: string = '';
    active: string = '';
}
