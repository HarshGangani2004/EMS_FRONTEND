import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../services/employee.service';
import { ApiService } from '../../../../core/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-edit.html',
  styleUrls: ['./employee-edit.css']
})
export class EmployeeEditComponent implements OnInit {

  id!: number;
  today = new Date().toISOString().split("T")[0];

  skillsTouched: boolean = false;

  model = {
    fullName: '',
    email: '',
    salary: 0,
    joinedOn: '',
    departmentId: '',
    skillIds: [] as number[]
  };

  departments: any[] = [];
  skills: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private service: EmployeeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get("id"));
    this.loadDepartments();
    this.loadSkills();
    this.loadEmployee();
  }

  loadEmployee() {
    this.service.getById(this.id).subscribe((res: any) => {
      this.model = {
        fullName: res.fullName,
        email: res.email,
        salary: res.salary,
        joinedOn: res.joinedOn.split("T")[0],
        departmentId: res.departmentId,
        skillIds: res.skillIds || []
      };
    });
  }

  loadDepartments() {
    this.api.get("departments").subscribe((res: any) => {
      this.departments = res.items ?? res;
    });
  }

  loadSkills() {
    this.api.get("skills").subscribe((res: any) => {
      this.skills = res.items ?? res;
    });
  }

  toggleSkill(skillId: number, event: any) {
    this.skillsTouched = true;

    if (event.target.checked) {
      if (!this.model.skillIds.includes(skillId)) {
        this.model.skillIds = [...this.model.skillIds, skillId];
      }
    } else {
      this.model.skillIds = this.model.skillIds.filter(x => x !== skillId);
    }
  }

  update(form: NgForm) {

    // trim inputs
    this.model.fullName = this.model.fullName.trim();
    this.model.email = this.model.email.trim();

    // show UI errors
    form.control.markAllAsTouched();

    // angular
    if (form.invalid) return;

    // full name length
    if (this.model.fullName.length < 3 || this.model.fullName.length > 30)
      return;

    // email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.model.email)) return;

    // salary
    if (this.model.salary < 1) return;

    // joined date
    if (this.model.joinedOn > this.today) return;

    // skills
    if (this.model.skillIds.length === 0) {
      this.skillsTouched = true;
      return;
    }

    // success
    this.service.update(this.id, this.model).subscribe({

      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Employee Updated!',
          showConfirmButton: false,
          timer: 1500
        });

        this.router.navigate(['/employees']);
      }
    });
  }

}
