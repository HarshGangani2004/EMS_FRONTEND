import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { DepartmentService } from '../../services/department.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-department-edit',
  imports: [CommonModule, FormsModule],
  templateUrl: './department-edit.html',
  styleUrls: ['./department-edit.css']
})
export class DepartmentEditComponent implements OnInit {

  id!: number;
  model = { name: '' };
  errors: any = {};

  constructor(
    private route: ActivatedRoute,
    private service: DepartmentService,
    private router: Router
  ) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.service.getById(this.id).subscribe((res: any) => {
      this.model = res;
    });
  }

  update(form: NgForm) {
    this.errors = {};

    // REQUIRED VALIDATION
    if (form.invalid) {
      form.control.markAllAsTouched();
      this.errors.name = "Department name is required";
      return;
    }

    // TRIM VALIDATION
    if (this.model.name.trim().length < 2) {
      this.errors.name = "Department name must be at least 2 characters";
      return;
    }

    // API CALL
    this.service.update(this.id, this.model).subscribe({

      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Department updated successfully.',
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
          "")
          .toString()
          .toLowerCase();

        if (msg.includes("name")) {
          this.errors.name = "Department name already exists!";

          Swal.fire({
            icon: 'error',
            title: 'Duplicate Name',
            text: 'This department name already exists!',
            confirmButtonColor: '#d33'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Update Failed',
            text: 'Unable to update department.',
            confirmButtonColor: '#d33'
          });
        }
      }
    });
  }
}
