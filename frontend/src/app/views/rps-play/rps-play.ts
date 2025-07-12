import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameChoice, Player } from '../../shared/interfaces/player.interface';
import { ApiService } from '../../shared/services/api.service';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from '../../shared/pipes/safe-html.pipe';
import { Monitoring } from '../../components/monitoring/monitoring';
import { Leaderboard } from '../leaderboard/leaderboard';
import { CustomizedButton } from '../../components/customized-button/customized-button';
import { LeaderboardService } from '../../shared/services/leaderboard.service';
import { CardChoice } from '../../components/card-choice/card-choice';
import { GameConfigService } from '../../shared/services/game-config.service';

const ANIMATION_DELAY_INITIAL = 50;
const ANIMATION_DELAY_SHOW_MOVES = 500;
const ANIMATION_DELAY_VANISH = 2000;
const ANIMATION_DURATION_SHAKE = 500;

@Component({
  selector: 'app-rps-play',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe, Monitoring, Leaderboard, CustomizedButton, CardChoice],
  templateUrl: './rps-play.html',
  styleUrls: ['./rps-play.css']
})
export class RpsPlay implements OnInit, OnDestroy {
  playerId: number | null = null;
  player: Player | null = null;
  isPlaying: boolean = false;
  computerHistory: GameChoice[] = [];
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

  @ViewChild('gameArena') gameArenaEl!: ElementRef;
  @ViewChild('playerChoiceDisplayEl') playerChoiceDisplayEl!: ElementRef;
  @ViewChild('computerChoiceDisplayEl') computerChoiceDisplayEl!: ElementRef;
  @ViewChild('myHiddenDiv') myHiddenDivEl!: ElementRef;
  @ViewChild('rpsPlayArea') rpsPlayAreaEl!: ElementRef;
  
  destroy$ = new Subject<void>();
  title: string = 'Rock, Paper, Scissors';

