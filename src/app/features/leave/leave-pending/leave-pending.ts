import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LeaveService } from '../leave.service';
import { HasPermissionDirective } from '../../../shared/directives/has-permission.directive';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-leave-pending',
  standalone: true,
  imports: [CommonModule, RouterModule, HasPermissionDirective],
  templateUrl: './leave-pending.html',
  styleUrls: ['./leave-pending.css']
})
export class LeavePendingComponent implements OnInit {

  leaves: any[] = [];
  loading = true;

  // 🔥 PAGINATION
  page = 1;
  pageSize = 10;
  totalPages = 1;

  constructor(
    private leaveService: LeaveService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLeaves();
  }

  loadLeaves(): void {
    this.loading = true;

    this.leaveService
      .getAllLeavesPaged(this.page, this.pageSize, '')
      .subscribe({
        next: (res: any) => {
          this.leaves = res.items;          // ✅ FIX
          this.totalPages = res.totalPages;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadLeaves();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadLeaves();
    }
  }

  view(id: number): void {
    this.router.navigate(['/leave/view', id]);
  }

  updateStatus(id: number, status: 'Approved' | 'Rejected'): void {

  const isApprove = status === 'Approved';

  Swal.fire({
    title: isApprove ? 'Approve Leave?' : 'Reject Leave?',
    text: isApprove
      ? 'This leave request will be approved.'
      : 'This leave request will be rejected.',
    icon: isApprove ? 'question' : 'warning',
    showCancelButton: true,
    confirmButtonText: isApprove ? 'Yes, approve' : 'Yes, reject',
    cancelButtonText: 'Cancel',
    confirmButtonColor: isApprove ? '#28a745' : '#d33',
    cancelButtonColor: '#6c757d'
  }).then((result) => {

    if (result.isConfirmed) {

      this.leaveService.updateLeaveStatus(id, status).subscribe({

        // ✅ SUCCESS
        next: () => {

          Swal.fire({
            icon: 'success',
            title: isApprove ? 'Approved!' : 'Rejected!',
            text: `Leave ${status.toLowerCase()} successfully.`,
            timer: 1500,
            showConfirmButton: false
          });

          this.loadLeaves();
        },

        // ❌ ERROR
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: err.error?.message ?? 'Action failed. Please try again.'
          });
        }

      });

    }

  });
}

}
