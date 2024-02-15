import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable, map } from 'rxjs'
import { Teacher } from '../class/teacher';


@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  teacherSelected: Teacher = new Teacher();

  private url = "http://localhost:8085/scavontime/teacher"

  constructor(private http: HttpClient) { }

  getTeachersA(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(`${this.url}`).pipe(
      map(teachers => {
        return teachers.sort((a, b) => a.lastname.localeCompare(b.lastname));
      })
    );
  }

  getTeachersI(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(`${this.url}/I`).pipe(
      map(teachers => {
        return teachers.sort((a, b) => a.lastname.localeCompare(b.lastname));
      })
    );
  }

  getTeacherById(id: number): Observable<Teacher[]>{
    return this.http.get<Teacher[]>(`${this.url}/${id}`)
  }

  deleteTeacher(id: number): Observable<Teacher> {
    return this.http.put<Teacher>(`${this.url}/inactive/${id}`, {});
  }

  activateTeacher(id: number): Observable<Teacher> {
    return this.http.put<Teacher>(`${this.url}/active/${id}`, {});
  }

  saveTeacher(teacher: Teacher): Observable<Teacher> {
    return this.http.post<Teacher>(`${this.url}`, teacher);
  }

  updateTeacher(id: number, teacher: Teacher): Observable<void> {
    return this.http.put<void>(`${this.url}/edit/${id}`, teacher);
  }

}
