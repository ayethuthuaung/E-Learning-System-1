import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Import all your components
import { AppComponent } from './app.component';
import { LoginComponent } from './components/auth/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ForgetPasswordComponent } from './components/auth/forget-password/forget-password.component';
import { CourseComponent } from './components/course/course.component';
import { CategoryComponent } from './components/category/category.component';
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
import { UserUploadComponent } from './components/user-upload/user-upload.component';
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

const config: SocketIoConfig = { url: 'http://localhost:8080/chat-socket', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    ForgetPasswordComponent,
    CourseComponent,
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
    UserUploadComponent,
    InstructorComponent,
    NavProfileComponent,
    InstructorDashboardComponent,
    InstructorCourseComponent,
    InstructorNavbarComponent,
    InstructorSidebarComponent,
    InstructorCategoryComponent,
    AdminComponent,
    AdminDashboardComponent,
    AdminNavbarComponent,
    AdminSidebarComponent,
    AdminChartComponent,
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
    WebSocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
