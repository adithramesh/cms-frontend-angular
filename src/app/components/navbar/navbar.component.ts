import { Component, inject, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  username: string = 'User';
  showHamburger: boolean = false;
  
  @Output() sidebarToggle = new EventEmitter<void>();
  
  private _authService = inject(AuthService);
  private _router = inject(Router);

  ngOnInit() {
    const user = this._authService.getCurrentUser();
    if (user) {
      console.log("user", user);
      this.username = user.username;
    }
    
    // Check if we should show hamburger based on route
    this.checkRoute();
    
    // Check screen size
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.showHamburger = window.innerWidth <= 768 && this.shouldShowSidebar();
  }

  checkRoute() {
    const currentRoute = this._router.url;
    // Don't show hamburger on auth routes
    this.showHamburger = !currentRoute.includes('/login') && 
                         !currentRoute.includes('/signup') &&
                         window.innerWidth <= 768;
  }

  shouldShowSidebar(): boolean {
    const currentRoute = this._router.url;
    return !currentRoute.includes('/login') && !currentRoute.includes('/signup');
  }

  toggleSidebar() {
    this.sidebarToggle.emit();
  }

  logout() {
    this._authService.logoutUser();
  }
}