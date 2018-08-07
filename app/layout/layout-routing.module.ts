import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: 'campaign', loadChildren: './campaign/campaign.module#CampaignModule' },
            { path: 'campaignFile/:campaignId', loadChildren: './campaign-file/campaign-file.module#CampaignFileModule' },
            { path: 'campaignBtn', loadChildren: './campaign-button/campaign-button.module#CampaignButtonModule' },
            { path: 'station', loadChildren: './station/station.module#StationModule' },
            { path: 'device', loadChildren: './device/device.module#DeviceModule' },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}
