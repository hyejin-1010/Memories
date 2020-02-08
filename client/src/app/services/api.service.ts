import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  readonly HOST = 'http://localhost:3100';
  readonly PREFIX = 'api';

  constructor(private http: HttpClient) { }

  get(endpoint: string, params?: any, reqOpts?: any): Observable<any> {
    if (!reqOpts) {
      reqOpts = {params: new HttpParams()};
    }

    // Support easy query params for GET requests
    if (params) {
      reqOpts.params = new HttpParams();
      for (const k in params) {
        if (params.hasOwnProperty(k)) {
          reqOpts.params = reqOpts.params.set(k, params[k]);
        }
      }
    }

    return this.http.get(`${this.HOST}/${this.PREFIX}/${endpoint}`, reqOpts);
  }

  post(endpoint: string, body: any, params?: any, reqOpts?: any): Observable<any> {
    if (!reqOpts) {
      reqOpts = {params: new HttpParams()};
    }

    // Support easy query params for GET requests
    if (params) {
      reqOpts.params = new HttpParams();
      for (const p in params) {
        if (params.hasOwnProperty(p)) {
          reqOpts.params = reqOpts.params.set(p, params[p]);
        }
      }
    }

    return this.http.post(`${this.HOST}/${this.PREFIX}/${endpoint}`, body, reqOpts);
  }

  put(endpoint: string, body: any, reqOpts?: any): Observable<any> {
    return this.http.put(`${this.HOST}/${this.PREFIX}/${endpoint}`, body, reqOpts);
  }

  delete(endpoint: string, body?: any): Observable<any> {
    if (body) {
      // @ts-ignore 명시적 body 처리
      // https://stackoverflow.com/a/40857437
      return this.http.delete(`${this.HOST}/${this.PREFIX}/${endpoint}`, {body});
    }
    return this.http.delete(`${this.HOST}/${this.PREFIX}/${endpoint}`);
  }

  patch(endpoint: string, body: any, reqOpts?: any): Observable<any> {
    return this.http.patch(`${this.HOST}/${this.PREFIX}/${endpoint}`, body, reqOpts);
  }
}
