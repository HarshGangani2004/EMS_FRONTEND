import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SkillsService } from '../../services/skills.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-skill-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './skill-edit.html',
  styleUrls: ['./skill-edit.css']
})
export class SkillEditComponent implements OnInit {

  id!: number;
  model = { name: '' };
  errors: any = {};

  constructor(
    private route: ActivatedRoute,
    private service: SkillsService,
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

    // Required validation
    if (form.invalid) {
      this.errors.name = "Skill name is required";
      return;
    }

    // No empty space
    if (this.model.name.trim().length < 2) {
      this.errors.name = "Skill name must be at least 2 characters";
      return;
    }

    // API CALL
    this.service.update(this.id, this.model).subscribe({

      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Skill updated successfully.',
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
        } else {
          this.errors.form = "Failed to update skill";
        }

        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: this.errors.name || this.errors.form,
          confirmButtonColor: '#d33'
        });
      }
    });
  }
}
