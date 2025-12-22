import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';

import Swal from 'sweetalert2';   // <--- ADD THIS


@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-create.html',
  styleUrls: ['./user-create.css']
})
export class UserCreateComponent implements OnInit {

  roles: any[] = [];

  model = {
    FullName: '',
    Email: '',
    Password: '',
    RoleId: ''
  };

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.loadRoles();
  }

  loadRoles() {
    this.api.get("Roles/paged").subscribe((res: any) => {
      this.roles = Array.isArray(res) ? res : res.items ?? [];
    });
  }


  save(form: any) {
    if (form.invalid) return;
     // trim fix
  this.model.FullName = this.model.FullName.trim();

  // show UI validation messages
  form.control.markAllAsTouched();

  if (form.invalid) return;

  // manual full length check
  if (this.model.FullName.length < 3 || this.model.FullName.length > 30)
    return;

    this.api.post('Admin/create-user', this.model).subscribe({

      next: () => {

        Swal.fire({
          title: "User Created!",
          text: "User added successfully.",
          icon: "success",
          confirmButtonText: "OK"
        }).then(() => {
          this.router.navigate(['/users']);
        });

      },

      error: (err) => {

        const msg =
          (err.error?.message ||
           err.error?.detail ||
           err.error?.title ||
           err.error ||
           "")
            .toString()
            .toLowerCase();

        console.log("USER CREATE ERROR:", msg);

        if (msg.includes("exists") || msg.includes("already")) {
          Swal.fire({
            title: "Already exists",
            text: "Email already registered!",
            icon: "error"
          });
        }
        else {
          Swal.fire({
            title: "Failed!",
            text: "Failed to create user.",
            icon: "error"
          });
        }
      }

    });
  }
}
