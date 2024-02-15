import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AssistanceEducacional } from 'src/app/class/assistanceEducacinal';
import { Teacher } from 'src/app/class/teacher';
import { AssistanceEducacinalService } from 'src/app/service/assistance-educacinal.service';
import { TeacherService } from '../../../service/teacher.service';

@Component({
  selector: 'app-asistencia-docente',
  templateUrl: './asistencia-docente.component.html',
  styleUrls: ['./asistencia-docente.component.css']
})
export class AsistenciaDocenteComponent {
assistanceStudent: AssistanceEducacional[] | undefined;
  formAssistance: FormGroup;
  newAssistance: AssistanceEducacional = new AssistanceEducacional();
  docentes: Teacher[] = [];

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private assistance: AssistanceEducacinalService,
    private teacherService: TeacherService
    ) 
  { 
    this.formAssistance = this.fb.group({
      id: [],
      teacher: [this.newAssistance.teacher, [Validators.required]],
      states: [this.newAssistance.states, [Validators.required]],
      shifts: [this.newAssistance.shifts, [Validators.required]],
      input: [this.getCurrentTime(), [Validators.required]],
      outputs: [this.getCurrentTime(), [Validators.required]],
      observation: [this.newAssistance.observations],
    });
  }

  ngOnInit(): void {
    this.loadAssistanceTeachers();
    this.getTeachers();
  }

  getTeachers(): void {
    this.teacherService.getTeachersA().subscribe(
      data => {
        this.docentes = data;
      },
      error => {
        console.error('Error al obtener docentes activos', error);
      }
    );
  }

  getCurrentTime(): string {
    const currentDate = new Date();
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');

    // Formatear la hora en el formato HH:mm:ss
    return `${hours}:${minutes}:${seconds}`;
  }

  loadAssistanceTeachers(): void {
    this.assistance.getAllAssistanceTeacher().subscribe(
      data => {
        this.assistanceStudent = data;
      },
      error => {
        console.error('Error al obtener los estudiantes de asistencia', error);
      }
    );
  }

  createAssistance(): void {
    if (this.formAssistance.valid) {
      const assistanceData: AssistanceEducacional = {
        id: undefined,
        teacher: this.formAssistance.value.teacher,
        states: this.formAssistance.value.states,
        shifts: this.formAssistance.value.shifts,
        input: this.formAssistance.value.input,
        outputs: this.formAssistance.value.outputs,
        observations: this.formAssistance.value.observations,
      };

      this.assistance.createAssistance(assistanceData).subscribe(
        () => {
          this.toastr.success('Asistencia creada con éxito', 'Éxito');
          this.formAssistance.reset({
            teacher: null,
            states: null,
            shifts: null,
            input: this.getCurrentTime(),
            gradeSection: this.getCurrentTime(),
            observation: null,
          });
          
          // Actualizar la lista después de guardar con éxito
          this.loadAssistanceTeachers();
        },
        error => {
          console.error('Error al guardar la asistencia:', error);
          this.toastr.error('Error al crear la asistencia', 'Error');
        });
    } else {
      console.log('El formulario no es válido. No se puede guardar.');
    }
  }
}