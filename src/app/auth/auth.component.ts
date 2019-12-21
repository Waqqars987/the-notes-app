import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';
import { MatDialog } from '@angular/material';
import { MessageComponent } from '../shared/message/message.component';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  isLoginMode = true;
  isLoading = false;
  authForm: FormGroup;

  constructor(private authService: AuthService, private router: Router, private dialog: MatDialog) { }

  ngOnInit() {
    this.authForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, Validators.required),
      'confirmPassword': new FormControl(null, Validators.required)
    });
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit() {

    if (this.isLoginMode && this.authForm.controls.email.invalid &&
      this.authForm.controls.password.invalid) {
      this.dialog.open(MessageComponent,
        { data: { error: true, message: "Please enter email & password!" } }
      );
      return;
    }
    if (!this.isLoginMode && this.authForm.invalid) {
      this.dialog.open(MessageComponent,
        { data: { error: true, message: "You are missing required inputs!" } }
      );
      return;
    }
    let authObs: Observable<AuthResponseData>;
    this.isLoading = true;

    if (this.isLoginMode) {
      authObs = this.authService.login(this.authForm.value);
    } else {
      authObs = this.authService.signup(this.authForm.value);
    }

    authObs.subscribe(
      resData => {
        this.isLoading = false;
        if (!this.isLoginMode) {
          this.dialog.open(MessageComponent,
            { data: { error: false, message: "You have successfully registered!" } }
          );
        }
        this.router.navigate(['/notes']);
      },
      errorMessage => {
        this.isLoading = false;
        this.dialog.open(MessageComponent,
          { data: { error: true, message: errorMessage } }
        );
      });
    this.authForm.reset();
   }
}
