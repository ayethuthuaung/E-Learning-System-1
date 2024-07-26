import { TestBed } from '@angular/core/testing';

import { UnreadMessageService } from './unread-message.service';

describe('UnreadMessageService', () => {
  let service: UnreadMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnreadMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
