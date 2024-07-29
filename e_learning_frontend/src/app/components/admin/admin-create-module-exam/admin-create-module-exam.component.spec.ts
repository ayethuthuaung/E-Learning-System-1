import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCreateModuleExamComponent } from './admin-create-module-exam.component';

describe('AdminCreateModuleExamComponent', () => {
  let component: AdminCreateModuleExamComponent;
  let fixture: ComponentFixture<AdminCreateModuleExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminCreateModuleExamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCreateModuleExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
