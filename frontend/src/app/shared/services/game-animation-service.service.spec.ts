import { TestBed } from '@angular/core/testing';

import { GameAnimationService } from './game-animation-service.service';

describe('GameAnimationService', () => {
  let service: GameAnimationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameAnimationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
