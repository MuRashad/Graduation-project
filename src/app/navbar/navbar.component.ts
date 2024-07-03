import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service'; // Adjust the import according to your project structure

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  isLoggedIn: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });
  }
  reloadIfActive(route: string): void {
    if (this.router.url === route) {
      window.location.reload();
    }
  }
  navigateToHomeAndScrollToContact(): void {
    this.router.navigate(['/home']).then(() => {
      // Wait for the navigation to complete, then scroll to contact section
      setTimeout(() => {
        const contactSection = document.getElementById('contactSection');
        const blogSection=document.getElementById('blogSection');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        if (blogSection) {
          contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100); // Adjust delay as needed
    });
  }

  confirmLogout(): void {
    const confirmLogout = confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }
}

