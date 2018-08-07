import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule, NgbAlertModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Ng4FilesModule } from '../../shared/modules';
import { PageHeaderModule, SharedPipesModule } from '../../shared';
import { DeviceRoutingModule } from './device-routing.module';
import { DeviceComponent } from './device.component';

@NgModule({
    imports: [
        CommonModule,
        NgbCarouselModule.forRoot(),
        NgbAlertModule.forRoot(),
        PageHeaderModule,
        NgxDatatableModule,
        DeviceRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        SharedPipesModule,
        Ng4FilesModule,
        NgbModule.forRoot()
    ],
    declarations: [
        DeviceComponent
    ]
})
export class DeviceModule { }
