import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  private _router = inject(Router);

  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();

  isSidebarOpen = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

 

  closeSidebar() {
    if (window.innerWidth <= 768) {
      this.closed.emit();
    }
  }

  navigateToCreate() {
    this._router.navigate(['/blogs/create']);
  }

  navigateToMyBlogs() {
    this._router.navigate(['/blogs'], { queryParams: { filter: 'my' } });
  }

  navigateToAllBlogs() {
    this._router.navigate(['/blogs']);
  }
}