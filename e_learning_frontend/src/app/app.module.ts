import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LoginComponent } from './components/auth/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { CourseComponent } from './components/course/course.component';
import { CategoryComponent } from './components/category/category.component';

import { CreateExamComponent } from './components/create-exam/create-exam.component';
import { CreateQuestionTypeComponent } from './components/create-question-type/create-question-type.component';
import { CreateAnswerOptionComponent } from './components/create-answer-option/create-answer-option.component';
import { QuestionService } from './components/services/question.service';
import { AnswerOptionService } from './components/services/answerOption.service';
import { AnswerFormComponent } from './components/answer-form/answer-form.component';
import { CreateQuestionFormComponent } from './components/create-question-form/create-question-form.component';

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
const config: SocketIoConfig = { url: 'http://localhost:8080/chat-socket', options: {} };


@NgModule({
  declarations: [
    AppComponent,
  CourseComponent,
  CategoryComponent,
    LoginComponent,
        HomeComponent,

        CreateExamComponent,
        CreateQuestionTypeComponent,
        CreateAnswerOptionComponent,
        CreateQuestionFormComponent,
        AnswerFormComponent,
        CreateQuestionFormComponent,


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
