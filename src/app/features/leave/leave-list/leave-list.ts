import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { LeaveService } from '../leave.service';
import { HasPermissionDirective } from '../../../shared/directives/has-permission.directive';

@Component({
  selector: 'app-leave-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    HasPermissionDirective
  ],
  templateUrl: './leave-list.html',
  styleUrls: ['./leave-list.css']
})
export class LeaveListComponent implements OnInit {

  leaves: any[] = [];
  loading = true;

  page = 1;
  pageSize = 10;
  totalPages = 1;

  // ✅ SEARCH (FRONTEND ONLY)
  searchText = '';

  filters = {
    year: null as number | null,
    month: null as number | null,
    status: '',
    leaveType: ''
  };
  openDropdown: string | null = null;

  years: number[] = [];
  leaveTypes: string[] = ['Casual', 'Sick', 'Paid', 'Unpaid'];

  constructor(
    private leaveService: LeaveService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.generateYears();
    this.loadMyLeaves();
  }

  generateYears(): void {
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 4; i++) {
      this.years.push(currentYear - i);
    }
  }

  loadMyLeaves(): void {
    this.loading = true;

    this.leaveService
      .getMyLeavesPaged(this.page, this.pageSize, this.filters)
      .subscribe({
        next: (res) => {
          this.leaves = res.items;
          this.totalPages = res.totalPages;
          this.loading = false;
        },
        error: () => this.loading = false
      });
  }

  // ✅ FRONTEND SEARCH LOGIC
  get filteredLeaves(): any[] {
    if (!this.searchText.trim()) {
      return this.leaves;
    }

    const text = this.searchText.toLowerCase();

    return this.leaves.filter(l =>
      l.leaveType?.toLowerCase().includes(text) ||
      l.status?.toLowerCase().includes(text)
    );
  }

  applyFilter(): void {
    this.page = 1;
    this.loadMyLeaves();
  }

  resetFilter(): void {
    this.filters = {
      year: null,
      month: null,
      status: '',
      leaveType: ''
    };
    this.searchText = '';
    this.applyFilter();
  }

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

  view(id: number): void {
    this.router.navigate(['/leave/view', id]);
  }

  edit(id: number): void {
    this.router.navigate(['/leave/update', id]);
  }
  

toggle(name: string) {
  this.openDropdown = this.openDropdown === name ? null : name;
}

/* YEAR */
selectYear(val: number | null) {
  this.filters.year = val;
  this.openDropdown = null;
}

/* MONTH */
selectMonth(val: number | null) {
  this.filters.month = val;
  this.openDropdown = null;
}

/* STATUS */
selectStatus(val: string) {
  this.filters.status = val;
  this.openDropdown = null;
}

/* LEAVE TYPE */
selectLeaveType(val: string) {
  this.filters.leaveType = val;
  this.openDropdown = null;
}


  delete(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This leave request will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it'
    }).then(result => {
      if (result.isConfirmed) {
        this.leaveService.deleteLeave(id).subscribe(() => {
          Swal.fire('Deleted!', 'Leave deleted successfully.', 'success');
          this.loadMyLeaves();
        });
      }
    });
  
  }
  showYear = false;

toggleYear() {
  this.showYear = !this.showYear;
}

setYear(y: any) {
  this.filters.year = y;
  this.showYear = false;
}

}

