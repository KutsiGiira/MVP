import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {jwtDecode, JwtPayload} from 'jwt-decode';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

 interface MyJwtPayload {
  sub: string;
  roles: string[];
  iat: number;
  exp: number;
}

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
  ],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})

export class LoginPageComponent {
  
  form!: FormGroup;
  text:string = '';
  username:string = '';
  password:string = '';
  errorText:string = '';
  constructor(private fb : FormBuilder,  private http: HttpClient,  private router: Router){
    this.createForm();
  }
  createForm() {
    this.form = this.fb.group({
    username: ['',[Validators.required]],
    password: ['',[Validators.required  ]],
    })
  }
  submitHandle(){
    if(this.form.valid){
      const data = this.form.value;
      this.errorText= '';
      this.http.post('http://localhost:8080/login', data, {
        responseType: 'text'
      })
      .subscribe({
        next: (response) => {
          console.log('Login successful:', response);
           const decoded = jwtDecode<MyJwtPayload>(response);
          console.log('Decoded token:', decoded);

          localStorage.setItem('token', response);
          console.log('Role:', decoded.roles);
          console.log(decoded.exp);
          const roles = decoded.sub;
          if (roles.includes('admin')) {
          this.router.navigate(['/admin']);
        } 
        else if (roles.includes('teacher')) {
          this.router.navigate(['/teacher']);
        } 
        else if (roles.includes('parent')) {
          this.router.navigate(['/parent']);
        } 
        else {
          this.errorText = 'Unknown role';
          console.log("eror");
        }
        this.errorText = '';
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.errorText = 'Nom d’utilisateur ou mot de passe incorrect. Veuillez réessayer."';
        }
      });
    }
    else{
      this.errorText= "Nom d’utilisateur ou mot de passe incorrect. Veuillez réessayer.";
    }
  }
}