import { TestBed } from '@angular/core/testing';

import { GridcommService } from './gridcomm.service';

describe('GridcommService', () => {
  let service: GridcommService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GridcommService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
