import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingCaravanComponent } from './booking-caravan.component';

describe('BookingCaravanComponent', () => {
  let component: BookingCaravanComponent;
  let fixture: ComponentFixture<BookingCaravanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingCaravanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingCaravanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
