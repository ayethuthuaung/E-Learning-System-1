import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminModuleExamComponent } from './admin-module-exam.component';

describe('AdminModuleExamComponent', () => {
  let component: AdminModuleExamComponent;
  let fixture: ComponentFixture<AdminModuleExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminModuleExamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminModuleExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
