import { TestBed } from '@angular/core/testing';

import { DefaultQueryParametersGuard } from './default-query-parameters.guard';

describe('DefaultQueryParametersGuard', () => {
  let guard: DefaultQueryParametersGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(DefaultQueryParametersGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
