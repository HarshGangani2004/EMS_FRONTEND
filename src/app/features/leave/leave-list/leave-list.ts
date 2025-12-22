import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LeaveService } from '../leave.service';
import { HasPermissionDirective } from '../../../shared/directives/has-permission.directive';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-leave-list',
  standalone: true,
  imports: [CommonModule, RouterModule, HasPermissionDirective,FormsModule],
  templateUrl: './leave-list.html',
  styleUrls: ['./leave-list.css']
})
export class LeaveListComponent implements OnInit {

  leaves: any[] = [];
  loading = true;

  // 🔥 PAGINATION
  page = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 1;

  // 🔍 SEARCH
  search = '';

  constructor(
    private leaveService: LeaveService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMyLeaves();
  }

  // =========================
  // LOAD LEAVES (PAGED)
  // =========================
  loadMyLeaves(): void {
    this.loading = true;

    this.leaveService
      .getMyLeavesPaged(this.page, this.pageSize, this.search)
      .subscribe({
        next: (res) => {
          this.leaves = res.items;
          this.totalItems = res.totalItems;
          this.totalPages = res.totalPages;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  // =========================
  // SEARCH
  // =========================
  onSearch(): void {
    this.page = 1;           // reset to first page
    this.loadMyLeaves();
  }

  // =========================
  // PAGINATION
  // =========================
  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadMyLeaves();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadMyLeaves();
    }
  }

  // =========================
  // ACTIONS
  // =========================
  view(id: number): void {
    this.router.navigate(['/leave/view', id]);
  }

  edit(id: number): void {
    this.router.navigate(['/leave/update', id]);
  }

  delete(id: number): void {

  Swal.fire({
    title: 'Are you sure?',
    text: 'This leave request will be permanently deleted!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6'
  }).then((result) => {

    if (result.isConfirmed) {

      this.leaveService.deleteLeave(id).subscribe({
        next: () => {

          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Leave deleted successfully.',
            timer: 1500,
            showConfirmButton: false
          });

          this.loadMyLeaves();
        },

        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Failed!',
            text: 'Unable to delete leave. Please try again.'
          });
        }
      });

    }

  });
}

}
