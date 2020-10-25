import {Injectable} from '@angular/core';
import {ConfigurationsService} from '../services/configurations.service';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationsManager {
  public districts: BehaviorSubject<any> = new BehaviorSubject<any>('');
  public timeSections: BehaviorSubject<any> = new BehaviorSubject<any>('');

  constructor(private configurationsService: ConfigurationsService) {
  }

  getDistricts() {
    this.configurationsService.getDistrictsTree().subscribe(response => {
      this.districts.next(response);
    });
  }

  getTimeSections() {
    this.configurationsService.getTimeSections().subscribe(response => {
      this.timeSections.next(response);
    });
  }
}
