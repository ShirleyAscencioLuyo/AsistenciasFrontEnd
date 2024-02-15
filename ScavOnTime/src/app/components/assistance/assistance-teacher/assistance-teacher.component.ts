import { Component, OnInit } from '@angular/core';
import { AssistanceTeacherService } from 'src/app/service/assistance-teacher.service';
import { TeacherWithAttendance } from '../../../class/teacher-with-attendance';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs';
import { AssistanceTeacher } from 'src/app/class/assistance-teacher';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-assistance-teacher',
  templateUrl: './assistance-teacher.component.html',
  styleUrls: ['./assistance-teacher.component.css']
})
export class AssistanceTeacherComponent implements OnInit {

  shift = 'M';
  maxDate = (new Date()).toISOString().substring(0, 10);
  currentDate = (new Date()).toISOString().substring(0, 10);
  currentIndex: number = -1;
  observacion: string = '';

  form: FormGroup = this.fb.group({
    teacherWithAttendance: this.fb.array([])
  });


  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private assistanceTeacherService: AssistanceTeacherService) {
  }


  ngOnInit(): void {
    this.obtenerProfesoresConAsistencia();
  }


  obtenerProfesoresConAsistencia() {
    this.assistanceTeacherService.obtenerProfesoresConAsistencia(this.shift, this.formatearFecha(this.currentDate)).subscribe(datos => {

      datos.forEach(value => {
        const control = this.agregarTeacherWithAssistance(value);
        this.teacherWithAttendance.push(control);
      })
    });
  }

  agregarTeacherWithAssistance(teacherWithAttendance: TeacherWithAttendance): FormGroup {
    return this.fb.group({
      id: teacherWithAttendance.id,
      teacherId: teacherWithAttendance.teacherId,
      documentNumber: teacherWithAttendance.documentNumber,
      lastname: teacherWithAttendance.lastname,
      name: teacherWithAttendance.name,
      typeCharge: teacherWithAttendance.typeCharge,
      attendanceStatus: teacherWithAttendance.attendanceStatus,
      entryTime: this.formatearHoraYminuto(teacherWithAttendance.entryTime),
      exitTime: this.formatearHoraYminuto(teacherWithAttendance.exitTime),
      observations: teacherWithAttendance.observations
    });

  }

  get teacherWithAttendance() {
    return this.form.controls["teacherWithAttendance"] as FormArray;
    // return this.form.get('teacherWithAttendance') as FormArray;
  }

  formatearHoraYminuto(fecha: string | null): string {

    if (fecha == null) return '';

    const fechaObj = new Date(fecha);
    const hora = fechaObj.getHours().toString().padStart(2, '0');
    const minutos = fechaObj.getMinutes().toString().padStart(2, '0');
    return `${hora}:${minutos}`;
  }

  formatearFecha(fechaString: string) {
    const partesFecha = fechaString.split('-');
    const dia = partesFecha[2];
    const mes = partesFecha[1];
    const año = partesFecha[0];

    const fechaFormateada = `${dia}/${mes}/${año}`;
    return fechaFormateada;
  }

  filtraTurno(event: any) {
    this.shift = event.target.value;
    this.teacherWithAttendance.clear();
    this.obtenerProfesoresConAsistencia();
  }

  filtrarFecha(event: any) {
    this.currentDate = event.target.value;
    this.teacherWithAttendance.clear();
    this.obtenerProfesoresConAsistencia();
  }

  mostrarObservacion(formGroup: any, index: any) {
    console.log('INDEX', index);
    this.currentIndex = index;
    this.observacion = formGroup.controls['observations'].value;
  }

  checkEntryTime(formGroup: any): boolean {
    return formGroup.controls['entryTime'].value != '';
  }

  guardarAsistencia() {
    console.log('Formulario', this.teacherWithAttendance.value);

    const asistencias: AssistanceTeacher[] = this.teacherWithAttendance.value.map((element: any) => {
      return {
        id: element.id,
        teacherId: element.teacherId,
        attendanceStatus: element.attendanceStatus,
        shift: this.shift,
        attendanceDate: this.formatearFecha(this.currentDate),
        entryTime: element.entryTime != '' ? this.currentDate + ' ' + element.entryTime: null,
        exitTime: element.exitTime != '' ? this.currentDate + ' ' + element.exitTime : null,
        observations: element.observations
      };

    });

    console.log('Datos para el backend: ', asistencias);

    this.assistanceTeacherService.guardarAsistencia(asistencias)
      .subscribe(() => {
        this.toastr.success('Asistencias registradas!!!');
        this.teacherWithAttendance.clear();
        this.obtenerProfesoresConAsistencia();
      });
  }

}
