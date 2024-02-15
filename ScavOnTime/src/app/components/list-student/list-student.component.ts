import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Student } from 'src/app/class/student';
import { AppService } from 'src/app/service/app.service';
import { DocumentTypeService } from 'src/app/service/document-type.service';
import { UbigeoService } from 'src/app/service/ubigeo.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-list-student',
  templateUrl: './list-student.component.html',
  styleUrls: ['./list-student.component.css']
})
export class ListStudentComponent implements OnInit {

  students: any[] | undefined;
  formStudent: FormGroup;
  selectedDocumentType: string | null = '';
  searchQuery: string = '';
  studentsCopy: Student[] = [];
  newStudent: Student = new Student(); 
  Active: boolean = true;
  Actions: boolean = true;
  documentTypes: any[] = [];
  ubigeos: any[] = [];

  constructor(
    public service: AppService,
    public document: DocumentTypeService,
    public subigeo: UbigeoService,
    private router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder,) {
    this.formStudent = this.fb.group({
      id: [],
      name: [this.newStudent.name, [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚüÜ\s]*$/)]],
      lastname: [this.newStudent.lastname, [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚüÜ\s]*$/)]],
      birthdate: [this.newStudent.birthdate,[Validators.required]],
      cellphone: [this.newStudent.cellphone, [Validators.pattern(/^$|^9[0-9]*$/), Validators.minLength(9), Validators.maxLength(9)]],
      email: [this.newStudent.email, [Validators.pattern(/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/)]],
      documentNumber: [this.newStudent.documentNumber, [Validators.required]],
      grade: [this.newStudent.grade, [Validators.required]],
      section: [this.newStudent.section, [Validators.required]],
      documentType: [this.newStudent.documentType, Validators.required],
      ubigeo: [this.newStudent.ubigeo , [Validators.required]],
    });

  }
  

  ngOnInit(): void {
    this.getStudents();
    this.documentType();
    this.ubigeo();
  }

  goToFormS() {
    this.router.navigate(['form-student']);
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


  getActive() {
    this.service.getStudentsA().subscribe(data => {
      this.students = data;
    });
  }

  getInactive() {
    this.service.getStudentsI().subscribe(data => {
      this.students = data;
    });
  }

  getStudents() {
    if (this.Active) {
      this.getActive();
    } else {
      this.getInactive();
    }
  }

  ActiveStatus() {
    this.getStudents();
    this.Actions = this.Active;
  }

  deleteStudent(id: number) {
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
        this.service.deleteStudent(id).subscribe(
          data => {
            this.students = this.students?.filter(student => student.id !== id);
            this.toastr.success('Docente eliminado', 'Éxito');
          },
          error => {
            this.toastr.warning('Hubo un problema al eliminar el docente', 'Error');
          }
        );
      }
    });
  }
  
  activateStudent(id: number) {
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
        this.service.activateStudent(id).subscribe(
          data => {
            this.students = this.students?.filter(student => student.id !== id);
            this.toastr.success('Docente activado', 'Éxito');
          },
          error => {
            this.toastr.error('Hubo un problema al activar el docente', 'Error');
          }
        );
      }
    });
  }

  //Para el formulario

  onSubmit() {
    if (this.formStudent.valid) {
      const datos: Student = {
        id: undefined,
        name: this.formStudent.value.name,
        lastname: this.formStudent.value.lastname,
        birthdate: this.formStudent.value.birthdate,
        cellphone: this.formStudent.value.cellphone,
        email: this.formStudent.value.email,
        documentType: this.formStudent.value.documentType,
        documentNumber: this.formStudent.value.documentNumber,
        ubigeo: this.formStudent.value.ubigeo,
        grade: this.formStudent.value.grade,
        section: this.formStudent.value.section,
        active: 'A',
      };

      if (this.service.studentSelected && this.service.studentSelected.id) {
        this.service.updateStudent(this.service.studentSelected.id, datos).subscribe(
          () => {
            this.toastr.success('Docente actualizado', 'Éxito');
            this.getActive();
            this.editCancel();
          },
          error => {
            this.toastr.error('Error al actualizar docente');
          }
        );
      } else {
        this.service.saveStudent(datos).subscribe(
          respuesta => {
            this.toastr.success('Docente guardado', 'Éxito');
            this.getActive();
            this.formStudent.reset();
          },
          error => {
            this.toastr.error('Error al guardar docente');
          }
        );
      }
    } else {
    }
  }
  
  // Buscador dinamico
  onSearch() {
    if (this.Active) {
      this.service.getStudentsA().subscribe(data => {
        this.students = this.filterStudentr(data);
      });
    } else {
      this.service.getStudentsI().subscribe(data => {
        this.students = this.filterStudentr(data);
      });
    }
  }

  filterStudentr(students: Student[]): Student[] {

    let filteredStudents: Student[] = students;

    if (this.selectedDocumentType) {
      filteredStudents = filteredStudents.filter(student => student.documentType.nameDocument === this.selectedDocumentType);
    }

    if (this.searchQuery) {
      filteredStudents = filteredStudents.filter(student =>
        student.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        student.lastname.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        student.documentNumber.toLowerCase().includes(this.searchQuery.toLowerCase()) 
      );
    }

    return filteredStudents;
  }
  // Editar estudiante

  editStudent(student: Student) {
    this.service.studentSelected = student;
    this.formStudent.patchValue(this.service.studentSelected);
  }

  editCancel() {
    this.service.studentSelected = new Student();
    this.formStudent.reset();
  }

  compareFn(option: any, value: any): boolean {
    return option.id === value.id;
  }

  // exportaciones
  exportToCSV(): void {
    if (this.students) {
      const data = this.students.map(student => ({
        Nombres: student.name,
        Apellidos: student.lastname,
        'Fecha de Nacimiento': student.birthdate,
        Telefono: student.cellphone,
        Email: student.email,
        'Tipo Documento': student.documentType?.nameDocument || '', 
        'N° Documento': student.documentNumber,
        Ubigeo: student.ubigeo?.district || '', 
      }));
  
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Estudiantes');
      const fileName: string = 'estudiantes.csv';
  
      XLSX.writeFile(wb, fileName, { bookType: 'csv' });
    }
  }
  
  exportToXLSX(): void {
    if (this.students) {
      const data = this.students.map(student => ({
        Nombres: student.name,
        Apellidos: student.lastname,
        'Fecha de Nacimiento': student.birthdate,
        Telefono: student.cellphone,
        Email: student.email,
        'Tipo Documento': student.documentType?.nameDocument || '', 
        'N° Documento': student.documentNumber,
        Ubigeo: student.ubigeo?.district || '', 
      }));
  
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Estudiantes');
      const fileName: string = 'estudiantes.xlsx';
  
      XLSX.writeFile(wb, fileName, { bookType: 'xlsx' });
    }
  }

  handleExport(event: any) {
    const selectedValue = event.target.value;
  
    // Ahora puedes usar selectedValue según tus necesidades
  
    if (selectedValue === 'CSV') {
      this.exportToCSV();
    } else if (selectedValue === 'XLSX') {
      this.exportToXLSX();
    }
  }

}

  





