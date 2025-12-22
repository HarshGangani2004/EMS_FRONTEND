import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-role-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './role-create.html',
  styleUrls: ['./role-create.css'],
})
export class RoleCreate {

  model = { name: '' };
  errors: any = {};

  constructor(private http: HttpClient, private router: Router) {}

  save(form: any) {

  form.control.markAllAsTouched();  

  // angular built-in required
  if (form.invalid) return;

  // trim
  const name = this.model.name.trim();
  if (name.length < 2) return;

  const regex = /^[A-Za-z ]+$/;
  if (!regex.test(name)) return;

  // body
  const body = { name };

  this.http.post('http://localhost:5093/api/Roles/create', body)
    .subscribe({

      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Created!',
          showConfirmButton: false,
          timer: 1500
        });

        this.router.navigate(['/roles']);
      },

      error: (err) => {

        const msg = (err.error?.message || err.error?.detail || "").toLowerCase();

        if (msg.includes("exists")) {
          Swal.fire('Duplicate Role', 'This role already exists!', 'error');
          return;
        }

        Swal.fire('Error', 'Failed to create role', 'error');
      }
    });
}

}
