import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { PageHeaderModule } from '../../shared';
import { CampaignButtonRoutingModule } from './campaign-button-routing.module';
import { CampaignButtonComponent } from './campaign-button.component';

@NgModule({
    imports: [
        CommonModule,
        NgbCarouselModule.forRoot(),
        NgbAlertModule.forRoot(),
        CampaignButtonRoutingModule,
        PageHeaderModule,
        NgxDatatableModule
    ],
    declarations: [
        CampaignButtonComponent
    ]
})
export class CampaignButtonModule {}
