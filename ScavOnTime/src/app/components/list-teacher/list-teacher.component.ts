import { Teacher } from './../../class/teacher';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TeacherService } from 'src/app/service/teacher.service';
import { DocumentTypeService } from 'src/app/service/document-type.service';
import { UbigeoService } from 'src/app/service/ubigeo.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { faFileExcel,faFileCsv,faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { DocumentType } from 'src/app/class/documentType';
import { Ubigeo } from './../../class/ubigeo';
import { ReportService } from 'src/app/service/report.service';

@Component({
  selector: 'app-list-teacher',
  templateUrl: './list-teacher.component.html',
  styleUrls: ['./list-teacher.component.css']
})
export class ListTeacherComponent implements OnInit {

  teachers: any[] | undefined;
  formTeacher: FormGroup;
  selectedDocumentType: string | null = '';
  searchQuery: string = '';
  newTeacher: Teacher = new Teacher();
  Active: boolean = true;
  Actions: boolean = true;
  documentTypes: DocumentType[] = [];
  ubigeos: any[] = [];
  maxLengthDocumentNumber = 8;
  minDate = new Date();
  faFileExcel = faFileExcel;
  faFileCsv = faFileCsv;
  faFilePdf = faFilePdf;

  descargandoPdf = false;


  constructor(
    public service: TeacherService,
    public reportService: ReportService,
    public document: DocumentTypeService,
    public subigeo: UbigeoService,
    private router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder) {
    this.formTeacher = this.fb.group({
      id: [],
      documentType: [null, Validators.required],
      documentNumber: [this.newTeacher.documentNumber, [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],//Validando tipo de DNI por defecto
      name: [this.newTeacher.name, [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      lastname: [this.newTeacher.lastname, [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      cellphone: [this.newTeacher.cellphone, [Validators.minLength(9), Validators.maxLength(9)]],
      email: [this.newTeacher.email, [Validators.email,  this.emailDomainValidator]],
      birthdate: [this.newTeacher.birthdate, Validators.required],
      ubigeo: [null, Validators.required],
      typeCharge: [this.newTeacher.typeCharge, Validators.required],
      typeCondition: [this.newTeacher.typeCondition, Validators.required],
      workday: [this.newTeacher.workday, [Validators.required, Validators.min(0), Validators.max(40)]],
    });

  }

  ngOnInit(): void {
    this.getTeachers();
    this.documentType();
    this.ubigeo();

    this.minDate.setFullYear(this.minDate.getFullYear() - 18);
  }

  documentType() {
    this.document.getDocument().subscribe(
      data => this.documentTypes = data,
      error => console.error('Error al cargar DocumentTypes', error)
    );
  }
  ubigeo() {
    this.subigeo.getUbigeo().subscribe(
      data => this.ubigeos = data,
      error => console.error('Error al cargar Ubigeos', error)
    );
  }
  emailDomainValidator(control: AbstractControl): ValidationErrors | null {
    const email = control.value;

    if (!email) {
      return null;
    }
    const allowedDomains = ['gmail.com', 'vallegrande.edu.pe'];
    const domain = email.split('@')[1];

    if (!allowedDomains.includes(domain)) {
      return { invalidDomain: true };
    }

    return null;
  }

  goToFormT() {
    this.router.navigate(['form-teacher']);
  }

  getActive() {
    this.service.getTeachersA().subscribe(data => {
      this.teachers = data;
    });
  }

  getInactive() {
    this.service.getTeachersI().subscribe(data => {
      this.teachers = data;
    });
  }

  getTeachers() {
    if (this.Active) {
      this.getActive();
    } else {
      this.getInactive();
    }
  }

  ActiveStatus() {
    this.getTeachers();
    this.Actions = this.Active;
  }

  numberOnly(event: any): boolean {

    this.formTeacher.get('documentType')?.markAsTouched();
    // this.formTeacher.get('documentType')?.markAsDirty;
    this.formTeacher.get('documentType')?.updateValueAndValidity();

    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  selectOnChange(event: any){
    const value = event.target.value;
    console.log('Valor seleccionado: ', value);

    this.formTeacher.controls['documentNumber'].clearValidators();

    if (value == 1){
      this.maxLengthDocumentNumber = 8;
      console.log('Validar DNI');

      this.formTeacher.controls['documentNumber'].setValidators(
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(8)
        ]
      );
    }

    if (value == 2){
      console.log('Validar CE');
      this.maxLengthDocumentNumber = 12;

      this.formTeacher.controls['documentNumber'].setValidators(
        [
          Validators.required,
          Validators.minLength(12),
          Validators.maxLength(12),
        ]
      );
    }

    this.formTeacher.get('documentNumber')?.updateValueAndValidity();
  }
  validationCellphone(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  // Utiliza la librería SweetAlert2 para mostrar un modal con un mensaje de advertencia.
  deleteTeacher(id: number) {
    Swal.fire({
      title: '¿Estás seguro eliminar al docente?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.deleteTeacher(id).subscribe(
          data => {
            this.teachers = this.teachers?.filter(teacher => teacher.id !== id);
            this.toastr.success('Docente eliminado', 'Éxito');
          },
          error => {
            this.toastr.warning('Hubo un problema al eliminar el docente', 'Error');
          }
        );
      }
    });
  }

  //Modal de confirmacion de activación de el docente
  activateTeacher(id: number) {
    Swal.fire({
      title: '¿Estás seguro activar al docente?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, activarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.activateTeacher(id).subscribe(
          data => {
            this.teachers = this.teachers?.filter(teacher => teacher.id !== id);
            this.toastr.success('Docente activado', 'Éxito');
          },
          error => {
            this.toastr.error('Hubo un problema al activar el docente', 'Error');
          }
        );
      }
    });
  }


  //Validación de el formulario en editar y alerta
  onSubmit() {

    console.log('Fomrulario: ', this.formTeacher);


    if (this.formTeacher.valid) {
      const datos: Teacher = {
        id: undefined,
        documentType: {
          id: Number(this.formTeacher.value.documentType),
          nameDocument: '',
          description: ''
        },
        documentNumber: this.formTeacher.value.documentNumber,
        name: this.formTeacher.value.name,
        lastname: this.formTeacher.value.lastname,
        cellphone: this.formTeacher.value.cellphone,
        email: this.formTeacher.value.email,
        birthdate: this.formTeacher.value.birthdate,
        ubigeo: {
          id: Number(this.formTeacher.value.ubigeo),
          ubigeoCode: '',
          department: '',
          province: '',
          district: '',
        },
        typeCharge: this.formTeacher.value.typeCharge,
        typeCondition: this.formTeacher.value.typeCondition,
        workday: this.formTeacher.value.workday,
        active: 'A',
      };

      if (this.service.teacherSelected && this.service.teacherSelected.id) {
        console.log('Datos ',datos);
        this.service.updateTeacher(this.service.teacherSelected.id, datos).subscribe(
          () => {
            this.toastr.success('Docente actualizado', 'Éxito');
            this.editCancel();
            this.getTeachers();
          },
          error => {
            this.toastr.error('Error al actualizar docente');
          }
        );
      } else {
        console.log('Datos ',datos);

        this.service.saveTeacher(datos).subscribe(
          respuesta => {
            this.toastr.success('Docente guardado', 'Éxito');
            this.formTeacher.reset();
            this.getTeachers();
          },
          error => {
            this.toastr.error('Error al guardar docente');
          }
        );
      }
    } else {
    }
  }

 // Buscador o filtrado de diversos campos

  onSearch() {
    if (this.Active) {
      this.service.getTeachersA().subscribe(data => {
        this.teachers = this.filterTeacher(data);
      });
    } else {
      this.service.getTeachersI().subscribe(data => {
        this.teachers = this.filterTeacher(data);
      });
    }
  }

  filterTeacher(teachers: Teacher[]): Teacher[] {

    let filteredTeachers: Teacher[] = teachers;

    if (this.selectedDocumentType) {
      filteredTeachers = filteredTeachers.filter(teacher => teacher.documentType.nameDocument === this.selectedDocumentType);
    }

    if (this.searchQuery) {
      filteredTeachers = filteredTeachers.filter(teacher =>
        teacher.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        teacher.lastname.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        teacher.typeCharge.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        teacher.typeCondition.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        teacher.documentNumber.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    return filteredTeachers;
  }

  //Editar Docente

  editTeacher(teacher: Teacher) {
    this.service.teacherSelected = teacher;
    console.log('Datos del servidor: ', this.service.teacherSelected);

    this.formTeacher.patchValue({
      documentType: this.service.teacherSelected.documentType.id,
      documentNumber: this.service.teacherSelected.documentNumber,
      name: this.service.teacherSelected.name,
      lastname: this.service.teacherSelected.lastname,
      cellphone: this.service.teacherSelected.cellphone,
      email: this.service.teacherSelected.email,
      birthdate: this.service.teacherSelected.birthdate,
      ubigeo: this.service.teacherSelected.ubigeo.id,
      typeCharge: this.service.teacherSelected.typeCharge,
      typeCondition: this.service.teacherSelected.typeCondition,
      workday: this.service.teacherSelected.workday,
    });
  }

  editCancel() {
    this.service.teacherSelected = new Teacher();
    this.formTeacher.reset();
  }

  // compareFn(option: any, value: any): boolean {
  //   return option.id === value.id;
  // }

  //Exportación XLS Y CSV
  exportToXLS(): void {
    const data = this.teachers || [];
    const formattedData = [
      ...data.map(teacher => ({
        'Tipo Doc.': teacher.documentType.nameDocument,
        'N° Doc.': teacher.documentNumber,
        'Nombres': teacher.name,
        'Apellidos': teacher.lastname,
        'Celular': teacher.cellphone,
        'Correo': teacher.email,
        'Fec. Nacimiento': teacher.birthdate,
        'Ubigeo': teacher.ubigeo.district,
        'Tipo de Cargo': teacher.typeCharge,
        'Tipo de Condicion': teacher.typeCondition,
        'Horas Trabajo': teacher.workday,
      })),
    ];

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Docentes');

    const fileName = 'docentes.xlsx';
    XLSX.writeFile(wb, fileName);
  }

  exportToCSV(): void {
    const data = this.teachers || [];
    const formattedData = [
      ['Lista de Docentes Registrados'],
      ...data.map(teacher => [
        teacher.documentType.nameDocument,
        teacher.documentNumber,
        teacher.name,
        teacher.lastname,
        teacher.cellphone,
        teacher.email,
        teacher.birthdate,
        teacher.ubigeo.district,
        teacher.typeCharge,
        teacher.typeCondition,
        teacher.workday,
      ]),
    ];

    const csvContent = formattedData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'docentes.csv');
  }

  exportToPDF(): void {
    this.descargandoPdf = true;
    let estado: string;

    if (this.Actions) {
      estado = 'A'
    } else {
      estado = 'I'
    }

    this.reportService.descargarReporte(estado).subscribe(async (response) => {
      this.descargandoPdf = false;
      let blob = new Blob([response], { type: 'application/pdf' });
      saveAs(blob, `Reporte_docentes_${estado == 'A' ? 'activos': 'inactivos'}.pdf`);
      // let url = window.URL.createObjectURL(blob);
      // let pwa = window.open(url);
    });
  }
}
