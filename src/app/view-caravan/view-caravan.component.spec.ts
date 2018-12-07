import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCaravanComponent } from './view-caravan.component';

describe('ViewCaravanComponent', () => {
  let component: ViewCaravanComponent;
  let fixture: ComponentFixture<ViewCaravanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCaravanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCaravanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
