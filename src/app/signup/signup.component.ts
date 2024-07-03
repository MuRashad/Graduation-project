import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  isLoading: boolean = false;
  apiError: string = '';
  userClicked = false;
  pharmacyClicked = false;

  // Define FormGroup for user registration
  userForm: FormGroup = new FormGroup({
    username: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    name: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.pattern(/^[A-Za-z]{2}[A-Za-z0-9]{6,}$/)]),
  });

  // Define FormGroup for pharmacy registration
  pharmacyForm: FormGroup = new FormGroup({
    pharmacy_username: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    pharmacy_name: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    pharmacy_password: new FormControl(null, [Validators.required, Validators.pattern(/^[A-Za-z]{2}[A-Za-z0-9]{6,}$/)]),
    pharmacy_address: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(40)]),
  });

  selectedForm: 'user' | 'pharmacy' | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  // Method to choose between user and pharmacy forms
  chooseForm(formType: 'user' | 'pharmacy') {
    this.selectedForm = formType;
  }

  // Method to handle form submission
  handleRegister() {
    if (this.selectedForm === 'user' && this.userForm.valid) {
      this.isLoading = true;
      this.apiError = '';

      this.authService.registerUser(this.userForm.value).subscribe({
        next: (res) => {
          console.log('User API response: ', res);
          this.router.navigate(['/login']);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('User API error: ', err);
          this.isLoading = false;
          if (err === 'Username already exists.') {
            this.userForm.get('username')?.setErrors({ exists: true });
          } else if (err === 'Email already exists.') {
            this.userForm.get('email')?.setErrors({ exists: true });
          } else {
            this.apiError = err || 'An error occurred. Please try again.';
          }
        }
      });
    }

    else if (this.selectedForm === 'pharmacy' && this.pharmacyForm.valid) {
      this.isLoading = true;
      this.apiError = '';

      this.authService.registerPharmacy(this.pharmacyForm.value).subscribe({
        next: (res) => {
          console.log('Pharmacy API response: ', res);
          this.router.navigate(['/login']);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Pharmacy API error: ', err);
          this.isLoading = false;
          this.apiError = err || 'An error occurred. Please try again.';
        }
      });
    }
    else {
      // Mark all fields as touched to display validation errors
      if (this.selectedForm === 'user') {
        Object.keys(this.userForm.controls).forEach(key => {
          this.userForm.get(key)?.markAsTouched();
        });
      } else if (this.selectedForm === 'pharmacy') {
        Object.keys(this.pharmacyForm.controls).forEach(key => {
          this.pharmacyForm.get(key)?.markAsTouched();
        });
      }
    }
  }
}
