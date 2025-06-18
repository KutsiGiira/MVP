import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {jwtDecode} from 'jwt-decode';

interface MyJwtPayload {
  sub: string;
  roles: string[];
  iat: number;
  exp: number;
}
@Component({
  selector: 'app-admin-page',
  standalone: true,
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css'],
})
export class AdminPageComponent {
  constructor(private router: Router) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (!token || this.isTokenExpired(token)) {
      this.logout();
    }
  }
  logout() {
    localStorage.removeItem('token'); 
    this.router.navigate(['/']); 
  }
    isTokenExpired(token: string): boolean {
      try {
        const decoded = jwtDecode<MyJwtPayload>(token);
        if (!decoded.exp) {
          console.log("Session expired or no expiration in token");
          return true;
        }
        const expired = decoded.exp * 1000;
        if (Date.now() > expired) {
          console.log('Token expired');
          return true;
        }
        console.log('Token valid until:', new Date(expired).toLocaleString());
        return false;
      } catch (error) {
        return true;
      }
    }
}
