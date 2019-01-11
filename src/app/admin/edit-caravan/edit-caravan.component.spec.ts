import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCaravanComponent } from './edit-caravan.component';

describe('EditCaravanComponent', () => {
  let component: EditCaravanComponent;
  let fixture: ComponentFixture<EditCaravanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCaravanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCaravanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
