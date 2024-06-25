import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateQuestionFormComponent } from './create-question-form.component';

describe('CreateQuestionFormComponent', () => {
  let component: CreateQuestionFormComponent;
  let fixture: ComponentFixture<CreateQuestionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateQuestionFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateQuestionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
