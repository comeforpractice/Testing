import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { AuthRoutes } from './auth.routing';
import { RegistrationComponent } from './registration/registration.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LayoutModule } from '../layout/layout.module';

@NgModule({
  imports: [
    TranslateModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(AuthRoutes),
    LayoutModule
  ],
  declarations: [
    LoginComponent,
    LogoutComponent,
    ForgotPasswordComponent,
    RegistrationComponent
  ],
  exports: [
    LoginComponent
  ],
  providers: []
})
export class AuthModule { }
