import { TestBed, async, inject } from '@angular/core/testing';

import { SkuGuard } from './sku.guard';

describe('SkuGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SkuGuard]
    });
  });

  it('should ...', inject([SkuGuard], (guard: SkuGuard) => {
    expect(guard).toBeTruthy();
  }));
});
