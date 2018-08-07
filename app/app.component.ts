import { Component, OnInit, ViewEncapsulation, Injectable } from '@angular/core';
import { NgbDatepickerConfig, NgbDateStruct, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class DateNativeAdapter extends NgbDateAdapter<Date> {

  fromModel(date: Date): NgbDateStruct {
    let retdate = (date && date.getFullYear) ? { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() } : null;
    console.log(retdate);
    return retdate;
  }

  toModel(date: NgbDateStruct): Date {
    let retdate = date ? new Date(Date.UTC(date.year, date.month - 1, date.day)) : null;
    console.log(retdate);
    return retdate;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [NgbDatepickerConfig
    // , {provide: NgbDateAdapter, useClass: DateNativeAdapter}
  ]
})
export class AppComponent implements OnInit {

  static AVAILABLE_LIST_NAME = 'available';
  static CONFIRMED_LIST_NAME = 'confirmed';
  static LTR = 'left-to-right';
  static RTL = 'right-to-left';
  static DEFAULT_FORMAT = { add: 'Add', remove: 'Remove', all: 'All', none: 'None', direction: AppComponent.LTR, draggable: true };

  constructor(config: NgbDatepickerConfig) {
    // customize default values of datepickers used by this component tree
    config.minDate = { year: 1900, month: 1, day: 1 };
    config.maxDate = { year: 2099, month: 12, day: 31 };

    // days that don't belong to current month are not visible
    config.outsideDays = 'hidden';

    // weekends are disabled
    // config.markDisabled = (date: NgbDateStruct) => {
    //     const d = new Date(date.year, date.month - 1, date.day);
    //     return d.getDay() === 0 || d.getDay() === 6;
    // };
  }

  ngOnInit() {
  }
}
