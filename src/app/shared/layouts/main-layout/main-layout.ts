import { Component } from '@angular/core';
import { Router, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../features/auth/services/auth.service';
import { HasPermissionDirective } from '../../directives/has-permission.directive';
import { HostListener } from '@angular/core';


@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet,RouterModule,HasPermissionDirective,RouterLinkActive],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.css']
})
export class MainLayoutComponent {

  sidebarOpen = false;

  constructor(private auth: AuthService, private router: Router) {}

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar() {
    if (window.innerWidth < 768) {
      this.sidebarOpen = false;
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
  openProfile() {
  this.router.navigate(['/profile']);
}
userMenuOpen = false;

toggleUserMenu(){
  this.userMenuOpen = !this.userMenuOpen;
}

closeDropdown(){
  this.userMenuOpen = false;
}

@HostListener('document:click', ['$event'])
onClickOutside(event:any){
  if (!event.target.closest('.user-dropdown')) {
    this.userMenuOpen = false;
  }
}


}
