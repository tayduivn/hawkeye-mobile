import { TestBed } from '@angular/core/testing';

import { IsSaveServiceService } from './is-save-service.service';

describe('IsSaveServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IsSaveServiceService = TestBed.get(IsSaveServiceService);
    expect(service).toBeTruthy();
  });
});
