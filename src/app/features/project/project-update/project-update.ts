import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../project.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-project-update',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-update.html',
  styleUrls: ['./project-update.css']
})
export class ProjectUpdateComponent implements OnInit {

  id!: number;

  model = {
    name: '',
    description: '',
    startDate: '',
    endDate: ''
  };

  loading = true;
  saving = false;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProject();
  }

  loadProject(): void {
    this.projectService.getById(this.id).subscribe({
      next: (res: any) => {
        this.model = {
          name: res.name ?? '',
          description: res.description ?? '',
          startDate: res.startDate ? res.startDate.split('T')[0] : '',
          endDate: res.endDate ? res.endDate.split('T')[0] : ''
        };
        this.loading = false;
      },
      error: () => {
        alert('Project not found');
        this.router.navigate(['/project/list']);
      }
    });
  }

  isEndDateValid(): boolean {
    if (!this.model.startDate || !this.model.endDate) return false;
    return this.model.endDate >= this.model.startDate;
  }

  save(form: NgForm): void {

  if (
    form.invalid ||
    (this.model.startDate &&
     this.model.endDate &&
     this.model.endDate < this.model.startDate)
  ) {
    Object.values(form.controls).forEach(control =>
      control.markAsTouched()
    );
    return;
  }

  this.saving = true;

  this.projectService.update(this.id, this.model).subscribe({

    next: () => {

      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Project updated successfully.',
        timer: 1500,
        showConfirmButton: false
      });

      this.router.navigate(['/project/list']);
    },

    error: () => {

      this.saving = false;

      Swal.fire({
        icon: 'error',
        title: 'Failed!',
        text: 'Failed to update project'
      });
    }
  });
}


}
