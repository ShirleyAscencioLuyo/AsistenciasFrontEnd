import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AssistanceEducacional} from '../class/assistanceEducacinal';


@Injectable({
  providedIn: 'root'
})
export class AssistanceEducacinalService {
  private url = "http://localhost:8085/scavontime/assistanceE"
  constructor(private http: HttpClient) { }

  getAllAssistanceTeacher(): Observable<AssistanceEducacional[]> {
    return this.http.get<AssistanceEducacional[]>(`${this.url}`);
  }

  createAssistance(assistanceEducational: AssistanceEducacional): Observable<AssistanceEducacional> {
    return this.http.post<AssistanceEducacional>(`${this.url}`, assistanceEducational);
  }

}
