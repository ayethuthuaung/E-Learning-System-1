import { TestBed } from '@angular/core/testing';

import { CourseModuleService } from './course-module.service';

describe('CourseModuleService', () => {
  let service: CourseModuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourseModuleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
