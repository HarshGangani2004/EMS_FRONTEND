import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { LeaveService } from '../leave.service';
import { HasPermissionDirective } from '../../../shared/directives/has-permission.directive';

@Component({
  selector: 'app-leave-pending',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    HasPermissionDirective
  ],
  templateUrl: './leave-pending.html',
  styleUrls: ['./leave-pending.css']
})
export class LeavePendingComponent implements OnInit {

  leaves: any[] = [];
  loading = true;

  page = 1;
  pageSize = 10;
  totalPages = 1;

  // ✅ YEAR DROPDOWN (LAST 5 YEARS)
  years: number[] = [];

  // ✅ MONTH DROPDOWN (NAME → VALUE)
  months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  // 🔥 FILTER MODEL (BACKEND MATCH)
  filters = {
    year: null as number | null,
    month: null as number | null,
    status: '',
    userName: ''
  };

  constructor(
    private leaveService: LeaveService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.generateYears();
    this.loadLeaves();
  }

  generateYears(): void {
    const currentYear = new Date().getFullYear();
    this.years = [];
    for (let i = 0; i < 5; i++) {
      this.years.push(currentYear - i);
    }
  }

  loadLeaves(): void {
    this.loading = true;

    this.leaveService
      .getAllLeavesPaged(this.page, this.pageSize, this.filters)
      .subscribe({
        next: (res: any) => {
          this.leaves = res.items;
          this.totalPages = res.totalPages;
          this.loading = false;
        },
        error: () => this.loading = false
      });
  }

  applyFilter(): void {
    this.page = 1;
    this.loadLeaves();
  }

  resetFilter(): void {
    this.filters = {
      year: null,
      month: null,
      status: '',
      userName: ''
    };
    this.applyFilter();
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
      confirmButtonText: isApprove ? 'Yes, approve' : 'Yes, reject'
    }).then(result => {

      if (result.isConfirmed) {
        this.leaveService.updateLeaveStatus(id, status).subscribe({
          next: () => {
            Swal.fire(
              isApprove ? 'Approved!' : 'Rejected!',
              `Leave ${status.toLowerCase()} successfully.`,
              'success'
            );
            this.loadLeaves();
          },
          error: (err) => {
            Swal.fire(
              'Failed',
              err.error?.message ?? 'Action failed',
              'error'
            );
          }
        });
      }

    });
  }
}
