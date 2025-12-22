import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';


@Component({
  standalone: true,
  selector: 'app-user-edit',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-edit.html',
  styleUrls: ['./user-edit.css']
})
export class UserEditComponent implements OnInit {

  model = {
    fullName: '',
    email: '',
    role: ''   // <-- FIXED
  };

  roles: any[] = []; // <-- FIXED

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: UserService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const email = this.route.snapshot.paramMap.get('email');
    if (email) {
      this.loadUser(email);
    }

    this.loadRoles();
  }

  loadRoles() {
  this.http.get<any>("http://localhost:5093/api/Roles/paged")
    .subscribe(res => {
      this.roles = Array.isArray(res) ? res : res.items; 
      // Handles both: [..] or { items: [...] }
    });
}


  loadUser(email: string) {
    this.service.getUserByEmail(email).subscribe({
      next: (res) => {
        this.model.fullName = res.fullName || '';
        this.model.email = res.email;
        this.model.role = res.roles?.[0] || '';  // FIXED
      },
      error: () => alert("Failed to load user")
    });
  }

  onSubmit() {
  this.service.changeRole(this.model.email, this.model.role).subscribe({

    next: () => {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'User role updated successfully!'
      }).then(() => {
        this.router.navigate(['/users']);
      });
    },

    error: () => {
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: 'Failed to update role'
      });
    }

  });
}

}
