import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DocumentType } from '../class/documentType';

@Injectable({
  providedIn: 'root'
})
export class DocumentTypeService {

  private url = "http://localhost:8085/scavontime/document"
  constructor(private http: HttpClient) { }

  getDocument(): Observable<DocumentType[]> {
    return this.http.get<DocumentType[]>(`${this.url}`);
  }
}
