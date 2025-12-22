import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HasPermissionDirective } from '../../../../shared/directives/has-permission.directive';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';
import { PermissionService } from '../../../../core/services/permission.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HasPermissionDirective],
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.css']
})
export class UserListComponent implements OnInit {

  users: any[] = [];

  loading = true;
  searchText = "";

  page = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 1;

  constructor(private service: UserService, private router: Router, private permissionService: PermissionService ) {}

  ngOnInit() {
    this.permissionService.load().subscribe();
    this.loadUsers();
  }

  // LOAD PAGED USERS FROM API
  loadUsers() {
    this.loading = true;

    this.service.getUsersPaged(this.page, this.pageSize, this.searchText)
      .subscribe((res: any) => {
        this.users = res.items;
        this.totalItems = res.totalItems;
        this.totalPages = res.totalPages;
        this.loading = false;
      });
  }
  hasAnyActionPermission(): boolean {
  return this.permissionService.has('user.edit') ||
         this.permissionService.has('user.delete');
}

  // SEARCH
  onSearch() {
    this.page = 1;
    this.loadUsers();
  }

  // OPEN CREATE USER PAGE
  openCreate() {
    this.router.navigate(['/users/create']);
  }

  // EDIT USER
  goEdit(email: string) {
    this.router.navigate(['/users/edit', email]);
  }

  // DELETE USER
  deleteUser(email: string) {

  Swal.fire({
    title: "Are you sure?",
    text: "This action will permanently delete this user.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, delete",
    cancelButtonText: "Cancel"
  }).then((result) => {
    if (!result.isConfirmed) return;

    this.service.deleteUser(email).subscribe({

      // SUCCESS
      next: () => {
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "User has been removed.",
          confirmButtonColor: "#374151"
        });
        this.loadUsers();
      },

      // ERROR HANDLING (ADMIN USER)
      error: (err) => {
        let message =
          err.error?.message ||
          err.error?.detail ||
          err.error ||
          "Failed to delete user";

        if (typeof message !== "string") {
          message = JSON.stringify(message);
        }

        // ⭐ Special message from API (default admin delete)
        if (message.toLowerCase().includes("default admin")) {
          Swal.fire({
            icon: "error",
            title: "Not Allowed!",
            text: "Cannot delete default admin user.",
            confirmButtonColor: "#d33"
          });
          return;
        }

        Swal.fire({
          icon: "error",
          title: "Cannot Delete User",
          text: message,
          confirmButtonColor: "#d33"
        });
      }

    });

  });
}


  // PAGINATION BUTTONS
  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadUsers();
    }
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadUsers();
    }
  }
}
