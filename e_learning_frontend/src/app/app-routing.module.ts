import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './components/auth/auth.guard';



import { ForgetPasswordComponent } from './components/auth/forget-password/forget-password.component';
import { BlogsComponent } from './components/home/blogs/blogs.component';
import { ChatComponent } from './components/chat/chat.component';
import { StudentProfileComponent } from './components/student/student-profile/student-profile.component';


import { NotificationComponent } from './components/notification/notification.component';



import { UserUploadComponent } from './components/user-upload/user-upload.component';


import { ConservationListComponent } from './components/instructor/instructor-conservation-list/conservation-list.component';

import { InstructorProfileComponent } from './components/instructor/instructor-profile/instructor-profile.component';
import { InstructorDashboardComponent } from './components/instructor/instructor-dashboard/instructor-dashboard.component';
import { InstructorCourseComponent } from './components/instructor/instructor-course/instructor-course.component';
import { InstructorCategoryComponent } from './components/instructor/instructor-category/instructor-category.component';

import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';



import { CourseDetailsComponent } from './components/course-details/course-details.component';
import { AdminCourseComponent } from './components/admin/admin-course/admin-course.component';
import { AdminCategoryComponent } from './components/admin/admin-category/admin-category.component';

import { InstructorLessonComponent } from './components/instructor/instructor-lesson/instructor-lesson.component';
import { CourseVideoViewComponent } from './components/course-video-view/course-video-view.component';
import { AllCoursesComponent } from './components/all-courses/all-courses.component';
import { InstructorStudentComponent } from './components/instructor/instructor-student/instructor-student.component';
import { AdminLessonComponent } from './components/admin/admin-lesson/admin-lesson.component';
import { AdminStudentComponent } from './components/admin/admin-student/admin-student.component';
import { CreateModuleExamComponent } from './components/instructor/create-module-exam/create-module-exam.component';
import { StudentQuestionFormComponent } from './components/student/student-profile/student-question-form/student-question-form.component';
import { FooterComponent } from './components/shared/footer/footer.component';



const routes: Routes = [
  {path:'', redirectTo:'/login',pathMatch:'full'},
   {path:'login', component: LoginComponent},
   
   {path: 'forget-password', component: ForgetPasswordComponent },

   { path: 'student/profile', component: StudentProfileComponent },

  
   { path: 'home', component: HomeComponent},

   { path: 'instructor/conservation-list', component: ConservationListComponent },
   { path: 'notification', component: NotificationComponent },

   {path:'blog', component: BlogsComponent},

   //{ path: 'chat/:chatRoomId/:userName', component: ChatComponent },


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
   {path:'admin/lesson/:courseId', component: AdminLessonComponent},
   {path:'admin/student', component: AdminStudentComponent},


   {path:'course-detail/:id', component: CourseDetailsComponent},

   {path:'course-video-view/:moduleId', component: CourseVideoViewComponent},
   {path:'course-detail/:courseId', component: CourseDetailsComponent},
   {path:'instructor/lesson/:courseId', component: InstructorLessonComponent},
   {path:'instructor/student', component: InstructorStudentComponent},
   {path:'instructor/module-exam/:lessonId', component: CreateModuleExamComponent},

   {path:'question-form/:examId', component: StudentQuestionFormComponent},
   {path:'all-courses', component: AllCoursesComponent},

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
