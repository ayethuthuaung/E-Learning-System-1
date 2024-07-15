import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Import all your components
import { AppComponent } from './app.component';
import { LoginComponent } from './components/auth/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ForgetPasswordComponent } from './components/auth/forget-password/forget-password.component';




import { QuestionService } from './components/services/question.service';
import { AnswerOptionService } from './components/services/answerOption.service';


import { HeroComponent } from './components/home/hero/hero.component';
import { CoursesComponent } from './components/home/courses/courses.component';
import { JointUsComponent } from './components/home/joint-us/joint-us.component';
import { HowItWorkComponent } from './components/home/how-it-work/how-it-work.component';
import { AppStoreComponent } from './components/home/app-store/app-store.component';
import { FeedbacksComponent } from './components/home/feedbacks/feedbacks.component';
import { ClientsComponent } from './components/home/clients/clients.component';
import { BlogsComponent } from './components/home/blogs/blogs.component';
import { AuthLinksComponent } from './components/shared/auth-links/auth-links.component';
import { ButtonComponent } from './components/shared/button/button.component';
import { CardComponent } from './components/shared/card/card.component';
import { EmailComponent } from './components/shared/email/email.component';
import { FeedbackCardComponent } from './components/shared/feedback-card/feedback-card.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { HeadingComponent } from './components/shared/heading/heading.component';
import { MenuComponent } from './components/shared/menu/menu.component';
import { PhoneComponent } from './components/shared/phone/phone.component';
import { RatingComponent } from './components/shared/rating/rating.component';
import { SliderComponent } from './components/shared/slider/slider.component';
import { SocialLinksComponent } from './components/shared/social-links/social-links.component';
import { SubscribeFormComponent } from './components/shared/subscribe-form/subscribe-form.component';
import { SubscribeFormReactiveComponent } from './components/shared/subscribe-form-reactive/subscribe-form-reactive.component';
import { VideoPopupComponent } from './components/shared/video-popup/video-popup.component';
import { CourseFooterComponent } from './components/shared/card/course-footer/course-footer.component';
import { BlogFooterComponent } from './components/shared/card/blog-footer/blog-footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ChatComponent } from './components/chat/chat.component';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { WebSocketService } from './components/services/websocket.service';

import { NotificationComponent } from './components/notification/notification.component';
import { CourseListComponent } from './components/course-list/course-list.component';

import { CourseDetailsComponent } from './components/course-details/course-details.component';
import { ConservationListComponent } from './components/instructor/instructor-conservation-list/conservation-list.component';

import { InstructorComponent } from './components/instructor/instructor.component';
import { NavProfileComponent } from './components/home/nav-profile/nav-profile.component';
import { InstructorDashboardComponent } from './components/instructor/instructor-dashboard/instructor-dashboard.component';
import { InstructorCourseComponent } from './components/instructor/instructor-course/instructor-course.component';
import { InstructorNavbarComponent } from './components/instructor/instructor-navbar/instructor-navbar.component';
import { InstructorSidebarComponent } from './components/instructor/instructor-sidebar/instructor-sidebar.component';
import { InstructorCategoryComponent } from './components/instructor/instructor-category/instructor-category.component';
import { AdminComponent } from './components/admin/admin.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminNavbarComponent } from './components/admin/admin-navbar/admin-navbar.component';
import { AdminSidebarComponent } from './components/admin/admin-sidebar/admin-sidebar.component';
import { AdminChartComponent } from './components/admin/admin-chart/admin-chart.component';




import { StudentProfileComponent } from './components/student/student-profile/student-profile.component';




import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { UserUploadComponent } from './components/user-upload/user-upload.component';

import { AnswerFormComponent } from './components/quiz-Ans/answer-form/answer-form.component';
import { CreateAnswerOptionComponent } from './components/quiz-Ans/create-answer-option/create-answer-option.component';
import { CreateQuestionFormComponent } from './components/quiz-Ans/create-question-form/create-question-form.component';
import { CreateQuestionTypeComponent } from './components/quiz-Ans/create-question-type/create-question-type.component';
import { AuthComponent } from './components/auth/auth.component';

import { AdminCourseComponent } from './components/admin/admin-course/admin-course.component';
import { AdminCategoryComponent } from './components/admin/admin-category/admin-category.component';
import { AdminCourseListComponent } from './components/admin/admin-course-list/admin-course-list.component';


import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FilterDataPipe} from './components/filter-data.pipe';

import { ExamDetailComponent } from './components/quiz-Ans/exam-details/exam-details.component';
import { QuizExamListComponent } from './components/quiz-Ans/exam-list/exam-list.component';
import { InstructorLessonComponent } from './components/instructor/instructor-lesson/instructor-lesson.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { CourseVideoViewComponent } from './components/course-video-view/course-video-view.component';
import { InstructorStudentComponent } from './components/instructor/instructor-student/instructor-student.component';

const config: SocketIoConfig = { url: 'http://localhost:8080/chat-socket', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    HomeComponent,

    CreateQuestionTypeComponent,
    CreateAnswerOptionComponent,
    CreateQuestionFormComponent,
    CreateQuestionFormComponent,
    AnswerFormComponent,

    ForgetPasswordComponent,




        HomeComponent,

        CreateQuestionTypeComponent,
        CreateAnswerOptionComponent,
        CreateQuestionFormComponent,
        CreateQuestionFormComponent,
        AnswerFormComponent,
        ExamDetailComponent,
    ExamDetailComponent,
    ForgetPasswordComponent,
    
    ChatComponent,
    HeroComponent,
    ChatComponent,
    HeroComponent,
    CoursesComponent,
    JointUsComponent,
    HowItWorkComponent,
    AppStoreComponent,
    FeedbacksComponent,
    ClientsComponent,
    BlogsComponent,
    AuthLinksComponent,
    ButtonComponent,
    CardComponent,
    BlogFooterComponent,
    CourseFooterComponent,
    EmailComponent,
    FeedbackCardComponent,
    FooterComponent,
    HeadingComponent,
    MenuComponent,
    PhoneComponent,
    RatingComponent,
    SliderComponent,
    SocialLinksComponent,
    SubscribeFormComponent,
    SubscribeFormReactiveComponent,
    VideoPopupComponent,
    NavbarComponent,
    HomeComponent,


    CourseListComponent,
    HomeComponent,
    StudentProfileComponent,

    CourseDetailsComponent,
    UserUploadComponent,
    InstructorComponent,
    NavProfileComponent,
    InstructorDashboardComponent,
    InstructorCourseComponent,
    InstructorNavbarComponent,
    InstructorSidebarComponent,
    InstructorCategoryComponent,
 
    CourseDetailsComponent,
  
    // instructor
    AdminComponent,
    AdminDashboardComponent,
    AdminNavbarComponent,
    AdminSidebarComponent,
    AdminChartComponent,
    HomeComponent,
    CourseDetailsComponent,
    UserUploadComponent,
    SubscribeFormComponent,
    AdminCourseComponent,
    AdminCategoryComponent,
    AdminCourseListComponent,
    FilterDataPipe,

    HomeComponent,
    ChatComponent,
    NotificationComponent,
    CourseDetailsComponent,
    UserUploadComponent,
    QuizExamListComponent,
    ConservationListComponent,
    UserUploadComponent,   
    InstructorLessonComponent,
    CourseVideoViewComponent,
    InstructorStudentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    
    BrowserAnimationsModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,


    SocketIoModule.forRoot(config)
  ],
  providers: [
    provideClientHydration(),

    QuestionService,
    AnswerOptionService,

    WebSocketService,
      provideAnimationsAsync()

  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
