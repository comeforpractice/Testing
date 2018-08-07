import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginGuard } from './auth/guards/login/login.guard';

const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full', canActivate: [LoginGuard] },
    { path: 'login', loadChildren: './auth/auth.module#AuthModule' },
    { path: 'auth', loadChildren: './auth/auth.module#AuthModule' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
