import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AuthService } from './auth.service';
import { SecurityService } from '../security.service';
import { Router } from '@angular/router';
import { FetchDataService } from '../fetch-data.service';

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
    private securityService: SecurityService,
    private router: Router,
    private fetchDataService: FetchDataService,
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
      this.fetchDataService.getEmployees().subscribe({
        next: (data) => {
          let userData: any = data;
          const authenticatedUser = userData.find((user: any) => {
            return (
              user.EMAIL === this.loginForm.value.email &&
              user.ROLE === this.loginForm.value.role && // Good practice to check role during login
              this.securityService.decrypt(user.PASSWORD) === this.loginForm.value.password
            );
          });
          if (authenticatedUser) {
            // SUCCESS
            localStorage.setItem('role', authenticatedUser.ROLE);
            const Token = this.authService.generateJwt();
            localStorage.setItem('token', Token);

            this.router.navigate(['/dashboard']);
          } else {
            // FAILURE - Show your error here
            alert('Invalid Credentials or Role Selection');
          }
          // let isValidUser = userData.map((userData: any) => {
          //   if (userData.EMAIL == this.loginForm.value.email &&
          //     this.securityService.decrypt(userData.PASSWORD) == this.loginForm.value.password) {
          //     localStorage.setItem('role', this.loginForm.value.role)
          //     const Token = this.authService.generateJwt();
          //     localStorage.setItem('token', Token);
          //     this.router.navigate(['/dashboard'])
          //     return true;
          //   }
          //   return false;
          // });
          // console.log('isValidUser', isValidUser);

          // alert('Invalid Credentials');
        },
        error: (err) => {
          console.error('HTTP Error occurred:', err);
        },
        complete: () => {
          console.log('HTTP Request completed');
        }
      });
      // this.dataService.employees.subscribe((data: userData) => {
      //   let userData: any = data;
      //   const userRole: string = this.loginForm.value.role
      //   console.log('userData', this.securityService.encrypt(this.loginForm.value.password), "U2FsdGVkX18UljUutJ4wfhlxvj6tmcVs//1iRGJ+6fA=");

      //   if (userData?.[userRole].email == this.loginForm.value.email &&
      //     this.securityService.decrypt(userData?.[userRole].password) == this.loginForm.value.password) {
      //     localStorage.setItem('role', this.loginForm.value.role)
      //     const Token = this.authService.generateJwt();
      //     localStorage.setItem('token', Token);
      //     this.router.navigate(['/dashboard'])
      //     return true;
      //   }
      //   return false;
      // })

    }
    return false;
  }


}
