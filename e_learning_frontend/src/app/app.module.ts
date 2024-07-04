import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { LoginComponent } from './components/auth/login/login.component';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './components/home/home.component';

import { ForgetPasswordComponent } from './components/auth/forget-password/forget-password.component';
import { CategoryComponent } from './components/category/category.component';


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


import { UpdateCourseComponent } from './components/update-course/update-course.component';
import { CourseListComponent } from './components/course-list/course-list.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { UpdateCategoryComponent } from './components/update-category/update-category.component';
import { CourseDetailsComponent } from './components/course-details/course-details.component';

import { InstructorComponent } from './components/instructor/instructor.component';
import { NavProfileComponent } from './components/home/nav-profile/nav-profile.component';
import { InstructorDashboardComponent } from './components/instructor/instructor-dashboard/instructor-dashboard.component';
import { InstructorCourseComponent } from './components/instructor/instructor-course/instructor-course.component';
import { InstructorNavbarComponent } from './components/instructor/instructor-navbar/instructor-navbar.component';
import { InstructorSidebarComponent } from './components/instructor/instructor-sidebar/instructor-sidebar.component';
import { InstructorCategoryComponent } from './components/instructor/instructor-category/instructor-category.component';

import { UserUploadComponent } from './components/user-upload/user-upload.component';

import { AnswerFormComponent } from './components/quiz-Ans/answer-form/answer-form.component';
import { CreateAnswerOptionComponent } from './components/quiz-Ans/create-answer-option/create-answer-option.component';
import { CreateExamComponent } from './components/quiz-Ans/create-exam/create-exam.component';
import { CreateQuestionFormComponent } from './components/quiz-Ans/create-question-form/create-question-form.component';
import { CreateQuestionTypeComponent } from './components/quiz-Ans/create-question-type/create-question-type.component';
import { ExamDetailComponent } from './components/quiz-Ans/exam-details/exam-details.component';
import { QuizExamListComponent } from './components/quiz-Ans/exam-list/exam-list.component';



const config: SocketIoConfig = { url: 'http://localhost:8080/chat-socket', options: {} };


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,

        HomeComponent,

        CreateExamComponent,
        CreateQuestionTypeComponent,
        CreateAnswerOptionComponent,
        CreateQuestionFormComponent,
        CreateQuestionFormComponent,
        AnswerFormComponent,
        ExamDetailComponent,



    ForgetPasswordComponent,
 
    CategoryComponent,

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



    UpdateCourseComponent,
    CourseListComponent,
    CategoryListComponent,
    UpdateCategoryComponent,
    HomeComponent,
    CourseDetailsComponent,
    InstructorComponent,
    NavProfileComponent,
    // instructor
   
    InstructorDashboardComponent,
    InstructorCourseComponent,
    InstructorNavbarComponent,
    InstructorSidebarComponent,
    InstructorCategoryComponent,
  
    // instructor

        HomeComponent,
        CourseDetailsComponent,
 

        UserUploadComponent,

         QuizExamListComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    
    SocketIoModule.forRoot(config)
  ],



  providers: [
    provideClientHydration(),

    QuestionService,
    AnswerOptionService,

    WebSocketService

  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
