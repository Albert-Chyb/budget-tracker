import { TestBed } from '@angular/core/testing';

import { ActionDispatcherService } from './action-dispatcher.service';

describe('ActionDispatcherService', () => {
  let service: ActionDispatcherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActionDispatcherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
