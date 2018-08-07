import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Ng4FilesModule } from '../../shared/modules';
import { PageHeaderModule, SharedPipesModule } from '../../shared';
import { StationRoutingModule } from './station-routing.module';
import { StationComponent } from './station.component';
import { AngularDualListBoxModule } from 'angular-dual-listbox';

@NgModule({
    imports: [
        CommonModule,
        NgbCarouselModule.forRoot(),
        NgbAlertModule.forRoot(),
        NgxDatatableModule,
        PageHeaderModule,
        StationRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        SharedPipesModule,
        Ng4FilesModule,
        AngularDualListBoxModule
    ],
    declarations: [
        StationComponent
    ]
})
export class StationModule {}
