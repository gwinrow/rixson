import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaravansComponent } from './caravans.component';

describe('CaravansComponent', () => {
  let component: CaravansComponent;
  let fixture: ComponentFixture<CaravansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaravansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaravansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
