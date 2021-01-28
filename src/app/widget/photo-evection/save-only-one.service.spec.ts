import { TestBed } from '@angular/core/testing';

import { SaveOnlyOneService } from './save-only-one.service';

describe('SaveOnlyOneService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SaveOnlyOneService = TestBed.get(SaveOnlyOneService);
    expect(service).toBeTruthy();
  });
});
