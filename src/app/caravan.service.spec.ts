import { TestBed, inject } from '@angular/core/testing';

import { CaravanService } from './caravan.service';

describe('CaravanService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CaravanService]
    });
  });

  it('should be created', inject([CaravanService], (service: CaravanService) => {
    expect(service).toBeTruthy();
  }));
});
