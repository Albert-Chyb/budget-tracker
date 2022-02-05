import { TestBed } from '@angular/core/testing';

import { MainSidenavService } from './main-sidenav.service';

describe('MainSidenavService', () => {
  let service: MainSidenavService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MainSidenavService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
