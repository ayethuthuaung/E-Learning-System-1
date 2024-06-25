import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorCategoryComponent } from './instructor-category.component';

describe('InstructorCategoryComponent', () => {
  let component: InstructorCategoryComponent;
  let fixture: ComponentFixture<InstructorCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InstructorCategoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InstructorCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
