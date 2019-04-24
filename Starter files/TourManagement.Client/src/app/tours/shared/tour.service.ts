import { Injectable, ErrorHandler } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { Tour } from './tour.model';
import { BaseService } from '../../shared/base.service';
import { TourWithProfits } from './tour-with-profits.model';
import { TourForHttpPost } from './tour-for-http-post.model';
import { TourWithManagerForHttpPost } from './tour-with-manager-for-http-post.model';

@Injectable()
export class TourService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  getTours(): Observable<Tour[]> {
    return this.http.get<Tour[]>(`${this.apiUrl}/tours`);
  }

  getTour(tourId: string): Observable<Tour> {
    return this.http.get<Tour>(`${this.apiUrl}/tours/${tourId}`, {
      headers: { Accept: 'application/vnd.isidore.tour+json' }
    });
  }

  // accessing the resource via custom media type
  getTourWithProfits(tourId: string): Observable<TourWithProfits> {
    return this.http.get<TourWithProfits>(`${this.apiUrl}/tours/${tourId}`, {
      headers: { Accept: 'application/vnd.isidore.tourWithProfits+json' }
    });
  }
  // the observable is of type Tour, we want to serialize a generic tour when storing
  // into DB
  postTour(tourToAdd: TourForHttpPost): Observable<Tour> {
    return this.http.post<Tour>(`${this.apiUrl}/tours`, tourToAdd, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  postTourWithManager(tourToAdd: TourWithManagerForHttpPost): Observable<Tour> {
    return this.http.post<Tour>(`${this.apiUrl}/tours`, tourToAdd, {
      headers: {
        'Content-Type':
          'application/vnd.isidore.tourWithManagerForHttpPost+json'
      }
    });
  }
}
