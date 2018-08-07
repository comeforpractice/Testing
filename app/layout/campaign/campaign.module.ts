import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule, NgbCarouselModule, NgbAlertModule, NgbDropdownConfig, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CampaignRoutingModule } from './campaign-routing.module';
import { CampaignComponent } from './campaign.component';

import { Ng4FilesModule } from '../../shared/modules';
import { AngularDualListBoxModule } from 'angular-dual-listbox';

import { PageHeaderModule, SharedPipesModule } from '../../shared';

@NgModule({
    imports: [
        CommonModule,
        NgbCarouselModule.forRoot(),
        NgbAlertModule.forRoot(),
        CampaignRoutingModule,
        PageHeaderModule,
        NgxDatatableModule,
        NgbDropdownModule.forRoot(),
        NgbModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        SharedPipesModule,
        Ng4FilesModule,
        AngularDualListBoxModule
    ],
    declarations: [
        CampaignComponent
    ],
    providers: [ NgbDropdownConfig ]
})
export class CampaignModule {}
