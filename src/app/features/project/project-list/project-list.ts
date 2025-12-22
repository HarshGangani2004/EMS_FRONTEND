import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectService } from '../project.service';
import { HasPermissionDirective } from '../../../shared/directives/has-permission.directive';
import { PermissionService } from '../../../core/services/permission.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, FormsModule,HasPermissionDirective],
  templateUrl: './project-list.html',
  styleUrls: ['./project-list.css']
})
export class ProjectListComponent implements OnInit {

  projects: any[] = [];
  page = 1;
  pageSize = 10;
  totalCount = 0;
  search = "";
  loading = false;

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private permission:PermissionService
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects() {
    this.loading = true;

    this.projectService.getPaged(this.page, this.pageSize, this.search).subscribe({
      next: (res: any) => {
        this.projects = res.items;
        this.totalCount = res.totalCount;
        this.loading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.loading = false;
      }
    });
  }
  get totalPages(): number {
  return Math.ceil(this.totalCount / this.pageSize) || 1;
}

  searchProjects() {
    this.page = 1;
    this.loadProjects();
  }

  goToCreate() {
    this.router.navigate(['/project/create']);
  }

  goToEdit(id: number) {
    this.router.navigate(['/project/update', id]);
  }

  delete(id: number) {

  Swal.fire({
    title: 'Are you sure?',
    text: 'This project will be deleted permanently!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, delete it',
    cancelButtonText: 'Cancel'
  }).then(result => {

    if (result.isConfirmed) {

      this.projectService.delete(id).subscribe({
        next: () => {

          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Project deleted successfully.',
            timer: 1500,
            showConfirmButton: false
          });

          this.loadProjects();
        },

        error: (err: any) => {

          Swal.fire({
            icon: 'error',
            title: 'Failed!',
            text: err.error?.message ?? 'Unable to delete project'
          });
        }
      });

    }

  });
}


  nextPage() {
    if ((this.page * this.pageSize) < this.totalCount) {
      this.page++;
      this.loadProjects();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadProjects();
    }
  }
  hasAnyActionPermission(): boolean {
  return this.permission.has('project.edit') ||
         this.permission.has('project.delete');

  }
  get isAdmin(): boolean {
  return this.permission.has('admin');
}

}
