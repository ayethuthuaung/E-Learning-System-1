import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './components/auth/auth.guard';
import { CourseComponent } from './components/course/course.component';
import { CategoryComponent } from './components/category/category.component';
import { BlogsComponent } from './components/home/blogs/blogs.component';
import { ChatComponent } from './components/chat/chat.component';


const routes: Routes = [
  {path:'', redirectTo:'/login',pathMatch:'full'},
   {path:'login', component: LoginComponent},
   {path:'course', component: CourseComponent},
   {path:'category', component: CategoryComponent},
   { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
   {path:'blog', component: BlogsComponent},

   {path:'chat', component: ChatComponent},
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
