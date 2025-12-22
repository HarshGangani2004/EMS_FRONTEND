import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LeaveService } from '../leave.service';

@Component({
  selector: 'app-leave-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './leave-view.html',
  styleUrls: ['./leave-view.css']
})
export class LeaveViewComponent implements OnInit {

  id!: number;
  loading = true;

  leave: any;

  constructor(
    private route: ActivatedRoute,
    private leaveService: LeaveService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadLeave();
  }

  loadLeave(): void {
    this.leaveService.getById(this.id).subscribe({
      next: (res) => {
        this.leave = res;
        this.loading = false;
      },
      error: () => {
        alert('Leave not found');
        this.router.navigate(['/leave/my']);
      }
    });
  }

  back(): void {
    this.router.navigate(['/leave/my']);
  }
}
