import { TestBed } from '@angular/core/testing';

import { GameDisplayServiceService } from './game-display-service.service';

describe('GameDisplayServiceService', () => {
  let service: GameDisplayServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameDisplayServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
