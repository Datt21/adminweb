import { Component, OnInit } from '@angular/core';
import { AuthQuery } from '../state/auth.query';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  token: string;
  constructor(private authQuery: AuthQuery, public router: Router) { }

  ngOnInit() {
    this.authQuery.select(state => state.token).subscribe((data) => {
      this.token = data;
    });
    if (!this.token) {
      this.router.navigate(['/login']);
    }
  }

}
