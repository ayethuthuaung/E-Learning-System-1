import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './components/auth/auth.guard';

import { ForgetPasswordComponent } from './components/auth/forget-password/forget-password.component';
import { BlogsComponent } from './components/home/blogs/blogs.component';
import { ChatComponent } from './components/chat/chat.component';

import { StudentProfileComponent } from './components/student/student-profile/student-profile.component';
import { InstructorProfileComponent } from './components/instructor/instructor-profile/instructor-profile.component';
import { InstructorDashboardComponent } from './components/instructor/instructor-dashboard/instructor-dashboard.component';
import { InstructorCourseComponent } from './components/instructor/instructor-course/instructor-course.component';
import { InstructorCategoryComponent } from './components/instructor/instructor-category/instructor-category.component';
import { UserUploadComponent } from './components/user-upload/user-upload.component';
import { CourseDetailsComponent } from './components/course-details/course-details.component';
import { CourseListComponent } from './components/course-list/course-list.component';
const routes: Routes = [
  {path:'', redirectTo:'/login',pathMatch:'full'},
   {path:'login', component: LoginComponent},
   {path: 'forget-password', component: ForgetPasswordComponent },
   { path: 'student-profile', component: StudentProfileComponent },
   { path: 'course-details/:id', component: CourseDetailsComponent },
   { path: 'courses', component: CourseListComponent },
   { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
   {path:'blog', component: BlogsComponent},
   {path:'chat', component: ChatComponent},
   {path:'instructor/profile', component: InstructorProfileComponent},
   {path:'instructor/dashboard', component: InstructorDashboardComponent},
   {path:'instructor/course', component: InstructorCourseComponent},
   {path:'instructor/category', component: InstructorCategoryComponent},
   { path: 'user/upload-user-data', component: UserUploadComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
