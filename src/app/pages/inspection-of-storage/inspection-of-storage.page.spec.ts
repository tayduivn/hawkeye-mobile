import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionOfStoragePage } from './inspection-of-storage.page';

describe('InspectionOfStoragePage', () => {
  let component: InspectionOfStoragePage;
  let fixture: ComponentFixture<InspectionOfStoragePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectionOfStoragePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionOfStoragePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
