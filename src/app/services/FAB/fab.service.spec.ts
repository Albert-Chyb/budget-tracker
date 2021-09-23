import { TestBed } from '@angular/core/testing';

import { FABService } from './fab.service';

describe('FABService', () => {
  let service: FABService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FABService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
