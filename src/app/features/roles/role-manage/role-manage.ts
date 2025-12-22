import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
    imports: [CommonModule], 
  selector: 'app-role-manage',
  templateUrl: './role-manage.html',
  styleUrl:'./role-manage.css'
})
export class RoleManageComponent implements OnInit {

  roleId!: number;
  roleName = '';
  allPermissions: any[] = [];
  selectedPermissions: number[] = [];

  constructor(private route: ActivatedRoute,private http: HttpClient,private router: Router) {}

  ngOnInit() {
    debugger;
    this.roleId = Number(this.route.snapshot.paramMap.get('id'));

    // Load all permissions
    this.http.get<any[]>('http://localhost:5093/api/roles/permissions')
      .subscribe(res => this.allPermissions = res);

    // Load role's selected permissions
    this.http.get<any[]>(`http://localhost:5093/api/roles/${this.roleId}/permissions`)
      .subscribe(res => {
        this.selectedPermissions = res.map(x => x.id);
      });
  }

  toggle(id: number) {
    if (this.selectedPermissions.includes(id)) {
      this.selectedPermissions = this.selectedPermissions.filter(x => x !== id);
    } else {
      this.selectedPermissions.push(id);
    }
  }

  save() {

  const body = {
    roleId: this.roleId,
    permissionIds: this.selectedPermissions,
  };

  this.http.post('http://localhost:5093/api/roles/assign-permissions', body)
    .subscribe({

      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Permissions saved successfully!',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/roles']);
        });
      },

      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: 'Something went wrong!'
        });
      }
    });
}

}
