import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { DepartmentService } from '../../services/department.service';
import { HasPermissionDirective } from '../../../../shared/directives/has-permission.directive';
import { PermissionService } from '../../../../core/services/permission.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HasPermissionDirective],
  templateUrl: './department-list.html',
  styleUrls: ['./department-list.css']
})
export class DepartmentListComponent implements OnInit {

  departments: any[] = [];

  searchText = "";
  page = 1;
  pageSize = 10;

  totalPages = 1;
  totalItems = 0;

  constructor(
    private service: DepartmentService,
    private router: Router,
    private permissionService: PermissionService   //<--- ⭐
  ) { }

  ngOnInit(): void {
    this.permissionService.load().subscribe();   //<--- LOAD PERMISSIONS
    this.getData();
  }

  getData() {
    this.service.getPaged(this.page, this.pageSize, this.searchText)
      .subscribe((res: any) => {
        this.departments = res.items;
        this.totalPages = res.totalPages;
        this.totalItems = res.totalItems;
      });
  }

  // 👇 EXACT EMPLOYEE STYLE
  hasAnyActionPermission(): boolean {
    return this.permissionService.has('department.edit') ||
           this.permissionService.has('department.delete');
  }

  filterDepartments() {
    this.page = 1;
    this.getData();
  }

  create() {
    this.router.navigate(['/department/create']);
  }

  edit(id: number) {
    this.router.navigate(['/department/edit', id]);
  }

  delete(id: number) {
  Swal.fire({
    title: 'Are you sure?',
    text: 'This department will be permanently deleted!',
    icon: 'warning',
    showCancelButton: true
  }).then((result) => {
    if (result.isConfirmed) {

      this.service.delete(id).subscribe({
        next: () => {
          Swal.fire('Deleted!', 'Department removed.', 'success');
          this.getData();
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: err.error?.message || 'Cannot delete department beacuse its use in employe .'
          });
        }
      });

    }
  });
}

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.getData();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.getData();
    }
  }
  get isAdmin(): boolean {
  return this.permissionService.has('admin');
}

}
