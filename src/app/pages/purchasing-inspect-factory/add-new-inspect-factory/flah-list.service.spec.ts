import { TestBed } from '@angular/core/testing';

import { FlahListService } from './flah-list.service';

describe('FlahListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FlahListService = TestBed.get(FlahListService);
    expect(service).toBeTruthy();
  });
});
