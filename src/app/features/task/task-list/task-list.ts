import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '../task.service';
import { PermissionService } from '../../../core/services/permission.service';
import { HasPermissionDirective } from '../../../shared/directives/has-permission.directive';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule,HasPermissionDirective],
  templateUrl: './task-list.html',
  styleUrls: ['./task-list.css']
})
export class TaskListComponent implements OnInit {

  tasks: any[] = [];
  
  page = 1;
  pageSize = 10;
  totalCount = 0;
  search = '';

  loading = false;

  constructor(
    private taskService: TaskService,
    private router: Router,
    private permission:PermissionService
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading = true;

    this.taskService
      .getPaged(this.page, this.pageSize, this.search)
      .subscribe({
        next: (res: any) => {
          this.tasks = res.items;
          this.totalCount = res.totalCount;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }
  get totalPages(): number {
  return Math.ceil(this.totalCount / this.pageSize) || 1;
}

  searchTasks(): void {
    this.page = 1;
    this.loadTasks();
  }

  goToCreate(): void {
    this.router.navigate(['/task/create']);
  }

  goToEdit(id: number): void {
    this.router.navigate(['/task/update', id]);
  }

  goToView(id: number): void {
    this.router.navigate(['/task/view', id]);
  }

  delete(id: number): void {

  Swal.fire({
    title: 'Are you sure?',
    text: 'This task will be deleted permanently!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, delete it',
    cancelButtonText: 'Cancel'
  }).then(result => {

    if (result.isConfirmed) {

      this.taskService.delete(id).subscribe({

        next: () => {

          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Task deleted successfully.',
            timer: 1500,
            showConfirmButton: false
          });

          this.loadTasks();
        },

        error: (err: any) => {

          Swal.fire({
            icon: 'error',
            title: 'Failed!',
            text: err.error?.message ?? 'Failed to delete task'
          });
        }
      });

    }

  });
}

  changeStatus(id: number, status: string): void {
    this.taskService.updateStatus(id, status).subscribe({
      next: () => this.loadTasks()
    });
  }

  nextPage(): void {
    if ((this.page * this.pageSize) < this.totalCount) {
      this.page++;
      this.loadTasks();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadTasks();
    }
  }
  hasAnyActionPermission(): boolean {
  return this.permission.has('task.edit') ||
         this.permission.has('task.delete');
}
get isAdmin(): boolean {
  return this.permission.has('admin');
}


}
