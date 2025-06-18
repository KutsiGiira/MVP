import { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { ParentPageComponent } from './parent-page/parent-page.component';
import { TeacherPageComponent } from './teacher-page/teacher-page.component';

export const routes: Routes = [
  { path: '', component: LoginPageComponent },
  { path: 'admin', component: AdminPageComponent },
  { path: 'parent', component: ParentPageComponent },
  { path: 'teacher', component: TeacherPageComponent },
  { path: '**', redirectTo: '' }
];