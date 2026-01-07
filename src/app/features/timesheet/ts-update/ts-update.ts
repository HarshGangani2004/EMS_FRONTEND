import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

import { TimesheetService } from '../timesheet.service';
import { ProjectService } from '../../project/project.service';

@Component({
  selector: 'app-ts-update',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './ts-update.html',
  styleUrl: './ts-update.css',
})
export class TsUpdate implements OnInit {

  id!: number;
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

  loading = true;
  submitting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private timesheetService: TimesheetService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProjects();
    this.loadTimesheet();
  }

  // 🔹 PROJECT LIST
  loadProjects() {
    this.projectService.getPaged(1, 1000, '').subscribe({
      next: (res: any) => {
        this.projects = res.items ?? res.Items ?? [];
      }
    });
  }

  // 🔹 LOAD EXISTING TS
  loadTimesheet() {
    this.timesheetService.getById(this.id).subscribe({
      next: (res: any) => {
        this.model.projectId = res.projectId;
        this.model.title = res.workTitle;
        this.model.description = res.description;

        // ⏱️ extract TIME only
        this.model.startTime = res.startTime?.substring(11, 16);
        this.model.endTime = res.endTime?.substring(11, 16);

        this.model.plannedHours = res.plannedHours;
        this.model.status = res.status;

        this.loading = false;
      },
      error: () => {
        Swal.fire('Error', 'Timesheet not found', 'error');
        this.router.navigate(['/timesheet/my']);
      }
    });
  }

  // 🔹 UPDATE
  update(form: NgForm) {
    if (form.invalid) {
      Swal.fire('Invalid', 'Please fill all required fields', 'warning');
      return;
    }

    this.submitting = true;

    const today = new Date().toISOString().split('T')[0];

    const payload = {
      projectId: this.model.projectId,
      title: this.model.title,
      description: this.model.description,
      startTime: `${today}T${this.model.startTime}`,
      endTime: `${today}T${this.model.endTime}`,
      plannedHours: this.model.plannedHours,
      status: this.model.status
    };

    this.timesheetService.update(this.id, payload).subscribe({
      next: () => {
        Swal.fire('Updated', 'Timesheet updated successfully', 'success');
        this.router.navigate(['/timesheet/my']);
      },
      error: (err) => {
        Swal.fire(
          'Error',
          err.error?.message || 'Update failed',
          'error'
        );
        this.submitting = false;
      }
    });
  }
}
