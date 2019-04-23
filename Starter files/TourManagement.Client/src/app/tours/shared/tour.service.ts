import { Injectable, ErrorHandler } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { Tour } from './tour.model';
import { BaseService } from '../../shared/base.service';
import { TourWithProfits } from './tour-with-profits.model';

@Injectable()
export class TourService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  getTours(): Observable<Tour[]> {
    return this.http.get<Tour[]>(`${this.apiUrl}/tours`);
  }

  getTour(tourId: string): Observable<Tour> {
    return this.http.get<Tour>(`${this.apiUrl}/tours/${tourId}`);
  }

  getTourWithProfits(tourId: string): Observable<TourWithProfits> {
    return this.http.get<TourWithProfits>(`${this.apiUrl}/tours/${tourId}`);
  }
}
