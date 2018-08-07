import { Component } from '@angular/core';
import { ParseService } from '../../shared/services/parse.service';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';

import { routerTransition } from '../../router.animations';

@Component({
  selector: 'app-forgot-password',
  templateUrl: 'forgot-password.component.html',
  styleUrls: ['forgot-password.component.scss'],
  animations: [routerTransition()]
})
export class ForgotPasswordComponent {

  email = new FormControl('', Validators.compose([Validators.required, Validators.email]));

  constructor(private parseService: ParseService, private router: Router) { }

  onSubmit(emailRef) {
    this.parseService.resetPassword(emailRef.value)
      .then(() => {
        emailRef.reset();
        console.log('Email sent. Please check your email to reset your password');
      })
      .catch((error) => {
        console.log('Error: ' + error.message);
      });
  }

  goToLogin() {
    this.router.navigate(['auth', 'login']);
  }

  register() {
    this.router.navigate(['auth', 'register']);
  }
}