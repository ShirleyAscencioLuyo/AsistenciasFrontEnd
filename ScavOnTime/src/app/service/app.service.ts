import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable, map } from 'rxjs'
import { Student } from '../class/student';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  studentSelected: Student = new Student();
  private url = "http://localhost:8085/scavontime/student"

  constructor(private http: HttpClient) { }

  getStudentsA(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.url}`).pipe(
      map(students => {
        return students.sort((a, b) => a.lastname.localeCompare(b.lastname));
      })
    );
  }

  getStudentsI(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.url}/I`).pipe(
      map(students => {
        return students.sort((a, b) => a.lastname.localeCompare(b.lastname));
      })
    );
  }

  getStudentById(id: number): Observable<Student[]>{
    return this.http.get<Student[]>(`${this.url}/${id}`)
  }

  deleteStudent(id: number): Observable<Student> {
    return this.http.put<Student>(`${this.url}/inactive/${id}`, {});
  }

  activateStudent(id: number): Observable<Student> {
    return this.http.put<Student>(`${this.url}/active/${id}`, {});
  }
  
  saveStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(`${this.url}`, student);
  }

  updateStudent(id: number, student: Student): Observable<void> {
    return this.http.put<void>(`${this.url}/edit/${id}`, student);
  }
  
}
