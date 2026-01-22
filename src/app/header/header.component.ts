import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../login/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(
    private router: Router,
    public authService: AuthService
  ) { }

  logout() {
    console.log('logout');

    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['']);
  }
}
