import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss'],
    animations: [routerTransition()]
})
export class ReportsComponent implements OnInit {

    constructor() {
        
    }

    ngOnInit() {}
}