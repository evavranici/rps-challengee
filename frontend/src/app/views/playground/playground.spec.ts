import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { Playground } from './playground';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { GameConfigService } from '../../shared/services/game-config.service';
import { GameEngineService } from '../../shared/services/game-engine-service.service';
import { GameDisplayService } from '../../shared/services/game-display-service.service';
import { GameAnimationService } from '../../shared/services/game-animation-service.service';
import * as CurrentPlayerActions from '../../store/current-player/current-player.actions';
import { newPlayer, newStats } from '../../shared/interfaces/player.interface';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AddPlayer } from '../add-player/add-player';
import { ApiService } from '../../shared/services/api.service';

describe('Playground Component', () => {
  let component: Playground;
  let fixture: ComponentFixture<Playground>;
  let store: MockStore;
  let gameEngineService: jasmine.SpyObj<GameEngineService>;
  let gameDisplayService: jasmine.SpyObj<GameDisplayService>;
  let gameAnimationService: jasmine.SpyObj<GameAnimationService>;

  const mockGameConfig = {
    choices: {
      rock: { name: 'Rock', emoji: '✊' },
      paper: { name: 'Paper', emoji: '✋' },
      scissors: { name: 'Scissors', emoji: '✌️' },
    },
    choiceKeys: ['rock', 'paper', 'scissors'],
  };

  class MockGameConfigService {
    choices = mockGameConfig.choices;
    choiceKeys = mockGameConfig.choiceKeys;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPlayer],
      providers: [
        provideHttpClientTesting(),
        ApiService,
        provideMockStore({
          initialState: {
            currentPlayer: {
              id: 1,
              name: 'Test',
              icon: '',
              stats: {
                playerScore: 0,
                computerScore: 0,
                playerHistory: [],
                computerHistory: [],
                totalRounds: 0,
              },
            },
            players: {
              data: [
                {
                  id: 1,
                  name: 'Test',
                  icon: '',
                  stats: {
                    playerScore: 0,
                    computerScore: 0,
                    playerHistory: [],
                    computerHistory: [],
                    totalRounds: 0,
                  },
                },
              ],
            },
            leaderboard: {
              data: [
                {
                  id: 1,
                  name: 'Test Player',
                  icon: 'assets/icons/rock.svg',
                  gamesPlayed: 10,
                  score: 5,
                  winPercentage: 60,
                },
              ],
            },
          },
        }),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ id: 1 })),
          },
        },
        { provide: GameConfigService, useValue: MockGameConfigService },
        {
          provide: GameEngineService,
          useValue: jasmine.createSpyObj('GameEngineService', [
            'getComputerChoice',
            'getWinner',
            'updateStats',
          ]),
        },
        {
          provide: GameDisplayService,
          useValue: jasmine.createSpyObj('GameDisplayService', [
            'createChoiceHtml',
            'getMostFrequentHtml',
            'getHistoryHtml',
          ]),
        },
        {
          provide: GameAnimationService,
          useValue: jasmine.createSpyObj('GameAnimationService', [
            'playAnimation',
            'delay',
          ]),
        },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(Playground);
    component = fixture.componentInstance;

    gameEngineService = TestBed.inject(
      GameEngineService
    ) as jasmine.SpyObj<GameEngineService>;
    gameDisplayService = TestBed.inject(
      GameDisplayService
    ) as jasmine.SpyObj<GameDisplayService>;
    gameAnimationService = TestBed.inject(
      GameAnimationService
    ) as jasmine.SpyObj<GameAnimationService>;

    component.playerMostUsed = '-';
    component.player = {
      id: 1,
      name: 'Test Player',
      icon: 'plane',
      stats: {
        playerScore: 0,
        computerScore: 0,
        playerHistory: [],
        computerHistory: [],
        totalRounds: 0,
      },
    };
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and title', () => {
    expect(component.title).toContain('Rock');
  });

  it('should not allow choice if already playing', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    (component.player = {
      id: 1,
      icon: 'test-icon',
      name: 'Test Player',
      stats: newStats,
    }),
      (component.isPlaying = true);
    await component.makeChoice('rock');
    expect(gameEngineService.getComputerChoice).not.toHaveBeenCalled();
  });

  it('should handle player choice and update stats', fakeAsync(async () => {
    component.isPlaying = false;
    component.player = {
      id: 1,
      icon: 'test-icon',
      name: 'Test Player',
      stats: newStats,
    };

    gameEngineService.getComputerChoice.and.returnValue('scissors');
    gameEngineService.getWinner.and.returnValue('player');
    gameEngineService.updateStats.and.returnValue(component.player.stats);
    gameAnimationService.playAnimation.and.callFake((_, __, ___, ____, cb) => {
      cb();
      return Promise.resolve();
    });
    gameAnimationService.delay.and.returnValue(Promise.resolve());

    component.makeChoice('rock');

    expect(gameEngineService.getComputerChoice).toHaveBeenCalled();
    expect(gameEngineService.getWinner).toHaveBeenCalledWith(
      'rock',
      'scissors'
    );
  }));

  it('should update UI display based on player stats', () => {
    component.player = {
      id: 1,
      icon: 'test-icon',
      name: 'Test Player',
      stats: {
        playerScore: 6,
        computerScore: 4,
        playerHistory: ['rock', 'paper', 'scissors'],
        computerHistory: ['scissors', 'rock', 'paper'],
        totalRounds: 10,
      },
    };

    gameDisplayService.getMostFrequentHtml.and.returnValue('🪨');
    gameDisplayService.getHistoryHtml.and.returnValue('History HTML');

    fixture.detectChanges();
    component.updateUIDisplay();

    expect(component.playerWinRate).toBe(60);
    expect(component.playerMostUsed).toBe('🪨');
    expect(component.playerHistoryDisplay).toBe('History HTML');
  });

  it('should reset UI display if no player stats', () => {
    component.player = {
      id: 42,
      icon: 'test-icon',
      name: 'Test Player',
      stats: newStats,
    };
    component.updateUIDisplay();
    expect(component.playerWinRate).toBe(0);
  });

  it('should reset stats if player is valid', () => {
    component.player = {
      id: 42,
      icon: 'test-icon',
      name: 'Test Player',
      stats: newStats,
    };
    const dispatchSpy = spyOn(store, 'dispatch');

    component.resetPlaysStats();
    expect(dispatchSpy).toHaveBeenCalledWith(
      CurrentPlayerActions.resetCurrentPlayerStats({ playerId: 42 })
    );
  });

  it('should process player choice correctly and update stats', fakeAsync(async () => {
    component.isPlaying = false;
    component.player = {
      id: 42,
      icon: 'test-icon',
      name: 'Test Player',
      stats: {
        playerScore: 0,
        computerScore: 0,
        playerHistory: [],
        computerHistory: [],
        totalRounds: 0,
      },
    };

    // Arrange spies for the game engine service methods
    gameEngineService.getComputerChoice.and.returnValue('scissors');
    gameEngineService.getWinner.and.returnValue('player');
    gameEngineService.updateStats.and.returnValue({
      totalRounds: 1,
      playerHistory: ['rock'],
      computerHistory: ['scissors'],
      computerScore: 0,
      playerScore: 1,
    });

    // Fake the animation service behavior
    gameAnimationService.playAnimation.and.callFake(
      (winner, playerEl, computerEl, arenaEl, cb) => {
        cb(); // simulate animation callback immediately
        return Promise.resolve();
      }
    );
    gameAnimationService.delay.and.returnValue(Promise.resolve());

    // Act
    await component.makeChoice('rock');

    // Assert
    expect(gameEngineService.getComputerChoice).toHaveBeenCalled();
    expect(gameEngineService.getWinner).toHaveBeenCalledWith(
      'rock',
      'scissors'
    );
    expect(gameEngineService.updateStats).toHaveBeenCalledWith(
      'rock',
      'scissors',
      'player',
      component.player
    );
    expect(gameAnimationService.playAnimation).toHaveBeenCalled();
    expect(component.isPlaying).toBe(false);
  }));
});
