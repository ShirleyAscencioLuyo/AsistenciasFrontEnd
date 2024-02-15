import { Student } from "./student";
import { Teacher } from "./teacher";

export class AssistanceEducacional {
    id: number | undefined;
    teacher: Teacher = new Teacher;
    states: string = '';
    shifts: string = '';
    input: string = '';
    outputs: string = '';
    observations: string = '';
}


