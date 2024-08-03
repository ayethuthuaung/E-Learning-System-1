import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewQuestionFormComponent } from './view-question-form.component';

describe('ViewQuestionFormComponent', () => {
  let component: ViewQuestionFormComponent;
  let fixture: ComponentFixture<ViewQuestionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewQuestionFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewQuestionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
