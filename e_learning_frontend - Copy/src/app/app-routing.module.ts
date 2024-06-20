import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './components/auth/auth.guard';
import { CourseComponent } from './components/course/course.component';
import { CategoryComponent } from './components/category/category.component';

import { BlogsComponent } from './components/home/blogs/blogs.component';
import { ChatComponent } from './components/chat/chat.component';

import { UpdateCourseComponent } from './components/update-course/update-course.component';
import { UpdateCategoryComponent } from './components/update-category/update-category.component';
import { CourseListComponent } from './components/course-list/course-list.component';
import { CategoryListComponent } from './components/category-list/category-list.component';


const routes: Routes = [
  {path:'', redirectTo:'/login',pathMatch:'full'},
   {path:'login', component: LoginComponent},
   {path:'course', component: CourseComponent},
   {path:'category', component: CategoryComponent},
   { path: 'course/:courseId/update', component: UpdateCourseComponent},
   {path:'category/:categoryId/update', component: UpdateCategoryComponent},
   {path:'courses', component: CourseListComponent},
   {path:'categories', component: CategoryListComponent},
   
   { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
   {path:'blog', component: BlogsComponent},

   {path:'chat', component: ChatComponent},
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
