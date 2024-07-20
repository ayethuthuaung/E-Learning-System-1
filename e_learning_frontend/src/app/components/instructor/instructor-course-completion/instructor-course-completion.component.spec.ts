import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorCourseCompletionComponent } from './instructor-course-completion.component';

describe('InstructorCourseCompletionComponent', () => {
  let component: InstructorCourseCompletionComponent;
  let fixture: ComponentFixture<InstructorCourseCompletionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InstructorCourseCompletionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructorCourseCompletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
