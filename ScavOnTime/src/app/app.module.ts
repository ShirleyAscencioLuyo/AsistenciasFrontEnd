import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ListStudentComponent } from './components/list-student/list-student.component';
import { ListTeacherComponent } from './components/list-teacher/list-teacher.component';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { AppService } from 'src/app/service/app.service';
import { NavComponent } from './components/header/nav/nav.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { AsistenciaDocenteComponent } from './components/assistance/asistencia-docente/asistencia-docente.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AssistanceTeacherComponent } from './components/assistance/assistance-teacher/assistance-teacher.component';


@NgModule({
  declarations: [
    AppComponent,
    ListStudentComponent,
    NavComponent,
    ListTeacherComponent,
    AsistenciaDocenteComponent,
    AssistanceTeacherComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    SweetAlert2Module,
    ReactiveFormsModule,
    FontAwesomeModule
  ],
  providers: [
    AppService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
