import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SkillsService } from '../../services/skills.service';
import { HasPermissionDirective } from '../../../../shared/directives/has-permission.directive';
import { PermissionService } from '../../../../core/services/permission.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-skill-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HasPermissionDirective],
  templateUrl: './skill-list.html',
  styleUrls: ['./skill-list.css']
})
export class SkillListComponent implements OnInit {

  skills: any[] = [];

  searchText = "";
  loading = true;

  // Backend pagination
  page = 1;
  pageSize = 10;

  totalItems = 0;
  totalPages = 0;

  constructor(
    private service: SkillsService,
    private router: Router,
    private permissionService: PermissionService 
  ) {}

  ngOnInit() {
    this.getSkills();
  }

  // 🔹 Load paged skills from backend
  getSkills() {
    this.loading = true;

    this.service.getPaged(this.page, this.pageSize, this.searchText).subscribe((res: any) => {
      this.skills = res.items;
      this.totalItems = res.totalItems;
      this.totalPages = res.totalPages;
      this.loading = false;
    });
  }

  // 🔍 Search
  filterSkills() {
    this.page = 1;
    this.getSkills();
  }

  // ➕ Create Skill
  create() {
    this.router.navigate(['/skills/create']);
  }

  // ✏ Edit
  edit(id: number) {
    this.router.navigate(['/skills/edit', id]);
  }
  
  hasAnyActionPermission(): boolean {
    return this.permissionService.has('skill.edit') ||
           this.permissionService.has('skill.delete');
  }

  // 🗑 Delete
  delete(id: number) {

  Swal.fire({
    title: 'Delete Skill?',
    text: 'Are you sure you want to delete this skill?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#374151',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, Delete'
  }).then((result) => {

    if (!result.isConfirmed) return;  // <--- exit safely

    this.service.delete(id).subscribe({

      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Skill deleted successfully.',
          confirmButtonColor: '#374151',
          timer: 1500
        });

        this.getSkills();
      },

      // ⭐ IMPORTANT: shows backend error message
      error: (err) => {
        Swal.fire({
          icon: "error",
          title: "Cannot delete",
          text: err.error?.message || "Something went wrong",
        });
      }

    });

  });

}


  // Pagination click
  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.getSkills();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.getSkills();
    }
  }
  get isAdmin(): boolean {
  return this.permissionService.has('admin');
}

}
