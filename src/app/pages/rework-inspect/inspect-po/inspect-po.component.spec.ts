import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectPoComponent } from './inspect-po.component';

describe('InspectPoComponent', () => {
  let component: InspectPoComponent;
  let fixture: ComponentFixture<InspectPoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectPoComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectPoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
