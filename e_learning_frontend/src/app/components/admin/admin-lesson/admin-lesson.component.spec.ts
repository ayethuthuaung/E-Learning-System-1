import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLessonComponent } from './admin-lesson.component';

describe('AdminLessonComponent', () => {
  let component: AdminLessonComponent;
  let fixture: ComponentFixture<AdminLessonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminLessonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminLessonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
