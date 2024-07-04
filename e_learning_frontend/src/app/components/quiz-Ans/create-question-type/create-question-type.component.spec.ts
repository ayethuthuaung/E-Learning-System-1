import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateQuestionTypeComponent } from './create-question-type.component';

describe('CreateQuestionTypeComponent', () => {
  let component: CreateQuestionTypeComponent;
  let fixture: ComponentFixture<CreateQuestionTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateQuestionTypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateQuestionTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
