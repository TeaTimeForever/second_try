import { TestBed } from '@angular/core/testing';

import { GhostService } from './ghost.service';

describe('GhostService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GhostService = TestBed.get(GhostService);
    expect(service).toBeTruthy();
  });
});
