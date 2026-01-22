import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AuthService } from './auth.service';
import { DataService } from '../data.service';
import { userData } from "./interface/login.interface"
import { userSeedData } from './seedData/userSeed';
import { SecurityService } from '../security.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isVisible: Boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private dataService: DataService,
    private securityService: SecurityService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        this.passwordStrengthValidator()
      ]],
      role: ['', Validators.required]
    });
  }

  // Custom validator defined inside the component
  passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) return null;

      const hasUpperCase = /[A-Z]/.test(value);
      const hasNumber = /\d/.test(value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      const hasMinLength = value.length >= 8;

      const isValid = hasUpperCase && hasNumber && hasSpecialChar && hasMinLength;

      return isValid ? null : {
        passwordStrength: {
          hasUpperCase,
          hasNumber,
          hasSpecialChar,
          hasMinLength
        }
      };
    };
  }

  get email() {
    return this.loginForm.get('email')!;
  }
  get password() {
    return this.loginForm.get('password')!;
  }
  get role() {
    return this.loginForm.get('role')!;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.dataService.employees.subscribe((data: userData) => {
        let userData: any = data;
        if (!userData) {
          localStorage.setItem("userData", JSON.stringify(userSeedData));
          userData = userSeedData
          this.dataService.fetchEmployees();
        }
        const userRole: string = this.loginForm.value.role
        console.log('userData', this.securityService.encrypt(this.loginForm.value.password), "U2FsdGVkX18UljUutJ4wfhlxvj6tmcVs//1iRGJ+6fA=");

        if (userData?.[userRole].email == this.loginForm.value.email &&
          this.securityService.decrypt(userData?.[userRole].password) == this.loginForm.value.password) {
          localStorage.setItem('role', this.loginForm.value.role)
          const Token = this.authService.generateJwt();
          localStorage.setItem('token', Token);
          this.router.navigate(['/dashboard'])
          return true;
        }
        return false;
      })

    }
    return false;
  }



}
