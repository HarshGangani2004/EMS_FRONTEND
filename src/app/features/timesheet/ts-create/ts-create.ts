import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

import { TimesheetService } from '../timesheet.service';
import { ProjectService } from '../../project/project.service';

@Component({
  selector: 'app-ts-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './ts-create.html',
  styleUrl: './ts-create.css',
})
export class TsCreate implements OnInit {

  projects: any[] = [];

  model: any = {
    projectId: null,
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    plannedHours: null,
    status: 'In Progress'
  };

  submitting = false;

  constructor(
    private timesheetService: TimesheetService,
    private projectService: ProjectService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  // ✅ ONLY PROJECTS LOAD
  loadProjects() {
    this.projectService.getPaged(1, 1000, '').subscribe({
      next: (res: any) => {
        this.projects = res.items ?? [];
      },
      error: () => {
        Swal.fire('Error', 'Failed to load projects', 'error');
      }
    });
  }

  // ✅ SAVE TIMESHEET
  save(form: NgForm) {
    if (form.invalid) {
      Swal.fire('Invalid', 'Please fill all required fields', 'warning');
      return;
    }

    this.submitting = true;

    this.timesheetService.create(this.model).subscribe({
      next: () => {
        Swal.fire('Success', 'Timesheet created successfully', 'success');
        this.router.navigate(['/timesheet/my']);
      },
      error: (err) => {
        Swal.fire(
          'Error',
          err.error?.message || 'Failed to create timesheet',
          'error'
        );
        this.submitting = false;
      }
    });
  }
}
