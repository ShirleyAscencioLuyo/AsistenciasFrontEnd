import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private url = "http://localhost:8085/scavontime/reports"

  constructor(private http: HttpClient) { }

  descargarReporte(estado: string){

    let queryParams = new HttpParams();
    queryParams = queryParams.append("estado", estado);

    return this.http
      .get(this.url + '/teacher-pdf', {
        params: queryParams,
        responseType: 'arraybuffer',
      });
  }
}
