import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {searchServiceConstants} from '../../../core/constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class SearchService { 
  public searchKey: string;

  constructor(private http: HttpClient) {
  }

  search(terms: Observable<string>) {
    if (terms) {
      return terms.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(term => this.searchEntries(term))
      );
    }
  }

  searchEntries(term) {
    this.searchKey = term;
    return this.http.get(searchServiceConstants.searchEntries + term);
  }
}
