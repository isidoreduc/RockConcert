import { Component, OnInit, OnDestroy } from '@angular/core';
import { Band } from '../../shared/band.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { MasterDataService } from '../../shared/master-data.service';
import { TourService } from '../shared/tour.service';
import { Router } from '@angular/router';
import { Manager } from '../../shared/manager.model';

@Component({
  selector: 'app-tour-add',
  templateUrl: './tour-add.component.html',
  styleUrls: ['./tour-add.component.css']
})
export class TourAddComponent implements OnInit {
  public tourForm: FormGroup;
  bands: Band[];
  isAdmin = true;
  managers: Manager[];

  constructor(
    private masterDataService: MasterDataService,
    private tourService: TourService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    // define the tourForm (with empty default values)
    this.tourForm = this.formBuilder.group({
      band: [''],
      manager: [''],
      title: [''],
      description: [''],
      startDate: [],
      endDate: []
    });

    // get bands from master data service
    this.masterDataService.getBands().subscribe(bands => {
      this.bands = bands;
    });

    if (this.isAdmin === true) {
      this.masterDataService.getManagers().subscribe(managers => {
        this.managers = managers;
      });
    }
  }

  addTour(): void {
    if (this.tourForm.dirty) {
      if (this.isAdmin === true) {
        const tour = automapper.map(
          'TourFormModel',
          'TourWithManagerForHttpPost',
          this.tourForm.value
        );
        this.tourService
          .postTourWithManager(tour)
          .subscribe(() => this.router.navigateByUrl('/tours'));
      } else {
        const tour = automapper.map(
          'TourFormModel',
          'TourForHttpPost',
          this.tourForm.value
        );
        this.tourService
          .postTour(tour)
          .subscribe(() => this.router.navigateByUrl('/tours'));
      }
    }
  }
}
