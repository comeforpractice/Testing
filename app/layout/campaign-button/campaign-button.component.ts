import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';

import { CampaignButtonService } from '../../shared/services/index';

@Component({
    selector: 'app-campaign-button',
    templateUrl: './campaign-button.component.html',
    styleUrls: ['./campaign-button.component.scss'],
    animations: [routerTransition()]
})
export class CampaignButtonComponent implements OnInit {

    rows = [];
    selected = [];

    constructor(private campaignButtonService: CampaignButtonService) { }

    ngOnInit() {
        this.fetch();
    }

    fetch() {
        this.campaignButtonService.getAll().subscribe(data => {
            this.rows = data;
            console.log(data);
        }, error => {
            this.selected = [];
            this.rows = [];
            console.log(error);
        });
    }

    onSelect({ selected }) {
        console.log('Select Event', selected, this.selected);

        this.selected.splice(0, this.selected.length);
        this.selected.push(...selected);
    }

    onActivate(event) {
        console.log('Activate Event', event);
    }

    add() {
        this.selected.push(this.rows[1], this.rows[3]);
    }

    update() {
        this.selected = [this.rows[1], this.rows[3]];
    }

    remove() {
        this.selected = [];
    }

    displayCheck(row) {
        return true;
    }
}
