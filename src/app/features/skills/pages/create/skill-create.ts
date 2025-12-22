import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SkillsService } from '../../services/skills.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-skill-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './skill-create.html',
  styleUrls: ['./skill-create.css']
})
export class SkillCreateComponent {

  model = { name: '' };
  errors: any = {};   

  constructor(private service: SkillsService, private router: Router) {}

 save(form: NgForm) {

  this.errors = {};

  if (form.invalid) {
    form.control.markAllAsTouched();
    this.errors.name = "Skill name is required";
    return;
  }

  if (this.model.name.trim().length < 2) {
    this.errors.name = "Skill name must be at least 2 characters";
    return;
  }

  this.service.create(this.model).subscribe({

    next: () => {
      Swal.fire({
        icon: 'success',
        title: 'Created!',
        text: 'Skill created successfully',
        confirmButtonColor: '#374151'
      }).then(() => {
        this.router.navigate(['/skills']);
      });
    },

    error: (err) => {
      const msg = (
        err.error?.message ||
        err.error?.detail ||
        err.error?.title ||
        ""
      ).toString().toLowerCase();

      if (msg.includes("exists")) {
        this.errors.name = "Skill name already exists!";

        Swal.fire({
          icon: 'error',
          title: 'Duplicate Skill Name',
          text: 'This skill already exists!',
          confirmButtonColor: '#d33'
        });

      } else {
        this.errors.form = "Failed to create skill";

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to create skill',
          confirmButtonColor: '#d33'
        });
      }
    }
  });
}

}
