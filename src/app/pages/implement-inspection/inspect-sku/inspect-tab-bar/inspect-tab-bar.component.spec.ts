import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectTabBarComponent } from './inspect-tab-bar.component';

describe('InspectTabBarComponent', () => {
  let component: InspectTabBarComponent;
  let fixture: ComponentFixture<InspectTabBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectTabBarComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectTabBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
