import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, EventEmitter, Input, ChangeDetectionStrategy, ViewEncapsulation, } from '@angular/core';
import { EMPTY, Observable, throwError, Subscription, Subject, BehaviorSubject, of } from 'rxjs';
import * as dealsOfTheDay from '../../../assets/Data/deals_of_the_day.json';
import * as topSelection from '../../../assets/Data/top_selection.json';
import * as categories from '../../../assets/Data/categories.json';

@Injectable()
export class  HomeService {

  constructor(private http: HttpClient) {

  }

  getProducts(page=1, limit = 20) {
    let URL = `https://5cafa607f7850e0014629525.mockapi.io/products`;
    return this.http.get(URL)

  }
  getDealsOfTheDay(): Observable<any> {
    return of(dealsOfTheDay);
  }

  getTopSelection(): Observable<any> {
    return of(topSelection);
  }

  getCategories(): Observable<any> {
    return of(categories);
  }

}
