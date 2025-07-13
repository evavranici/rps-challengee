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
  newStats,
} from '../../shared/interfaces/player.interface';
import { Observable, Subject, takeUntil, firstValueFrom } from 'rxjs';
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

const ANIMATION_DELAY_INITIAL = 50;
const ANIMATION_DELAY_SHOW_MOVES = 500;
const ANIMATION_DELAY_VANISH = 2000;
const ANIMATION_DURATION_SHAKE = 500;

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
  private gameConfigService = inject(GameConfigService);
  private store = inject(Store<RootState>);

  @ViewChild('gameArena') gameArenaEl!: ElementRef;
  @ViewChild('playerChoiceDisplayEl') playerChoiceDisplayEl!: ElementRef;
  @ViewChild('computerChoiceDisplayEl') computerChoiceDisplayEl!: ElementRef;
  @ViewChild('myHiddenDiv') myHiddenDivEl!: ElementRef;
  @ViewChild('rpsPlayArea') rpsPlayAreaEl!: ElementRef;

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

  leaderboardData$: Observable<LeaderboardPlayerStatsDto[]>;
  leaderboardIsLoading$: Observable<boolean>;
  leaderboardError$: Observable<unknown>;

  currentPlayer$: Observable<Player | null>; // Observable for the current player from the store
  currentPlayerIsLoading$: Observable<boolean>;
  currentPlayerError$: Observable<unknown>;

  destroy$ = new Subject<void>();

  constructor() {
    this.choices = this.gameConfigService.choices;
    this.choiceKeys = this.gameConfigService.choiceKeys;

    this.leaderboardData$ = this.store.pipe(
      select(LeaderboardSelectors.selectLeaderboardData)
    );
    this.leaderboardIsLoading$ = this.store.pipe(
      select(LeaderboardSelectors.selectLeaderboardIsLoading)
    );
    this.leaderboardError$ = this.store.pipe(
      select(LeaderboardSelectors.selectLeaderboardError)
    );

    this.currentPlayer$ = this.store.pipe(
      select(CurrentPlayerSelectors.selectCurrentPlayer)
    );
    this.currentPlayerIsLoading$ = this.store.pipe(
      select(CurrentPlayerSelectors.selectCurrentPlayerIsLoading)
    );
    this.currentPlayerError$ = this.store.pipe(
      select(CurrentPlayerSelectors.selectCurrentPlayerError)
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
      if (player) {
        this.updateUIDisplay(player);
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
    this.store.dispatch(CurrentPlayerActions.clearCurrentPlayer()); //Dispatch action to clear current player state when leaving the page
  }

  async makeChoice(playerChoice: GameChoice): Promise<void> {
    console.log('Player choice:', playerChoice);

    const player = await firstValueFrom(this.currentPlayer$);

    if (this.isPlaying) {
      console.warn('Game is already in progress. Ignoring new choice.');
      return;
    }
    if (!player || player.id === null) {
      console.error(
        'Cannot make choice: Current player is not loaded or has no ID.'
      );
      this.router.navigate(['/']);
      return;
    }

    this.isPlaying = true;
    this.countdownText = '';
    this.clearPlayedCards();

    const computerChoice = this.getComputerChoice();
    const winner = this.getWinner(playerChoice, computerChoice);
    const updatedStats = this.updateStats(
      playerChoice,
      computerChoice,
      winner,
      player
    );

    await this.startCountdown();
    this.displayChoices(playerChoice, computerChoice);
    await this.playAnimation(winner);

    // Dispatch action to update player stats via NgRx effect
    if (player.id !== null && updatedStats) {
      // Use 'player.id' here
      this.store.dispatch(
        CurrentPlayerActions.updateCurrentPlayerStats({
          playerId: player.id || 0, // Fallback to 0 if player.id is null
          stats: updatedStats,
        })
      );
      // The effect will handle calling ApiService and then dispatching success/failure... and also marking leaderboard stale and reloading.
    } else {
      console.error(
        'Cannot update player stats: Player ID or stats are missing.'
      );
      this.isPlaying = false; // Re-enable buttons
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

  private getComputerChoice() {
    return this.choiceKeys[Math.floor(Math.random() * this.choiceKeys.length)];
  }

  private getWinner(
    playerChoice: GameChoice,
    computerChoice: GameChoice
  ): 'player' | 'computer' | 'tie' {
    if (playerChoice === computerChoice) {
      this.resultClass = 'text-yellow-300';
      return 'tie';
    }

    // if player wins
    if (this.choices[playerChoice].beats.includes(computerChoice)) {
      this.resultClass = 'text-green-400';
      return 'player';
    }

    // if computer wins
    if (this.choices[computerChoice].beats.includes(playerChoice)) {
      this.resultClass = 'text-red-400';
      return 'computer';
    }

    // Fallback in case of unexpected logic
    this.resultClass = 'text-yellow-300';
    return 'tie';
  }

  private displayChoices(
    playerChoice: GameChoice,
    computerChoice: GameChoice
  ): void {
    this.playerChoiceDisplay = this.createChoiceDisplayHtml(playerChoice, true);
    this.computerChoiceDisplay = this.createChoiceDisplayHtml(
      computerChoice,
      false
    );
  }

  private createChoiceDisplayHtml(
    choice: GameChoice,
    isPlayer: boolean
  ): string {
    const glowClass = isPlayer ? 'selected-player' : 'selected-computer';

    return `<div class="choice-card-display ${glowClass}" style="width: 150px;">
              <div class="w-full h-20 flex items-center justify-center text-6xl">${this.choices[choice].emoji}</div>
              <p class="text-center font-semibold text-lg mt-2">${this.choices[choice].name}</p>
            </div>`;
  }

  private updateStats(
    playerChoice: GameChoice,
    computerChoice: GameChoice,
    winner: 'player' | 'computer' | 'tie',
    player: Player
  ): PlayerStats {
    const updatedStats = player.stats ? { ...player.stats } : { ...newStats };

    // Create a NEW stats object to maintain immutability
    updatedStats.playerHistory = [...updatedStats.playerHistory, playerChoice];
    updatedStats.computerHistory = [
      ...updatedStats.computerHistory,
      computerChoice,
    ];
    updatedStats.totalRounds = (updatedStats.totalRounds ?? 0) + 1;

    if (winner === 'player') {
      updatedStats.playerScore = (updatedStats.playerScore ?? 0) + 1;
      updatedStats.playerWins = (updatedStats.playerWins ?? 0) + 1;
    } else if (winner === 'computer') {
      updatedStats.computerScore = (updatedStats.computerScore ?? 0) + 1;
      updatedStats.computerWins = (updatedStats.computerWins ?? 0) + 1;
    }

    return updatedStats;
  }

  private updateUIDisplay(player: Player): void {
    if (!player || !player.stats) {
      this.resetUIDisplay();
      return;
    }

    const stats = player.stats;

    this.playerWinRate =
      stats.totalRounds > 0
        ? Math.round((stats.playerWins / stats.totalRounds) * 100)
        : 0;
    this.computerWinRate =
      stats.totalRounds > 0
        ? Math.round((stats.computerWins / stats.totalRounds) * 100)
        : 0;

    this.playerMostUsed = this.getMostFrequentDisplay(stats.playerHistory);
    this.computerMostUsed = this.getMostFrequentDisplay(stats.computerHistory);

    this.playerHistoryDisplay = this.getHistoryDisplay(stats.playerHistory);
    this.computerHistoryDisplay = this.getHistoryDisplay(stats.computerHistory);
  }

  private resetUIDisplay(): void {
    this.playerWinRate = 0;
    this.computerWinRate = 0;
    this.playerMostUsed = '-';
    this.computerMostUsed = '-';
    this.playerHistoryDisplay = '';
    this.computerHistoryDisplay = '';
  }

  getMostFrequentDisplay(history: GameChoice[]): string {
    if (!history || history.length === 0) return '-';
    const counts = history.reduce((acc, choice) => {
      acc[choice] = (acc[choice] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const mostFrequent = Object.keys(counts).reduce((a, b) =>
      counts[a] > counts[b] ? a : b
    );

    return `<div class="flex items-center justify-center"><span style="font-size: 2.5em;">${
      this.choices[mostFrequent as GameChoice].emoji
    }</span> <span class="ml-2">${
      this.choices[mostFrequent as GameChoice].name
    }</span></div>`;
  }

  getHistoryDisplay(history: GameChoice[]): string {
    if (!history) return '';

    return history
      .slice(-5)
      .map(
        (choice) =>
          `<span style="font-size: 2em; margin: 0 5px;">${this.choices[choice].emoji}</span>`
      )
      .join('');
  }

  getChoiceEmoji(choiceKey: GameChoice): string {
    return this.choices[choiceKey].emoji;
  }

  private async playAnimation(
    winner: 'player' | 'computer' | 'tie'
  ): Promise<void> {
    await this.delay(ANIMATION_DELAY_INITIAL);

    const playerEl = this.playerChoiceDisplayEl.nativeElement;
    const computerEl = this.computerChoiceDisplayEl.nativeElement;
    const gameArenaEl = this.gameArenaEl.nativeElement;

    this.clearAnimationStates(playerEl, computerEl, gameArenaEl);

    if (winner === 'tie') {
      await this.handleTieAnimation(gameArenaEl);
      this.finalizeRound();
      return;
    }

    const [winningEl, losingEl] =
      winner === 'player' ? [playerEl, computerEl] : [computerEl, playerEl];

    await this.delay(ANIMATION_DELAY_INITIAL);

    gameArenaEl.style.transform = 'scale(1.05)';

    await this.delay(ANIMATION_DELAY_SHOW_MOVES);
    this.applyMoveAnimations(winningEl, playerEl, computerEl);

    await this.delay(ANIMATION_DELAY_VANISH - ANIMATION_DELAY_SHOW_MOVES);
    this.applyVanishAnimation(losingEl, gameArenaEl);

    this.finalizeRound();
  }

  delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  clearAnimationStates(
    playerEl: HTMLElement,
    computerEl: HTMLElement,
    gameArenaEl: HTMLElement
  ): void {
    gameArenaEl.classList.remove('shake-animation');
    gameArenaEl.style.transform = 'scale(1)';
    playerEl.classList.remove(
      'show-in-front',
      'player-moves',
      'animate-vanish'
    );
    computerEl.classList.remove(
      'show-in-front',
      'computer-moves',
      'animate-vanish'
    );
  }

  async handleTieAnimation(gameArenaEl: HTMLElement): Promise<void> {
    await this.delay(ANIMATION_DELAY_SHOW_MOVES);
    gameArenaEl.classList.add('shake-animation');

    await this.delay(ANIMATION_DURATION_SHAKE);
    gameArenaEl.classList.remove('shake-animation');
  }

  finalizeRound(): void {
    this.isPlaying = false; // allow new round to start
  }

  applyMoveAnimations(
    winningEl: HTMLElement,
    playerEl: HTMLElement,
    computerEl: HTMLElement
  ): void {
    winningEl.classList.add('show-in-front');
    playerEl.classList.add('player-moves');
    computerEl.classList.add('computer-moves');
  }

  applyVanishAnimation(losingEl: HTMLElement, gameArenaEl: HTMLElement): void {
    losingEl.classList.add('animate-vanish');
    gameArenaEl.style.transform = 'scale(1)';
  }

  async resetPlaysStats(): Promise<void> {
    const player = await firstValueFrom(this.currentPlayer$);

    if (player && player.id !== null) {
      this.store.dispatch(
        CurrentPlayerActions.resetCurrentPlayerStats({
          playerId: player.id || 0,
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
