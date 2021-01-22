import { TestBed } from '@angular/core/testing';

import { DisabledService } from './disabled.service';

describe('DisabledService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DisabledService = TestBed.get(DisabledService);
    expect(service).toBeTruthy();
  });
});
