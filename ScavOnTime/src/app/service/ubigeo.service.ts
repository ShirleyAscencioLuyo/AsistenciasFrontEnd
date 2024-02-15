import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ubigeo } from '../class/ubigeo';

@Injectable({
  providedIn: 'root'
})
export class UbigeoService {

  private url = "http://localhost:8085/scavontime/ubigeo"
  constructor(private http: HttpClient) { }

  getUbigeo(): Observable<Ubigeo[]> {
    return this.http.get<Ubigeo[]>(`${this.url}`);
  }
}
