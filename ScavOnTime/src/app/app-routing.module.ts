import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListStudentComponent } from './components/list-student/list-student.component';
import { ListTeacherComponent } from './components/list-teacher/list-teacher.component';
import { AssistanceTeacherComponent } from './components/assistance/assistance-teacher/assistance-teacher.component';
const routes: Routes = [
{
  path: 'list-student',
  component: ListStudentComponent
},
{
  path: 'list-teacher',
  component: ListTeacherComponent
},
{
  path: 'assistance-teacher',
  component: AssistanceTeacherComponent
}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
