import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { DepartmentService } from '../../services/department.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-department-create',
  imports: [CommonModule, FormsModule],
  templateUrl: './department-create.html',
  styleUrls: ['./department-create.css']
})
export class DepartmentCreateComponent {

  model = { name: '' };
  errors: any = {};

  constructor(
    private service: DepartmentService,
    private router: Router
  ) {}

  save(form: NgForm) {
    this.errors = {};

    if (form.invalid) {
      form.control.markAllAsTouched();
      this.errors.name = "Department name is required";
      return;
    }

    if (this.model.name.trim().length < 2) {
      this.errors.name = "Department name must be at least 2 characters";
      return;
    }

    // API CALL
    this.service.create(this.model).subscribe({

      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Created!',
          text: 'Department created successfully',
          confirmButtonColor: '#374151'
        }).then(() => {
          this.router.navigate(['/department']);
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

        if (msg.includes("name")) {
          this.errors.name = "Department name already exists!";

          Swal.fire({
            icon: 'error',
            title: 'Duplicate Department',
            text: 'This department name already exists!',
            confirmButtonColor: '#d33'
          });

        } else {
          this.errors.form = "Failed to create department";

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to create department',
            confirmButtonColor: '#d33'
          });
        }
      }
    });
  }
}
