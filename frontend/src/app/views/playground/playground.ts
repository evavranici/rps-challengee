import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ChoiceDefinition,
  GameChoice,
  newPlayer,
} from '../../shared/interfaces/player.interface';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from '../../shared/pipes/safe-html.pipe';
import { Monitoring } from '../../components/monitoring/monitoring';
import { Leaderboard } from '../leaderboard/leaderboard';
import { CustomizedButton } from '../../components/customized-button/customized-button';
import { CardChoice } from '../../components/card-choice/card-choice';
import { GameConfigService } from '../../shared/services/game-config.service';
import { select, Store } from '@ngrx/store';
import { RootState } from '../../store/root.state';
import * as LeaderboardSelectors from '../../store/leaderboard/leaderboard.selectors';
import * as CurrentPlayerActions from '../../store/current-player/current-player.actions';
import * as CurrentPlayerSelectors from '../../store/current-player/current-player.selectors';
import {
  LeaderboardPlayerStatsDto,
  Player,
  PlayerStats,
} from '../../api/models';
import { GameAnimationService } from '../../shared/services/game-animation-service.service';
import { GameEngineService } from '../../shared/services/game-engine-service.service';
import { GameDisplayService } from '../../shared/services/game-display-service.service';

const ANIMATION_DELAY_INITIAL = 50;

