import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasingInspectFactoryPage } from './purchasing-inspect-factory.page';

describe('PurchasingInspectFactoryPage', () => {
  let component: PurchasingInspectFactoryPage;
  let fixture: ComponentFixture<PurchasingInspectFactoryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchasingInspectFactoryPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasingInspectFactoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
