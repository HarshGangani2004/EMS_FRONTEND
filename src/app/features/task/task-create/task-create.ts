import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '../task.service';
import { ProjectService } from '../../project/project.service';
import { EmployeeService } from '../../employees/services/employee.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-task-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-create.html',
  styleUrls: ['./task-create.css']
})
export class TaskCreateComponent implements OnInit {

  model: any = {
    projectId: '',
    assignedTo: '',
    status:'',
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: ''
  };

  projects: any[] = [];
  employees: any[] = [];
  saving = false;

  constructor(
    private taskService: TaskService,
    private projectService: ProjectService,
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProjects();
    this.loadEmployees();
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

  if (form.invalid) {
    Object.values(form.controls).forEach(control =>
      control.markAsTouched()
    );
    return;
  }

  this.saving = true;

  this.taskService.create(this.model).subscribe({

    next: () => {

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Task created successfully.',
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
        text: err.error?.message ?? 'Failed to create task'
      });
    }
  });
}

}
