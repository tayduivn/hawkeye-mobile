import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaPage } from './sa.page';

describe('SaPage', () => {
  let component: SaPage;
  let fixture: ComponentFixture<SaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
