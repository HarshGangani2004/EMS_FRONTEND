import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { HasPermissionDirective } from '../../../../shared/directives/has-permission.directive';
import { PermissionService } from '../../../../core/services/permission.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, HasPermissionDirective, FormsModule],
  templateUrl: './employee-list.html',
  styleUrls: ['./employee-list.css']
})
export class EmployeeListComponent implements OnInit {

  employees: any[] = [];
  loading = true;
  Math = Math;

  searchText: string = "";
  page = 1;
  pageSize = 10;
  totalItems = 0;

  constructor(
    private service: EmployeeService,
    private router: Router,
    private permissionService: PermissionService   // ⭐ added
  ) {}

  ngOnInit(): void {
    this.permissionService.load().subscribe();     // ⭐ load permissions
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.service.getPaged(this.page, this.pageSize, this.searchText)
      .subscribe({
        next: (res: any) => {
          this.employees = res.items;
          this.totalItems = res.totalItems;
          this.loading = false;
        },
        error: () => { this.loading = false; }
      });
  }

  hasAnyActionPermission(): boolean {
    return this.permissionService.has('employee.edit') ||
           this.permissionService.has('employee.delete');
  }

  onSearch() {
    this.page = 1;
    this.loadData();
  }

  nextPage() {
    if (this.page * this.pageSize < this.totalItems) {
      this.page++;
      this.loadData();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadData();
    }
  }

  edit(id: number) {
    this.router.navigate(['/employees/edit', id]);
  }

  create() {
    this.router.navigate(['/employees/create']);
  }

  delete(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "This employee will be deleted permanently!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.delete(id).subscribe(() => {
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Employee has been removed.',
            timer: 1500,
            showConfirmButton: false
          });
          this.loadData();
        });
      }
    });
  }

  getSkillNames(skills: any[]) {
    return skills?.length ? skills.join(', ') : "No Skills";
  }
  get isAdmin(): boolean {
  return this.permissionService.has('admin');
}
get canViewSalary(): boolean {
  return this.permissionService.has('salary');
}



}
