import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';

@Component({
  standalone: true,
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  
  user: any = {};

  constructor(private api: ApiService) {}

  ngOnInit() {
  const localUser = localStorage.getItem("user");

  console.log("LOCAL USER:", localUser);  // ⭐ CHECKING

  if (!localUser) {
    console.error("NO USER FOUND IN STORAGE");
    return;
  }

  const email = JSON.parse(localUser).email;

  this.api.get(`Admin/user?email=${email}`).subscribe((res: any) => {
    this.user = res;
  });
}

}
