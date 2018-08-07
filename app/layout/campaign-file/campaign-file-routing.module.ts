import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CampaignFileComponent } from './campaign-file.component';

const routes: Routes = [
    {
        path: '',
        component: CampaignFileComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CampaignFileRoutingModule {

}
