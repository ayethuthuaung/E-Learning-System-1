import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentQuestionFormComponent } from './student-question-form.component';

describe('StudentQuestionFormComponent', () => {
  let component: StudentQuestionFormComponent;
  let fixture: ComponentFixture<StudentQuestionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentQuestionFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentQuestionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
