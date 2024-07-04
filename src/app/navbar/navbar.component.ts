import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isLoggedIn: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
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

  scrollToSection(event: Event, sectionId: string): void {
    event.preventDefault(); // Prevent default action (e.g., navigation)

    if (this.router.url !== '/home') {
      this.router.navigate(['/home']).then(() => {
        this.router.events.pipe(
          filter(event => event instanceof NavigationEnd)
        ).subscribe(() => {
          this.scrollToSectionById(sectionId);
        });
      });
    } else {
      this.scrollToSectionById(sectionId);
    }
  }

  private scrollToSectionById(sectionId: string): void {
    setTimeout(() => {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100); // Adjust the delay as needed
  }

  confirmLogout(): void {
    const confirmLogout = confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }
}
