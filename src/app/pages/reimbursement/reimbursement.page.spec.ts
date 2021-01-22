import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReimbursementPage } from './reimbursement.page';

describe('ReimbursementPage', () => {
  let component: ReimbursementPage;
  let fixture: ComponentFixture<ReimbursementPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReimbursementPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReimbursementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
