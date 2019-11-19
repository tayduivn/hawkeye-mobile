import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartsComponent } from './parts.component';

describe('PartsComponent', () => {
    let component: PartsComponent;
    let fixture: ComponentFixture<PartsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PartsComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PartsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
