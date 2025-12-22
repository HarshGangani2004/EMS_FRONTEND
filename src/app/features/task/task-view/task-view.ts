import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-task-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-view.html',
  styleUrl:'./task-view.css'
})
export class TaskViewComponent implements OnInit {

  id!: number;
  task: any = null;

  loading = true;

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadTask();
  }

  loadTask(): void {
    this.taskService.getById(this.id).subscribe({
      next: (res: any) => {
        this.task = res;
        this.loading = false;
      },
      error: () => {
        alert('Task not found');
        this.router.navigate(['/task/list']);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/task/list']);
  }

}
