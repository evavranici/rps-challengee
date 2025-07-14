import { TestBed } from '@angular/core/testing';

import { GameAnimationServiceService } from './game-animation-service.service';

describe('GameAnimationServiceService', () => {
  let service: GameAnimationServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameAnimationServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
