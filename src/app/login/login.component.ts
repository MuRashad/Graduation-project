import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isLoading: boolean = false;
  apiError: string = "";
  selectedForm: 'user' | 'pharmacy' | null = null;
  pharmacyClicked = false;
  userClicked = false;

  userLoginForm: FormGroup = new FormGroup({
    username: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20)
    ]),
    password: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^[A-Za-z]{2}[A-Za-z0-9]{6,}/)
    ])
  });

  pharmacyLoginForm: FormGroup = new FormGroup({
    pharmacy_username: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20)
    ]),
    pharmacy_password: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^[A-Za-z]{2}[A-Za-z0-9]{6,}/)
    ])
  });

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Check authentication status on component initialization
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  // Function to choose form based on button click and hide buttons
  chooseForm(formType: 'user' | 'pharmacy') {
    this.selectedForm = formType;
  }

  handleLogin() {
    this.apiError = '';
    this.isLoading = true;

    if (this.selectedForm === 'user') {
      this.authService.loginUser(this.userLoginForm.value.username, this.userLoginForm.value.password)
        .subscribe({
          next: (res) => {
            console.log('User Login successful:', res);
            const decodedToken = this.authService.decodeUserToken();
            if (decodedToken) {
              this.router.navigate(['/home']);
              // Prevent navigating back to login
              history.pushState(null, '/home');
            } else {
              this.apiError = 'Invalid token received.';
              this.authService.logout();
            }
            this.isLoading = false;
          },
          error: (err) => {
            this.isLoading = false;
            console.error('User Login error:', err);
            this.apiError = err || 'Login failed. Please try again.'; // Display error directly here
          }
        });
    } else if (this.selectedForm === 'pharmacy') {
      this.authService.loginPharmacy(this.pharmacyLoginForm.value.pharmacy_username, this.pharmacyLoginForm.value.pharmacy_password)
        .subscribe({
          next: (res) => {
            console.log('Pharmacy Login successful:', res);
            const decodedToken = this.authService.decodeUserToken();
            if (decodedToken) {
              this.router.navigate(['/home']);
              history.pushState(null, '/home');
            } else {
              this.apiError = 'Invalid token received.';
              this.authService.logout();
            }
            this.isLoading = false;
          },
          error: (err) => {
            this.isLoading = false;
            console.error('Pharmacy Login error:', err);
            this.apiError = err || 'Login failed. Please try again.'; // Display error directly here
          }
        });
    }
  }
}
