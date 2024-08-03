import { ComponentFixture, TestBed } from '@angular/core/testing';

<<<<<<<< HEAD:e_learning_frontend/src/app/components/student/student-profile/student-profile.component.spec.ts
import { StudentProfileComponent } from './student-profile.component';

describe('StudentProfileComponent', () => {
  let component: StudentProfileComponent;
  let fixture: ComponentFixture<StudentProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentProfileComponent);
========
import { AnswerFormComponent } from './answer-form.component';

describe('AnswerFormComponent', () => {
  let component: AnswerFormComponent;
  let fixture: ComponentFixture<AnswerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnswerFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnswerFormComponent);
>>>>>>>> ffe639a4b86f3c37da9466ebf3508ebc5d18db7e:e_learning_frontend/src/app/components/quiz-Ans/answer-form/answer-form.component.spec.ts
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
