import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ParseService } from '../shared/index';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
    constructor(private parseService: ParseService, private router: Router) {}

    ngOnInit() {
        if (this.parseService.isLoggedIn()) {
            this.router.navigate(['campaign']);
        } else {
            this.router.navigate(['auth', 'login']);
        }
    }
}
