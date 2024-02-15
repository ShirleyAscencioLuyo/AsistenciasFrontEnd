import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TeacherWithAttendance } from "../class/teacher-with-attendance";
import { AssistanceTeacher } from "../class/assistance-teacher";

@Injectable({
  providedIn: 'root'
})
export class AssistanceTeacherService {

  private url = "http://localhost:8085/scavontime/assistance-teacher"

  constructor(private http: HttpClient) { }

  obtenerProfesoresConAsistencia(shift: string, attendanceDate: string){

    let queryParams = new HttpParams();
    queryParams = queryParams.append("shift", shift);
    queryParams = queryParams.append("attendanceDate", attendanceDate);

    return this.http.get<TeacherWithAttendance[]>(this.url, {params: queryParams});
  }

  guardarAsistencia(assistanceTeacher: AssistanceTeacher[]) {
    return this.http.post(this.url, assistanceTeacher);
  }
}
