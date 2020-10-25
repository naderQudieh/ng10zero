import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { tap, retry , catchError, map } from 'rxjs/operators';
import { COMMON_URL, apsResponse } from '../../core/constants/api.constants';
 
@Injectable()
export class CommonService {
 

  headers = new HttpHeaders().set('Content-Type', 'application/json');
  userId: string = localStorage.getItem('userId');
  token: string = localStorage.getItem('auth_token');
  constructor(private http: HttpClient, private router: Router) {}
 
 
  getcountries(): Observable<apsResponse> {
   
    return this.http.get<apsResponse>(COMMON_URL.countries, {headers: this.headers}).pipe(
        catchError(this.errorMgmt)
    );
  }
  getstates(): Observable<apsResponse> {

    return this.http.get<apsResponse>(COMMON_URL.states, { headers: this.headers }).pipe(
      catchError(this.errorMgmt)
    );
  }
  getlanguages(): Observable<apsResponse> {

    return this.http.get<apsResponse>(COMMON_URL.states, { headers: this.headers }).pipe(
      catchError(this.errorMgmt)
    );
  }

  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.error}`;
    }
    return throwError(errorMessage);
  }
}
