import { TestBed } from '@angular/core/testing';

import { WalletsStatisticsService } from './wallets-statistics.service';

describe('WalletsStatisticsService', () => {
  let service: WalletsStatisticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WalletsStatisticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
