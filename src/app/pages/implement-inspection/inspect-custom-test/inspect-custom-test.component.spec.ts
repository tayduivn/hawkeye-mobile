import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectCustomTestComponent } from './inspect-custom-test.component';

describe('InspectCustomTestComponent', () => {
  let component: InspectCustomTestComponent;
  let fixture: ComponentFixture<InspectCustomTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectCustomTestComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectCustomTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
