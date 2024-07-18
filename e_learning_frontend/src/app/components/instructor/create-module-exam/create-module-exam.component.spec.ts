import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateModuleExamComponent } from './create-module-exam.component';

describe('CreateModuleExamComponent', () => {
  let component: CreateModuleExamComponent;
  let fixture: ComponentFixture<CreateModuleExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateModuleExamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateModuleExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
