 
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { tap, retry , catchError, map } from 'rxjs/operators';
import { CartItem, Product, apsResponse } from '../product.model';
import { PRODUCT_URL } from '../../../core/constants/api.constants';

@Injectable()
export class ProductService {
  BASE_URL = PRODUCT_URL.PRODUCTS;

  headers = new HttpHeaders().set('Content-Type', 'application/json');
  userId: string = localStorage.getItem('userId');
  token: string = localStorage.getItem('auth_token');
  constructor(private http: HttpClient, private router: Router) {}
 
  updateData(data, entity) {
    const url = `${this.BASE_URL}/${entity}/update/${data.payload.id}`;
    return this.http.post(url, data.payload).pipe(
      map((res) => res),
      catchError(this.errorMgmt)
    );
  }
 
  getProduct(id): Observable<apsResponse> {
    const url = `${this.BASE_URL}/${id}`;
    return this.http.get<apsResponse>(url, {headers: this.headers}).pipe(
        catchError(this.errorMgmt)
    );
  }
  getProducts(page = 1, limit = 20): Observable<apsResponse> {
    const url = `${this.BASE_URL}/all`;
    return this.http.get<apsResponse>(url, {headers: this.headers}).pipe(
      catchError(this.errorMgmt)
    );
  }

  createData(data: Product, entity: string, file) {
    const url = `${this.BASE_URL}/${entity}/create/`;
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('data', JSON.stringify(data));
    return this.http.post(url, formData).pipe(
        catchError(this.errorMgmt)
    );
  }
  removeData(id: string, entity: string) {
    const url = `${this.BASE_URL}/${entity}/delete/${id}`;
    return this.http.delete(url).pipe(
        catchError(this.errorMgmt)
    );
  }
  uploadImage(file, entity): Observable<string> {
    const url = `${this.BASE_URL}/${entity}/upload`;
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<string>(url, formData);
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
  //getItems(page, limit) {
  //  //console.log(page + '  ' + limit);
  //  return this.http.get(
  //    `https://5f9384be8742070016da69c5.mockapi.io/appzero/products?page=${page}&limit=${limit}`
  //  );
  //}
  //getAll(page, limit = 20) {
  //  return this.http.get(
  //    `https://5f9384be8742070016da69c5.mockapi.io/appzero/products`
  //  );
  //}
}
