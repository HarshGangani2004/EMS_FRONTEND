import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { TimesheetService } from '../timesheet.service';
import { HttpClient } from '@angular/common/http';
import { HasPermissionDirective } from '../../../shared/directives/has-permission.directive';
import { PermissionService } from '../../../core/services/permission.service';

@Component({
  selector: 'app-ts-all',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule,HasPermissionDirective],
  templateUrl: './ts-all.html',
  styleUrls: ['./ts-all.css']
})
export class TsAllComponent implements OnInit {

  items: any[] = [];
  projects: any[] = [];

  page = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;
  loading = false;

  filter = {
    year: null as number | null,
    month: null as number | null,
    search: '',
    status: '',
    projectId: null as number | null
  };

  constructor(
    private service: TimesheetService,
    private http: HttpClient,
    private router: Router,
    private permissionService: PermissionService
  ) {}

  ngOnInit(): void {
    this.permissionService.load().subscribe();
    this.loadProjects();
    this.load();
  }

  // =========================
  // LOAD PROJECTS
  // =========================
  loadProjects() {
    this.http
      .get<any>('http://localhost:5093/api/projects/paged?page=1&pageSize=1000')
      .subscribe({
        next: res => {
          this.projects = res.items || [];
        },
        error: err => {
          console.error('PROJECT API ERROR', err);
        }
      });
  }

  // =========================
  // LOAD ALL TIMESHEETS
  // =========================
  load() {
    this.loading = true;

    this.service.getAllTs(this.page, this.pageSize, this.filter)
      .subscribe({
        next: (res: any) => {
          this.items = res.items ?? [];
          this.totalItems = res.totalItems ?? this.items.length;
          this.totalPages = Math.max(1, Math.ceil(this.totalItems / this.pageSize));
          this.loading = false;
        },
        error: () => this.loading = false
      });
  }

  applyFilters() {
    this.page = 1;
    this.load();
  }

  resetFilters() {
    this.filter = {
      year: null,
      month: null,
      search: '',
      status: '',
      projectId: null
    };
    this.page = 1;
    this.load();
  }

  // =========================
  // STATUS HELPERS (FIX)
  // =========================
  formatStatus(status: string): string {
    if (status === 'InProgress') return 'In Progress';
    return status;
  }

  statusClass(status: string): string {
    if (status === 'InProgress') return 'in-progress';
    if (status === 'Completed') return 'completed';
    return '';
  }

  // =========================
  // ACTIONS
  // =========================
  view(id: number) {
    this.router.navigate(['/timesheet/view', id]);
  }

  delete(id: number) {
    Swal.fire({
      title: 'Delete Timesheet?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes'
    }).then(r => {
      if (r.isConfirmed) {
        this.service.delete(id).subscribe(() => {
          Swal.fire('Deleted', 'Record removed', 'success');
          this.load();
        });
      }
    });
  }

  changePage(p: number) {
    if (p < 1 || p > this.totalPages) return;
    this.page = p;
    this.load();
  }
  hasanyActionPermission(): boolean {
  return this.permissionService.has('timesheet.view.all') ||
         this.permissionService.has('timesheet.delete');
        
  }
}
