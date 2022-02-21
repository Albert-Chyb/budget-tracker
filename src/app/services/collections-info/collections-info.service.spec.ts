import { TestBed } from '@angular/core/testing';

import { CollectionsInfoService } from './collections-info.service';

describe('CollectionsInfoService', () => {
  let service: CollectionsInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollectionsInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
