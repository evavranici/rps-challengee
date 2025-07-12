import { TestBed } from '@angular/core/testing';

import { GameConfig } from './game-config.service';

describe('GameConfig', () => {
  let service: GameConfig;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameConfig);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
