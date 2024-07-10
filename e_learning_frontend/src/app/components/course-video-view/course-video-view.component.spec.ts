import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseVideoViewComponent } from './course-video-view.component';

describe('CourseVideoViewComponent', () => {
  let component: CourseVideoViewComponent;
  let fixture: ComponentFixture<CourseVideoViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CourseVideoViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseVideoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
