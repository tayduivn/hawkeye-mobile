import { TestBed } from '@angular/core/testing';

import { FlashPageService } from './flash-page.service';

describe('FlashPageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FlashPageService = TestBed.get(FlashPageService);
    expect(service).toBeTruthy();
  });
});
