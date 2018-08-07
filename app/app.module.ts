import { NgModule, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { NgbDatepickerConfig, NgbDateStruct, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import {
    ParseService,
    CampaignService,
    CampaignButtonService,
    CampaignFileService,
    DeviceService,
    StationService
} from './shared/services/index';
import { SharedPipesModule } from './shared';


// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
    // for development
    // return new TranslateHttpLoader(http, '/start-angular/SB-Admin-BS4-Angular-5/master/dist/assets/i18n/', '.json');
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
        AppRoutingModule,
        AuthModule,
        NgxDatatableModule,
        SharedPipesModule,
        AngularDualListBoxModule
    ],
    declarations: [AppComponent],
    providers: [
        NgbDatepickerConfig,
        ParseService,
        CampaignService,
        CampaignButtonService,
        CampaignFileService,
        DeviceService,
        StationService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}


