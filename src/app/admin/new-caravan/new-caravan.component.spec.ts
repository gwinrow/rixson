import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCaravanComponent } from './new-caravan.component';

describe('NewCaravanComponent', () => {
  let component: NewCaravanComponent;
  let fixture: ComponentFixture<NewCaravanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewCaravanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCaravanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
