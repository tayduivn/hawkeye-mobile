import { TestBed } from '@angular/core/testing';

import { IsDisabledService } from './is-disabled.service';

describe('IsDisabledService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: IsDisabledService = TestBed.get(IsDisabledService);
        expect(service).toBeTruthy();
    });
});
