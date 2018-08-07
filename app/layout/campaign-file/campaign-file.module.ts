import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule, NgbAlertModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {} from 'ng2-bootstrap';
import { Ng4FilesModule } from '../../shared/modules';

import { PageHeaderModule, SharedPipesModule } from '../../shared';
import { CampaignFileRoutingModule } from './campaign-file-routing.module';
import { CampaignFileComponent } from './campaign-file.component';

@NgModule({
    imports: [
        CommonModule,
        NgbCarouselModule.forRoot(),
        NgbAlertModule.forRoot(),
        CampaignFileRoutingModule,
        PageHeaderModule,
        NgxDatatableModule,
        FormsModule,
        ReactiveFormsModule,
        SharedPipesModule,
        Ng4FilesModule,
        NgbModule.forRoot()
    ],
    declarations: [
        CampaignFileComponent
    ]
})
export class CampaignFileModule {}
