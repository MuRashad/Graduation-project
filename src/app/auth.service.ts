import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  constructor(private _HttpClient: HttpClient) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('userToken');
  }

  decodeUserToken(): any {
    const encodedToken = localStorage.getItem('userToken');
    if (encodedToken) {
      try {
        const decodedToken = jwtDecode(encodedToken);
        console.log(decodedToken);
        return decodedToken;
      } catch (error) {
        console.error('Token decoding error:', error);
        this.logout();
        return null;
      }
    }
    return null;
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  logout() {
    localStorage.removeItem('userToken');
    this.isLoggedInSubject.next(false);
  }

  registerUser(formData: any): Observable<any> {
    const apiUrl = 'https://dawaa-bcwc.onrender.com/users/register';
    return this._HttpClient.post(apiUrl, formData)
      .pipe(
        catchError(this.handleError)
      );
  }

  registerPharmacy(formData: any): Observable<any> {
    const apiUrl = 'https://dawaa-bcwc.onrender.com/pharmacies/register';
    return this._HttpClient.post(apiUrl, formData)
      .pipe(
        catchError(this.handleError)
      );
  }

  loginUser(username: string, password: string): Observable<any> {
    const apiUrl = 'https://dawaa-bcwc.onrender.com/users/login';
    const userData = { username, password };
    return this._HttpClient.post<{ token: string }>(apiUrl, userData)
      .pipe(
        tap(response => {
          if (response && response.token) {
            localStorage.setItem('userToken', response.token);
            const decodedToken = this.decodeUserToken();
            if (decodedToken) {
              this.isLoggedInSubject.next(true);
            }
          }
        }),
        catchError(this.handleError)
      );
  }

  loginPharmacy(pharmacy_username: string, pharmacy_password: string): Observable<any> {
    const apiUrl = 'https://dawaa-bcwc.onrender.com/pharmacies/login';
    const pharmacyData = { pharmacy_username, pharmacy_password };
    return this._HttpClient.post<{ token: string }>(apiUrl, pharmacyData)
      .pipe(
        tap(response => {
          if (response && response.token) {
            localStorage.setItem('userToken', response.token);
            const decodedToken = this.decodeUserToken();
            if (decodedToken && decodedToken) {
              this.isLoggedInSubject.next(true);
            }
          }
        }),
        catchError(this.handleError)
      );
  }

private handleError(error: HttpErrorResponse) {
  console.error('Handled Error:', error);
  let errorMessage = 'An unknown error occurred!';

  if (error.error instanceof ErrorEvent) {
    errorMessage = `Client-side error: ${error.error.message}`;
  } else {
    if (error.error && typeof error.error === 'string') {
      errorMessage = error.error;
    } else if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else {
      switch (error.status) {
        case 401:
          errorMessage = 'Unauthorized: Invalid credentials.';
          break;
        case 403:
          errorMessage = 'Forbidden: Access is denied.';
          break;
        case 404:
          errorMessage = 'Not Found: The requested resource could not be found.';
          break;
        case 500:
          errorMessage = 'Internal Server Error: Please try again later.';
          break;
        case 400:
          if (error.error && error.error.message) {
            if (error.error.message.includes('username')) {
              errorMessage = 'Username already exists.';
            } else if (error.error.message.includes('email')) {
              errorMessage = 'Email already exists.';
            } else {
              errorMessage = error.error.message; // Handle other specific error messages
            }
          }
          break;
        default:
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
          break;
      }
    }
  }

  return throwError(errorMessage);
}
}
