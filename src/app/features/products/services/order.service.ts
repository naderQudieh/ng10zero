/// <reference path="../../../core/constants/api.constants.ts" />
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartItem, Product, Order  } from '../product.model';
import { ORDER_URLS } from '../../../core/constants/api.constants';

@Injectable()
export class OrderService {

  localCache = {};
  orderFormValue = {}; 

  constructor(
    private http: HttpClient
  ) { }


  getProducts(paginator, filter): Observable<{ count: number, results: Product[] }> {
    return this.http.get<{ count: number, results: Product[] }>(`${ORDER_URLS.PRODUCT}`);
  }


  getProductsByCode(paginator, filter): Observable<{ count: number, results: Product[] }> {
    return this.http.get<{ count: number, results: Product[] }>(`${ORDER_URLS.PRODUCT}`);
  }


  getProductCategories(): Observable<Product[]> {
    return this.http.get<Product[]>(ORDER_URLS.PRODUCT_CATEGORY);
  }


  

 

  createOrder(order) {
    return this.http.post<null>(ORDER_URLS.ORDER, order);
  }


  getOrder(id: number) {
    return this.http.get<Order>(`${ORDER_URLS.ORDER}/${id}/`);
  }
}
