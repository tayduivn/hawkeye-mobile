import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FactoryAssessPage } from './factory-assess.page';

describe('FactoryAssessPage', () => {
  let component: FactoryAssessPage;
  let fixture: ComponentFixture<FactoryAssessPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FactoryAssessPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FactoryAssessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