@Component({
  selector: 'app-playground',
  standalone: true,
  imports: [
    CommonModule,
    SafeHtmlPipe,
    Monitoring,
    Leaderboard,
    CustomizedButton,
    CardChoice,
  ],
  templateUrl: './playground.html',
  styleUrls: ['./playground.css'],
})
export class Playground implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(Store<RootState>);
  private gameEngineService = inject(GameEngineService);
  private gameConfigService = inject(GameConfigService);
  private gameDisplayService = inject(GameDisplayService);
  private animationService = inject(GameAnimationService);

  @ViewChild('gameArena') gameArenaEl!: ElementRef<HTMLElement>;
  @ViewChild('playerChoiceDisplayEl')
  playerChoiceDisplayEl!: ElementRef<HTMLElement>;
  @ViewChild('computerChoiceDisplayEl')
  computerChoiceDisplayEl!: ElementRef<HTMLElement>;
  @ViewChild('myHiddenDiv') myHiddenDivEl!: ElementRef<HTMLElement>;
  @ViewChild('rpsPlayArea') rpsPlayAreaEl!: ElementRef<HTMLElement>;

  isPlaying: boolean = false;
  countdownText: string = '';
  resultClass: string = '';
  playerChoiceDisplay: string = '';
  computerChoiceDisplay: string = '';
  playerWinRate: number = 0;
  computerWinRate: number = 0;
  playerMostUsed: string = '-';
  computerMostUsed: string = '-';
  playerHistoryDisplay: string = '';
  computerHistoryDisplay: string = '';
  isLeaderboardVisible: boolean = false;
  title: string = 'Rock, Paper, Scissors';
  choices: Record<GameChoice, ChoiceDefinition>;
  choiceKeys: GameChoice[];
  player: Player = newPlayer; // Current player object

  leaderboardData$: Observable<LeaderboardPlayerStatsDto[]>;
  currentPlayer$: Observable<Player>; // Observable for the current player from the store
  destroy$ = new Subject<void>();

  constructor() {
    this.choices = this.gameConfigService.choices;
    this.choiceKeys = this.gameConfigService.choiceKeys;

    this.leaderboardData$ = this.store.pipe(
      select(LeaderboardSelectors.selectLeaderboardData)
    );
    this.currentPlayer$ = this.store.pipe(
      select(CurrentPlayerSelectors.selectCurrentPlayer)
    );
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.store.dispatch(
          CurrentPlayerActions.loadCurrentPlayer({ playerId: +id })
        );
      } else {
        console.error('No player id provided in route.');
        this.router.navigate(['/']);
      }
    });

    this.currentPlayer$.pipe(takeUntil(this.destroy$)).subscribe((player) => {
      console.log('Current player:', player);
      this.player = player; // Update the local player variable
      if (player) {
        this.updateUIDisplay();
      } else {
        this.resetUIDisplay();
      }
    });

    this.updateGameTitle();
    this.listenForKeyPresses();
  }

  listenForKeyPresses(): void {
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') {
        event.preventDefault(); // Prevent default tab behavior to go to the next focusable element
        if (this.isLeaderboardVisible) {
          this.hideLeaderboard();
        } else {
          this.showLeaderboard();
        }
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.hideLeaderboard();
      }
    });
  }

  showLeaderboard(): void {
    this.isLeaderboardVisible = true;
    this.rpsPlayAreaEl.nativeElement.classList.add('darkened');
  }

  hideLeaderboard(): void {
    this.rpsPlayAreaEl.nativeElement.classList.remove('darkened');
    this.isLeaderboardVisible = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.store.dispatch(CurrentPlayerActions.clearCurrentPlayer());
  }

  async makeChoice(playerChoice: GameChoice): Promise<void> {
    console.log('Player choice:', playerChoice);
    if (!this.canMakeChoice()) return;

    const computerChoice = this.gameEngineService.getComputerChoice();
    const winner = this.gameEngineService.getWinner(
      playerChoice,
      computerChoice
    );
    const updatedStats = this.gameEngineService.updateStats(
      playerChoice,
      computerChoice,
      winner,
      this.player
    );

    await this.playRoundWithCountdown(playerChoice, computerChoice, winner);
    this.saveStatsIfValid(updatedStats);
  }

  private canMakeChoice(): boolean {
    if (this.isPlaying) {
      console.warn('Game is already in progress. Ignoring new choice.');
      return false;
    }

    if (!this.player || this.player.id === null) {
      console.error('Current player not loaded or has no ID.');
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }

  private async playRoundWithCountdown(
    playerChoice: GameChoice,
    computerChoice: GameChoice,
    winner: 'player' | 'computer' | 'tie'
  ): Promise<void> {
    this.isPlaying = true;
    this.countdownText = '';
    this.clearPlayedCards();

    await this.startCountdown();
    this.displayChoices(playerChoice, computerChoice);
    await this.animationService.delay(ANIMATION_DELAY_INITIAL);

    const playerEl = this.playerChoiceDisplayEl.nativeElement;
    const computerEl = this.computerChoiceDisplayEl.nativeElement;
    const gameArenaEl = this.gameArenaEl.nativeElement;

    await this.animationService.playAnimation(
      winner,
      playerEl,
      computerEl,
      gameArenaEl,
      () => this.finalizeRound()
    );
  }

  private saveStatsIfValid(updatedStats: PlayerStats): void {
    if (
      this.player.id !== null &&
      this.player.id !== undefined &&
      updatedStats
    ) {
      this.store.dispatch(
        CurrentPlayerActions.updateCurrentPlayerStats({
          playerId: this.player.id,
          stats: updatedStats,
        })
      );
    } else {
      console.error(
        'Cannot update player stats: Player ID or stats are missing.'
      );
      this.isPlaying = false; // fallback just in case
      this.countdownText = '';
    }
  }

  private async startCountdown(): Promise<void> {
    let count = 3;
    this.countdownText = count.toString();

    return new Promise((resolve) => {
      const intervalId = setInterval(() => {
        count--;
        if (count > 0) {
          this.countdownText = count.toString();
        } else {
          clearInterval(intervalId);
          this.countdownText = 'FIGHT!';
          setTimeout(() => {
            this.countdownText = '';
            resolve();
          }, 300);
        }
      }, 500);
    });
  }

  private displayChoices(
    playerChoice: GameChoice,
    computerChoice: GameChoice
  ): void {
    this.playerChoiceDisplay = this.gameDisplayService.createChoiceHtml(
      playerChoice,
      true
    );
    this.computerChoiceDisplay = this.gameDisplayService.createChoiceHtml(
      computerChoice,
      false
    );
  }

  private updateUIDisplay(): void {
    if (!this.player || !this.player.stats) {
      this.resetUIDisplay();
      return;
    }

    const stats = this.player.stats;

    this.playerWinRate =
      stats.totalRounds > 0
        ? Math.round((stats.playerWins / stats.totalRounds) * 100)
        : 0;
    this.computerWinRate =
      stats.totalRounds > 0
        ? Math.round((stats.computerWins / stats.totalRounds) * 100)
        : 0;

    this.playerMostUsed = this.gameDisplayService.getMostFrequentHtml(
      stats.playerHistory
    );
    this.computerMostUsed = this.gameDisplayService.getMostFrequentHtml(
      stats.computerHistory
    );

    this.playerHistoryDisplay = this.gameDisplayService.getHistoryHtml(
      stats.playerHistory
    );
    this.computerHistoryDisplay = this.gameDisplayService.getHistoryHtml(
      stats.computerHistory
    );
  }

  private resetUIDisplay(): void {
    this.playerWinRate = 0;
    this.computerWinRate = 0;
    this.playerMostUsed = '-';
    this.computerMostUsed = '-';
    this.playerHistoryDisplay = '';
    this.computerHistoryDisplay = '';
  }

  getChoiceEmoji(choiceKey: GameChoice): string {
    return this.choices[choiceKey].emoji;
  }

  finalizeRound(): void {
    this.isPlaying = false; // allow new round to start
  }

  async resetPlaysStats(): Promise<void> {
    if (this.player && this.player.id !== undefined) {
      this.store.dispatch(
        CurrentPlayerActions.resetCurrentPlayerStats({
          playerId: this.player.id,
        })
      );

      this.clearPlayedCards();
    } else {
      console.error('Cannot reset player stats: Player ID is missing.');
    }
  }

  clearPlayedCards(): void {
    this.playerChoiceDisplay = '';
    this.computerChoiceDisplay = '';
  }

  backToMenu(): void {
    this.router.navigate(['/']);
  }

  get gridColsClass(): string {
    switch (this.choiceKeys.length) {
      case 3:
        return 'grid-cols-3';
      case 4:
        return 'grid-cols-4';
      default:
        return 'grid-cols-3'; // Fallback
    }
  }

  private updateGameTitle(): void {
    this.title = this.choiceKeys
      .map((key) => this.choices[key].name)
      .join(', ');
  }
}
