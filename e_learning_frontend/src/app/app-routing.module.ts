import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './components/auth/auth.guard';
import { CourseComponent } from './components/course/course.component';
import { CategoryComponent } from './components/category/category.component';

import { CreateExamComponent } from './components/create-exam/create-exam.component';
import { CreateQuestionTypeComponent } from './components/create-question-type/create-question-type.component';
import { CreateAnswerOptionComponent } from './components/create-answer-option/create-answer-option.component';
import { AnswerFormComponent } from './components/answer-form/answer-form.component';
import { CreateQuestionFormComponent } from './components/create-question-form/create-question-form.component';

import { BlogsComponent } from './components/home/blogs/blogs.component';
import { ChatComponent } from './components/chat/chat.component';



const routes: Routes = [
  {path:'', redirectTo:'/login',pathMatch:'full'},
   {path:'login', component: LoginComponent},
   {path:'course', component: CourseComponent},
   {path:'category', component: CategoryComponent},
   { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },

   {path:'exam', component: CreateExamComponent},
   {path:'questionType', component: CreateQuestionTypeComponent},
   {path:'answerOption', component: CreateAnswerOptionComponent},
   {path:'createquestionform' , component: CreateQuestionFormComponent},
   {path:'answerform' , component: AnswerFormComponent},

   {path:'blog', component: BlogsComponent},


   {path:'chat', component: ChatComponent},
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
