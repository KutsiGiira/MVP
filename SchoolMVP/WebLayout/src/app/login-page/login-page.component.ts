import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms'
import { HttpClientModule, HttpClient } from '@angular/common/http';

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
  constructor(private fb : FormBuilder,  private http: HttpClient){
    this.createForm();
  }
  createForm() {
    this.form = this.fb.group({
    username: ['',[Validators.required]],
    password: ['',[Validators.required]],
    })
  }
  submitHandle(){
    if(this.form.valid){
      const data = this.form.value;
      console.log(this.form.value);
      this.errorText= '';
      this.http.post('http://localhost:8080/login', data, {
        responseType: 'text'
      })
      .subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          this.errorText = '';
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.errorText = 'Invalid username or password';
        }
      });
    }
    else{
      this.errorText= "invalide cred";
    }
  }
}