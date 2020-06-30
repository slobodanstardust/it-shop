import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { UsersService } from '../services/users.service';
import { User } from '../models/user';
import { NONE_TYPE } from '@angular/compiler';


@Component({
  selector: 'its-login-sign-up',
  templateUrl: './login-sign-up.component.html',
  styleUrls: ['./login-sign-up.component.css']
})

export class LoginSignUpComponent implements OnInit {
  newUser: User;

  userData: FormGroup = this.formBuilder.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  loginMode: boolean = true; // If it is false then it is a sign-up mode.
  signUpAlert: string = 'none';

  constructor(private formBuilder: FormBuilder, private usersService: UsersService) { }

  ngOnInit(): void {
  }

  switchMode (): void {
    this.loginMode = !this.loginMode;
  }

  onSubmit (): void {
    if (this.loginMode) {

    } else {
      this.usersService.addUser(this.userData.value).subscribe((data: User) => {
        this.newUser = data;
        this.signUpAlert = 'flex';
        this.userData.reset();
      });
    }
  }
  
  dismissAlert (element: string): void {
    if (element === 'sign-up') this.signUpAlert = 'none';
  }
}
