import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Country, State } from './checkout.model';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class Luv2ShopFormService {

  private countryUrl= 'http://localhost:8080/api/countries';
  private stateUrl= 'http://localhost:8080/api/states';

  constructor(private httpClient: HttpClient) { }// I added HttpClient because I need HttpClient calls 

  getCountries(): Observable<Country[]>{
    return this.httpClient.get<GetResponseCountries>(this.countryUrl).pipe
    (map(response =>response._embedded.countries)
    );
  }

  getStates(theCountryCode: string):Observable<State[]>{
    
    // search url
    const searchStateUrl =`${this.stateUrl}/search/findByCountryCode?code=${theCountryCode}`;

    return this.httpClient.get<GetResponseStates>(searchStateUrl).pipe
    (map(response =>response._embedded.states)
    );
  }

  getCreditCardMonths(startMonth: number): Observable<number[]> {

    let data: number[] = [];
    
    // build an array for "Month" dropdown list
    // - start at current month and loop until month number 12

    for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
      data.push(theMonth);
    }

    return of(data);// the of operator from 'rxjs', will wrap an object as an observable 
  }

  getCreditCardYears(): Observable<number[]> {

    let data: number[] = [];

    // build an array for "Year" downlist list
    // - start at current year and loop for next 10 years
    
    const startYear: number = new Date().getFullYear();//give the current year 
    const endYear: number = startYear + 10;

    for (let theYear = startYear; theYear <= endYear; theYear++) {
      data.push(theYear);
    }

    return of(data);
  }

}

interface GetResponseCountries{
  _embedded:{
    countries: Country[];
  }
}

interface GetResponseStates{
  _embedded:{
    states: State[];
  }
}
