import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCourseCompletionComponent } from './admin-course-completion.component';

describe('AdminCourseCompletionComponent', () => {
  let component: AdminCourseCompletionComponent;
  let fixture: ComponentFixture<AdminCourseCompletionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminCourseCompletionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCourseCompletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
