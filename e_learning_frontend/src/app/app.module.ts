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

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    provideClientHydration(),
    QuestionService,AnswerOptionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
