import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../task.service';
import { ProjectService } from '../../project/project.service';
import { EmployeeService } from '../../employees/services/employee.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-task-update',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-update.html',
  styleUrls: ['./task-update.css']
})
export class TaskUpdateComponent implements OnInit {

  id!: number;

  model: any = {
    projectId: '',
    assignedTo: '',
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: '',
    status: ''
  };

  projects: any[] = [];
  employees: any[] = [];

  loading = true;
  saving = false;

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private projectService: ProjectService,
    private employeeService:EmployeeService ,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProjects();
    this.loadEmployees();
    this.loadTask();
  }

  loadTask() {
    this.taskService.getById(this.id).subscribe({
      next: (res: any) => {
        this.model = {
          projectId: res.projectId,
          assignedTo: res.assignedTo,
          title: res.title,
          description: res.description,
          priority: res.priority,
          dueDate: res.dueDate?.substring(0, 10),
          status: res.status
        };
        this.loading = false;
      },
      error: () => {
        alert('Task not found');
        this.router.navigate(['/task/list']);
      }
    });
  }

  loadProjects() {
    this.projectService.getPaged(1, 100, '').subscribe({
      next: (res: any) => this.projects = res.items
    });
  }

  loadEmployees() {
    this.employeeService.getPaged(1, 100, '').subscribe({
      next: (res: any) => this.employees = res.items
    });
  }

  save(form: NgForm) {

  if (form.invalid) return;

  this.saving = true;

  this.taskService.update(this.id, this.model).subscribe({

    next: () => {

      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Task updated successfully.',
        timer: 1500,
        showConfirmButton: false
      });

      this.router.navigate(['/task/list']);
    },

    error: (err: any) => {

      this.saving = false;

      Swal.fire({
        icon: 'error',
        title: 'Failed!',
        text: err.error?.message ?? 'Failed to update task'
      });
    }
  });
}

}
