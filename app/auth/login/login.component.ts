import { Component, OnInit } from '@angular/core';
import { ParseService } from '../../shared/services/parse.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { routerTransition } from '../../router.animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [routerTransition()]
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  userName: FormControl;
  password: FormControl;

  constructor(private parseService: ParseService, private router: Router,
    private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    if (this.parseService.isLoggedIn()) {
      this.router.navigate(['campaign']);
    }
    this.createFormControls();
    this.createForm();
  }

  createFormControls() {
    this.userName = new FormControl('', Validators.required);
    this.password = new FormControl('', [
      Validators.required,
      Validators.minLength(8)
    ]);
  }

  createForm() {
    this.loginForm = new FormGroup({
      userName: this.userName,
      password: this.password
    });
  }

  onSubmit() {
    console.log('On Submit:' + this.userName.value);
    if (this.loginForm.valid) {
      this.parseService.login(this.userName.value, this.password.value)
        .then((user) => {
          this.router.navigate(['campaign']);
        }).catch((error) => {
          console.log('Error: cannot login. Please verify email, password or verify the account on your email');
          // this.snackBar.open('Error: cannot login. Please verify email, password or verify the account on your email', 'OK', {
          // duration: 5000,
          // });
          this.router.navigate(['auth', 'login']);
        });
    }

  }

  forgotPassword() {
    this.router.navigate(['auth', 'forgot-password']);
  }

  register() {
    this.router.navigate(['auth', 'register']);
  }
}
