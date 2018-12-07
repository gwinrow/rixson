import { TestBed, inject } from '@angular/core/testing';

import { BreakPointsService } from './break-points.service';

describe('BreakPointsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BreakPointsService]
    });
  });

  it('should be created', inject([BreakPointsService], (service: BreakPointsService) => {
    expect(service).toBeTruthy();
  }));
});
