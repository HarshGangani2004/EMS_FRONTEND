import { Component } from '@angular/core';
import { routes } from '../app.routes';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-forbidden',
  imports: [RouterModule],
  templateUrl: './forbidden.html',
  styleUrl: './forbidden.css',
})
export class Forbidden {

}
