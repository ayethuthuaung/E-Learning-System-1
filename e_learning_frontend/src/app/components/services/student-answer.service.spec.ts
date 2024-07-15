import { TestBed } from '@angular/core/testing';

import { StudentAnswerService } from './student-answer.service';

describe('StudentAnswerService', () => {
  let service: StudentAnswerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentAnswerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
