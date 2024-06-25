import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAnswerOptionComponent } from './create-answer-option.component';

describe('CreateAnswerOptionComponent', () => {
  let component: CreateAnswerOptionComponent;
  let fixture: ComponentFixture<CreateAnswerOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateAnswerOptionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateAnswerOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
