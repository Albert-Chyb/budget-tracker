import { TestBed } from '@angular/core/testing';

import { RouteNameService } from './route-name.service';

describe('RouteNameService', () => {
  let service: RouteNameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouteNameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
