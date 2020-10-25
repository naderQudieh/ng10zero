import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import { Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import { Category, Cart, Product } from '../product.model';
import { cartServiceConstants } from '../../../core/constants/api.constants';
 
export class CategoriesService {

  private apiUrl = environment.baseUrl;

  constructor(
    private http: HttpClient,
    
  ) {
  }

  getAllCategories(): Observable<Category> {
    return of(null);
  }

  // Product list
  getCategoryProducts(categoryId): Observable<Product[]> {
    return of([]);
  }

}
