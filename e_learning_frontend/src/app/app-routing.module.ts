import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './components/auth/auth.guard';

import { CategoryComponent } from './components/category/category.component';


import { ForgetPasswordComponent } from './components/auth/forget-password/forget-password.component';
import { BlogsComponent } from './components/home/blogs/blogs.component';
import { ChatComponent } from './components/chat/chat.component';

import { NotificationComponent } from './components/notification/notification.component';

import { UpdateCourseComponent } from './components/update-course/update-course.component';
import { UpdateCategoryComponent } from './components/update-category/update-category.component';
import { CourseListComponent } from './components/course-list/course-list.component';
import { CategoryListComponent } from './components/category-list/category-list.component';

import { UserUploadComponent } from './components/user-upload/user-upload.component';

import { ConservationListComponent } from './components/conservation-list/conservation-list.component';

 
 
import { InstructorProfileComponent } from './components/instructor/instructor-profile/instructor-profile.component';
import { InstructorDashboardComponent } from './components/instructor/instructor-dashboard/instructor-dashboard.component';
import { InstructorCourseComponent } from './components/instructor/instructor-course/instructor-course.component';
import { InstructorCategoryComponent } from './components/instructor/instructor-category/instructor-category.component';

import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';

import { CreateExamComponent } from './components/quiz-Ans/create-exam/create-exam.component';
import { CreateAnswerOptionComponent } from './components/quiz-Ans/create-answer-option/create-answer-option.component';
import { CreateQuestionTypeComponent } from './components/quiz-Ans/create-question-type/create-question-type.component';
import { CreateQuestionFormComponent } from './components/quiz-Ans/create-question-form/create-question-form.component';
import { AnswerFormComponent } from './components/quiz-Ans/answer-form/answer-form.component';
import { SubmitFormComponent } from './components/quiz-Ans/submit-form/submit-form.component';
import { CourseDetailsComponent } from './components/course-details/course-details.component';
import { AdminCourseComponent } from './components/admin/admin-course/admin-course.component';
import { AdminCategoryComponent } from './components/admin/admin-category/admin-category.component';

import { InstructorLessonComponent } from './components/instructor/instructor-lesson/instructor-lesson.component';



const routes: Routes = [
  {path:'', redirectTo:'/login',pathMatch:'full'},
   {path:'login', component: LoginComponent},
   {path: 'forget-password', component: ForgetPasswordComponent },
   {path:'category', component: CategoryComponent},
   { path: 'course/:courseId/update', component: UpdateCourseComponent},
   {path:'category/:categoryId/update', component: UpdateCategoryComponent},
   {path:'courses', component: CourseListComponent},
   {path:'categories', component: CategoryListComponent},
   
   { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },

   { path: 'conservation-list', component: ConservationListComponent },
   { path: 'notification', component: NotificationComponent },

   {path:'blog', component: BlogsComponent},

   //{ path: 'chat/:chatRoomId/:userName', component: ChatComponent },


   {path:'exam', component: CreateExamComponent},
   {path:'questionType', component: CreateQuestionTypeComponent},
   {path:'answerOption', component: CreateAnswerOptionComponent},
   {path:'createquestionform' , component: CreateQuestionFormComponent},
   {path:'answerform' , component: AnswerFormComponent},
   {path:'submitform' , component: SubmitFormComponent},

   {path:'blog', component: BlogsComponent},

   {path:'chat', component: ChatComponent},

   { path: 'chat/:chatRoomId', component: ChatComponent },

   {path:'instructor/profile', component: InstructorProfileComponent},
   {path:'instructor/dashboard', component: InstructorDashboardComponent},
   {path:'instructor/course', component: InstructorCourseComponent},
   {path:'instructor/category', component: InstructorCategoryComponent},

   {path:'admin/dashboard', component: AdminDashboardComponent},
   {path:'admin/upload-user-data', component: UserUploadComponent },
   {path:'admin/course', component: AdminCourseComponent},
   {path:'admin/category', component: AdminCategoryComponent},

   {path:'course-detail/:courseId', component: CourseDetailsComponent},
   {path:'instructor/lesson/:courseId', component: InstructorLessonComponent},

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
