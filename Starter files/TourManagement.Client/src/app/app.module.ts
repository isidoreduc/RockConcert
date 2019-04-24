import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http/src/client';

// import routing module
import { AppRoutingModule } from './app.routing';
import { AppComponent } from './app.component';
import { AboutComponent } from './about';
import {
  ToursComponent,
  TourAddComponent,
  TourDetailComponent,
  TourUpdateComponent
} from './tours';
import { ShowsComponent, ShowAddComponent } from './tours/shows';
import { TourService } from './tours/shared/tour.service';
import { ShowService } from './tours/shows/shared/show.service';
import { MasterDataService } from './shared/master-data.service';
import { GlobalErrorHandler } from './shared/global-error-handler';
import { ErrorLoggerService } from './shared/error-logger.service';
import { HandleHttpErrorInterceptor } from './shared/handle-http-error-interceptor';
import { WriteOutJsonInterceptor } from './shared/write-out-json-interceptor';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    ShowsComponent,
    TourDetailComponent,
    TourAddComponent,
    ToursComponent,
    TourUpdateComponent,
    ShowAddComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: WriteOutJsonInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HandleHttpErrorInterceptor,
      multi: true
    },
    GlobalErrorHandler,
    ErrorLoggerService,
    TourService,
    MasterDataService,
    ShowService,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    // automapper mappings
    // mapping for creating (post) tour when not admin (no access to manager field)
    // using the vendor media types established on API
    // we ignore the formgroup band and manager fields, and add a bandid field, which
    // we map to band
    automapper
      .createMap('TourFormModel', 'TourForHttpPost')
      .forSourceMember(
        'band',
        (opts: AutoMapperJs.ISourceMemberConfigurationOptions) => {
          opts.ignore();
        }
      )
      .forSourceMember(
        'manager',
        (opts: AutoMapperJs.ISourceMemberConfigurationOptions) => {
          opts.ignore();
        }
      )
      .forMember('bandid', opts => {
        opts.mapFrom('band');
      });

    // mapping for creating (post) tour when admin (access to manager field)
    // using the vendor media types established on API
    // we ignore the formgroup band and manager fields, and add a bandid
    // and managerid fields, which we map to band and manager in formgroup
    automapper
      .createMap('TourFormModel', 'TourWithManagerForHttpPost')
      .forSourceMember(
        'band',
        (opts: AutoMapperJs.ISourceMemberConfigurationOptions) => {
          opts.ignore();
        }
      )
      .forSourceMember(
        'manager',
        (opts: AutoMapperJs.ISourceMemberConfigurationOptions) => {
          opts.ignore();
        }
      )
      .forMember('bandid', opts => {
        opts.mapFrom('band');
      })
      .forMember('managerid', opts => {
        opts.mapFrom('manager');
      });
  }
}
