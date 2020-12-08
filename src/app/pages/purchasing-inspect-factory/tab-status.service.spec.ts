import { TestBed } from '@angular/core/testing';

import { TabStatusService } from './tab-status.service';

describe('TabStatusService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TabStatusService = TestBed.get(TabStatusService);
    expect(service).toBeTruthy();
  });
});
