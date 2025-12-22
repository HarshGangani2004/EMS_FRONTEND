import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private auth: AuthService, private router: Router) {}

  onLogin(form: NgForm) {
    if (form.invalid) {
      this.errorMessage = 'Please enter valid details.';
      return;
    }
    
    this.auth.login({ email: this.email.trim(), password: this.password }).subscribe({
      next: (res) => {

        // SAVE TOKEN + USER
        this.auth.saveToken(res.token);
        this.auth.saveUserFromToken(res.token);

        // LOAD PERMISSIONS → THEN SUCCESS POPUP
        this.auth.loadPermissions(() => {

          Swal.fire({
            icon: "success",
            title: "Login Successful!",
            text: "Welcome back!",
            showConfirmButton: false,
            timer: 1500
          });

          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1500);

        });
      },

      error: (err) => {
        this.errorMessage = err.error?.message || 'Invalid Credentials';
      }
    });
  }
}