  choices: any;
  choiceKeys: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    public leaderboardService: LeaderboardService,
    private gameConfigService: GameConfigService,
  ) { }

  ngOnInit(): void {
    this.choices = this.gameConfigService.choices;
    this.choiceKeys = this.gameConfigService.choiceKeys;

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.playerId = +id;
        this.loadPlayerData();
      } else {
        console.error('No player ID provided in route.');
        this.router.navigate(['/']);
      }
    });

    this.apiService.currentPlayer$.pipe(takeUntil(this.destroy$)).subscribe(player => {
      this.player = player;
    });

    this.updateGameTitle();
    this.listenForKeyPresses();
  }

  listenForKeyPresses(): void {
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') {  
        event.preventDefault(); // Prevent default tab behavior to go to the next focusable element
        this.isLeaderboardVisible ? this.hideLeaderboard() : this.showLeaderboard();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {  
        this.hideLeaderboard()
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
  }

  loadPlayerData(): void {
    if (this.playerId === null) return;

    this.apiService.getPlayerById(this.playerId).subscribe({
      next: (playerData) => {
        if (!playerData.stats) {
          playerData.stats = { playerScore: 0, computerScore: 0, playerWins: 0, computerWins: 0, totalRounds: 0, playerHistory: [], computerHistory: [] };
        }
        this.apiService.setCurrentPlayer(playerData);
        this.updateUIDisplay();
      },
      error: () => {
        this.router.navigate(['/']);
      }
    });
  }

  async makeChoice(playerChoice: GameChoice): Promise<void> {
    console.log('Player choice:', playerChoice);
    if (this.isPlaying || !this.player) {
      return;
    }

    this.isPlaying = true;
    this.playerChoiceDisplay = '';
    this.computerChoiceDisplay = '';

    const computerChoice: GameChoice = this.getComputerChoice();
    const winner = this.getWinner(playerChoice, computerChoice);

    this.player.stats.playerHistory.push(playerChoice);
    this.player.stats.computerHistory.push(computerChoice);

    this.computerHistory.push(computerChoice);
    this.player.stats.totalRounds++;

    await this.startCountdown();
    this.displayChoices(playerChoice, computerChoice);
    await this.playAnimation(winner);

    if (this.player.id !== null) {
      this.apiService.updatePlayerStats(this.player.id, this.player.stats).subscribe({
        next: (updatedPlayer) => {
          this.apiService.setCurrentPlayer(updatedPlayer);
        },
        error: () => {
        }
      });
    }
  }

  private async startCountdown(): Promise<void> {
    let count = 3;
    this.countdownText = count.toString();

    return new Promise(resolve => {
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

  private getComputerChoice(): GameChoice {
    return this.choiceKeys[Math.floor(Math.random() * this.choiceKeys.length)];
  }

  private getWinner(playerChoice: GameChoice, computerChoice: GameChoice): 'player' | 'computer' | 'tie' {
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

     // Fallback in case of unexpected logic (should not be reached if rules are exhaustive)
    this.resultClass = 'text-yellow-300';
    return 'tie';
  }

  private displayChoices(playerChoice: GameChoice, computerChoice: GameChoice): void {
    this.playerChoiceDisplay = this.createChoiceDisplayHtml(playerChoice, true);
    this.computerChoiceDisplay = this.createChoiceDisplayHtml(computerChoice, false);
  }

  private createChoiceDisplayHtml(choice: GameChoice, isPlayer: boolean): string {
    const glowClass = isPlayer ? 'selected-player' : 'selected-computer';
    // Use the 'emoji' property
    return `<div class="choice-card-display ${glowClass}" style="width: 150px;">
              <div class="w-full h-20 flex items-center justify-center text-6xl">${this.choices[choice].emoji}</div>
              <p class="text-center font-semibold text-lg mt-2">${this.choices[choice].name}</p>
            </div>`;
  }

  private updateScore(winner: 'player' | 'computer' | 'tie'): void {
    if (!this.player) return;

    if (winner === 'player') {
      this.player.stats.playerScore++;
      this.player.stats.playerWins++;
    } else if (winner === 'computer') {
      this.player.stats.computerScore++;
      this.player.stats.computerWins++;
    }
  }

  private updateUIDisplay(): void {
    if (!this.player) return;

    const stats = this.player.stats;

    this.playerWinRate = stats.totalRounds > 0 ? Math.round((stats.playerWins / stats.totalRounds) * 100) : 0;
    this.computerWinRate = stats.totalRounds > 0 ? Math.round((stats.computerWins / stats.totalRounds) * 100) : 0;

    this.playerMostUsed = this.getMostFrequentDisplay(stats.playerHistory);
    this.computerMostUsed = this.getMostFrequentDisplay(stats.computerHistory);

    this.playerHistoryDisplay = this.getHistoryDisplay(stats.playerHistory);
    this.computerHistoryDisplay = this.getHistoryDisplay(stats.computerHistory);
  }

  getMostFrequentDisplay(history: GameChoice[]): string {
    if (!history || history.length === 0) return '-';
    const counts = history.reduce((acc, choice) => { acc[choice] = (acc[choice] || 0) + 1; return acc; }, {} as Record<string, number>);
    const mostFrequent = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    // Use the 'emoji' property
    return `<div class="flex items-center justify-center"><span style="font-size: 2.5em;">${this.choices[mostFrequent as GameChoice].emoji}</span> <span class="ml-2">${this.choices[mostFrequent as GameChoice].name}</span></div>`;
  }

  getHistoryDisplay(history: GameChoice[]): string {
    if (!history) return '';
    // Use the 'emoji' property and apply inline style for size
    return history.slice(-5).map(choice => `<span style="font-size: 2em; margin: 0 5px;">${this.choices[choice].emoji}</span>`).join('');
  }

  getChoiceEmoji(choiceKey: GameChoice): string {
    return this.choices[choiceKey].emoji;
  }

  private async playAnimation(winner: 'player' | 'computer' | 'tie'): Promise<void> {
    await this.delay(ANIMATION_DELAY_INITIAL);

    const playerEl = this.playerChoiceDisplayEl.nativeElement;
    const computerEl = this.computerChoiceDisplayEl.nativeElement;
    const gameArenaEl = this.gameArenaEl.nativeElement;

    this.clearAnimationStates(playerEl, computerEl, gameArenaEl);

    if (winner === 'tie') {
      await this.handleTieAnimation(gameArenaEl);
      this.finalizeRound(winner);
      return;
    }

    const [winningEl, losingEl] = winner === 'player'
      ? [playerEl, computerEl]
      : [computerEl, playerEl];

    await this.delay(ANIMATION_DELAY_INITIAL);

    gameArenaEl.style.transform = 'scale(1.05)'

    await this.delay(ANIMATION_DELAY_SHOW_MOVES);
    this.applyMoveAnimations(winningEl, playerEl, computerEl);

    await this.delay(ANIMATION_DELAY_VANISH - ANIMATION_DELAY_SHOW_MOVES);
    this.applyVanishAnimation(losingEl, gameArenaEl);

    this.finalizeRound(winner);
  }

  delay(ms: number): Promise<void> {
      return new Promise(resolve => setTimeout(resolve, ms));
  }

  clearAnimationStates(playerEl: HTMLElement, computerEl: HTMLElement, gameArenaEl: HTMLElement): void {
    gameArenaEl.classList.remove('shake-animation');
    gameArenaEl.style.transform = 'scale(1)';
    playerEl.classList.remove('show-in-front', 'player-moves', 'animate-vanish');
    computerEl.classList.remove('show-in-front', 'computer-moves', 'animate-vanish');
  }

  async handleTieAnimation(gameArenaEl: HTMLElement): Promise<void> {
    await this.delay(ANIMATION_DELAY_SHOW_MOVES);
    gameArenaEl.classList.add('shake-animation');

    await this.delay(ANIMATION_DURATION_SHAKE);
    gameArenaEl.classList.remove('shake-animation');
  }

  finalizeRound(winner: 'player' | 'computer' | 'tie'): void {
    this.updateScore(winner);
    this.updateUIDisplay();
    this.isPlaying = false; // Allow new round to start
    this.leaderboardService.markLeaderboardStale();
  }

  applyMoveAnimations(winningEl: HTMLElement, playerEl: HTMLElement, computerEl: HTMLElement): void {
    winningEl.classList.add('show-in-front');
    playerEl.classList.add('player-moves');
    computerEl.classList.add('computer-moves');
  }

  applyVanishAnimation(losingEl: HTMLElement, gameArenaEl: HTMLElement): void {
    losingEl.classList.add('animate-vanish');
    gameArenaEl.style.transform = 'scale(1)'; // Reset game arena scale
  }

  resetPlaysStats(): void {
    if (this.player && this.player.id !== null) {
      this.apiService.resetPlayerStats(this.player.id).subscribe({
        next: () => {
          this.loadPlayerData();
          this.leaderboardService.markLeaderboardStale()
          console.log('Successfuly reset player stats',);
        },
        error: (error) => {
          console.error('Failed to reset player stats', error);
        }
      });
    }
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
    this.title = this.choiceKeys.map((key: any) => this.choices[key].name).join(', ');
  }
}