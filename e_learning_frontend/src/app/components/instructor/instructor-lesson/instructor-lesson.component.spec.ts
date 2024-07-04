import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorLessonComponent } from './instructor-lesson.component';

describe('InstructorLessonComponent', () => {
  let component: InstructorLessonComponent;
  let fixture: ComponentFixture<InstructorLessonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InstructorLessonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InstructorLessonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
