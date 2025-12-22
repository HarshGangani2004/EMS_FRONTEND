import { Component } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../services/employee.service';
import { ApiService } from '../../../../core/services/api.service';
import { Router } from '@angular/router';
import { HasPermissionDirective } from '../../../../shared/directives/has-permission.directive';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-employee-create',
  standalone: true,
  imports: [CommonModule, FormsModule, HasPermissionDirective],
  templateUrl: './employee-create.html',
  styleUrls: ['./employee-create.css']
})
export class EmployeeCreateComponent {

  departments: any[] = [];
  skills: any[] = [];
  error: string = "";
  nameMinLength = 3;
  today = new Date().toISOString().split('T')[0];
  skillsTouched: boolean = false;
  

  employee = {
    fullName: '',
    email: '',
    salary: 0,
    joinedOn: '',
    departmentId: 0,
    skillIds: [] as number[]
  };

  constructor(
    private empService: EmployeeService,
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadDepartments();
    this.loadSkills();
  }
  validateSkills() {
  this.skillsTouched = true;
}

  loadDepartments() {
    this.api.get('departments').subscribe((res: any) => {
      this.departments = res.items ?? res;
    });
  }

  loadSkills() {
    this.api.get('skills').subscribe((res: any) => {
      this.skills = res.items ?? res;
    });
  }

  toggleSkill(skillId: number, event: any) {

  this.skillsTouched = true;  // <<< ADD THIS LINE

  if (event.target.checked) {
    this.employee.skillIds.push(skillId);
  } else {
    this.employee.skillIds = this.employee.skillIds.filter(id => id !== skillId);
  }
}


  save(form: NgForm) {

  // FIX SPACE INPUTS
  this.employee.fullName = this.employee.fullName.trim();
  this.employee.email = this.employee.email.trim();

  // show all UI errors
  form.control.markAllAsTouched();

  // angular required + maxlength + pattern
  if (form.invalid) return;

  // full name length check
  if (this.employee.fullName.length < 3 || this.employee.fullName.length > 30)
    return;

  // EMAIL REGEX CHECK
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(this.employee.email)) return;


  // Salary
  if (this.employee.salary < 1) return;

  // Joined date
  if (this.employee.joinedOn > this.today) return;

  // Skills
  if (this.employee.skillIds.length === 0) {
    this.skillsTouched = true;
    return;
  }

  // SUCCESS
  this.empService.createEmployee(this.employee).subscribe({

   next: () => {
      Swal.fire({
        icon: "success",
        title: "Employee Created!",
        showConfirmButton: false,
        timer: 1500
      });

      this.router.navigate(['/employees']);
    },

    // ⛔ ONLY EMAIL EXISTS CHECK HERE
    error: (err) => {

  const msg = (
    err.error?.message ||
    err.error?.title ||
    err.error?.detail ||
    err.error ||
    ""
  )
  .toString()
  .toLowerCase();

  if (msg.includes("email") && msg.includes("exists")) {
    Swal.fire({
      icon: "error",
      title: "Email Already Exists",
      text: "This email is already registered!",
    });
    return;
  }

  Swal.fire({
    icon: "error",
    title: "Error",
    text: "Failed to create employee."
  });
}

    
  });
}


}
