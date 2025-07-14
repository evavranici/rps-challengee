import { TestBed } from '@angular/core/testing';

import { GameEngineServiceService } from './game-engine-service.service';

describe('GameEngineServiceService', () => {
  let service: GameEngineServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameEngineServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
