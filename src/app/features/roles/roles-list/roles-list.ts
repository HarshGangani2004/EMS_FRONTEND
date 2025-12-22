import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HasPermissionDirective } from '../../../shared/directives/has-permission.directive';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { PermissionService } from '../../../core/services/permission.service';

@Component({
  selector: 'app-roles-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HasPermissionDirective],
  templateUrl: './roles-list.html',
  styleUrls: ['./roles-list.css']
})
export class RolesListComponent implements OnInit {

  roles: any[] = [];
  loading = true;
  searchText: string = "";

  page = 1;
  pageSize = 10;

  totalItems = 0;
  totalPages = 1;

  constructor(
    private http: HttpClient,
    private router: Router,
    private permissionService: PermissionService  
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
  this.loading = true;

  this.http.get<any>(
      `http://localhost:5093/api/Roles/paged?page=${this.page}&pageSize=${this.pageSize}&search=${this.searchText}`
    )
    .subscribe(res => {
      this.roles = res.items;
      this.totalItems = res.totalItems;
      this.totalPages = res.totalPages;
      this.loading = false;
    });
}


  // Pagination (HTML already expects this)
  get paginatedRoles() {
    return this.roles;
  }

  goCreate() {
    this.router.navigate(['/roles/create']);
  }

  goManage(id: number) {
    this.router.navigate(['/roles', id, 'manage']);
  }
  hasAnyActionPermission(): boolean {
  return this.permissionService.has('user.edit') ||
         this.permissionService.has('user.delete');
}

  deleteRole(id: number) {

  Swal.fire({
    title: "Are you sure?",
    text: "This role will be deleted!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete",
    cancelButtonText: "Cancel"
  }).then(result => {

    if (!result.isConfirmed) return;

    this.http.delete(`http://localhost:5093/api/Roles/${id}`)
      .subscribe({

        next: () => {
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Role deleted successfully!"
          });

          this.load();
        },

        error: (err) => {
          Swal.fire({
            icon: "error",
            title: "Cannot delete!",
            // ⭐ show backend message
            text: err.error?.message || "This role is assigned to user. Remove/change user role first."
          });
        }

      });

  });

}


  filterRoles() {
  this.page = 1; 
  this.load();
}

}
