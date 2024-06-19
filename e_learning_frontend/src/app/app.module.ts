import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LoginComponent } from './components/auth/login/login.component';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { CourseComponent } from './components/course/course.component';
import { CategoryComponent } from './components/category/category.component';
import { UpdateCourseComponent } from './components/update-course/update-course.component';
import { CourseListComponent } from './components/course-list/course-list.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { UpdateCategoryComponent } from './components/update-category/update-category.component';
import { CourseDetailsComponent } from './components/course-details/course-details.component';



@NgModule({
  declarations: [
    AppComponent,
  CourseComponent,
  CategoryComponent,
    LoginComponent,
    UpdateCourseComponent,
    CourseListComponent,
    CategoryListComponent,
    UpdateCategoryComponent,
        HomeComponent,
        CourseDetailsComponent,
       
        
        
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    

    
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
