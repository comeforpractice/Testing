import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CampaignButtonComponent } from './campaign-button.component';

const routes: Routes = [
    {
        path: '', component: CampaignButtonComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CampaignButtonRoutingModule {

}
