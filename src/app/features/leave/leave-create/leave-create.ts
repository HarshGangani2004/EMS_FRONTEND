import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LeaveService } from '../leave.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-leave-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './leave-create.html',
  styleUrls: ['./leave-create.css']
})
export class LeaveCreateComponent {

  model = {
    leaveType: '',
    fromDate: '',
    toDate: '',
    reason: ''
  };

  saving = false;

  constructor(
    private leaveService: LeaveService,
    private router: Router
  ) {}

  // ✅ Date validation (From <= To)
  isDateValid(): boolean {
    if (!this.model.fromDate || !this.model.toDate) return true;
    return this.model.fromDate <= this.model.toDate;
  }

  // ✅ Submit
  save(form: NgForm): void {

  // ❌ Form validation
  if (form.invalid || !this.isDateValid()) {
    Object.values(form.controls).forEach(control =>
      control.markAsTouched()
    );

    Swal.fire({
      icon: 'warning',
      title: 'Invalid Form',
      text: 'Please fill all required fields correctly.'
    });

    return;
  }

  this.saving = true;

  this.leaveService.applyLeave(this.model).subscribe({

    // ✅ SUCCESS
    next: () => {

      Swal.fire({
        icon: 'success',
        title: 'Leave Applied',
        text: 'Your leave request has been submitted successfully.',
        timer: 1800,
        showConfirmButton: false
      }).then(() => {
        this.router.navigate(['/leave/my']);
      });

    },

    // ❌ ERROR
    error: (err) => {
      this.saving = false;

      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: err.error?.message ?? 'Unable to apply leave. Please try again.'
      });
    }

  });
}

}
