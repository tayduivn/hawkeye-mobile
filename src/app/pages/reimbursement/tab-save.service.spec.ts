import { TestBed } from '@angular/core/testing';

import { TabSaveService } from './tab-save.service';

describe('TabSaveService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TabSaveService = TestBed.get(TabSaveService);
    expect(service).toBeTruthy();
  });
});
