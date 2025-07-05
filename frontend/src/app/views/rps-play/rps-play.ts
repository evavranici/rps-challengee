import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Player } from '../../shared/interfaces/player.interface';
import { PlayerService } from '../../shared/services/player.service';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from '../../shared/pipes/safe-html.pipe';
import { Monitoring } from '../../components/monitoring/monitoring';
import { Leaderboard } from '../leaderboard/leaderboard';

export type GameChoice = 'rock' | 'paper' | 'scissors';

const ANIMATION_DELAY_INITIAL = 50;
const ANIMATION_DELAY_SHOW_MOVES = 500;
const ANIMATION_DELAY_VANISH = 2000;
const ANIMATION_DURATION_SHAKE = 500;

@Component({
  selector: 'app-rps-play',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe, Monitoring, Leaderboard],
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

  readonly choices: any = {
    rock: { name: 'Rock', beats: 'scissors', emoji: '✊' },
    paper: { name: 'Paper', beats: 'rock', emoji: '✋' },
    scissors: { name: 'Scissors', beats: 'paper', emoji: '✌️' }
  };
  private choiceKeys: GameChoice[] = ['rock', 'paper', 'scissors'];

  private destroy$ = new Subject<void>();

  playersStats = [
    {
        "id": 2,
        "name": "Patoooootie",
        "icon": "\uD83D\uDE81",
        "winPercentage": 33.33,
        "gamesPlayed": 3,
        "score": 0.061490315276160515
    },
    {
        "id": 1,
        "name": "Eva",
        "icon": "\uD83D\uDE80",
        "winPercentage": 0.0,
        "gamesPlayed": 5,
        "score": -3.139202815737979E-17
    }
]

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private playerService: PlayerService
  ) { }

  ngOnInit(): void {
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

    this.playerService.currentPlayer$.pipe(takeUntil(this.destroy$)).subscribe(player => {
      this.player = player;
    });

    this.listenForTabKey();
  }

  listenForTabKey(): void {
    
     document.addEventListener('keydown', (event) => {
        if (event.key === 'Tab') {  
            // Prevent the browser's default Tab behavior (which is to move focus to the next element)
            event.preventDefault();
            this.isLeaderboardVisible ? this.removeLeaderboard() : this.showLeaderboard();
            this.isLeaderboardVisible = !this.isLeaderboardVisible;
            console.log('Tab key pressed, toggling leaderboard visibility:', this.isLeaderboardVisible);
        }
    });
  }

  showLeaderboard(): void {
    this.rpsPlayAreaEl.nativeElement.classList.add('darkened');
    this.myHiddenDivEl.nativeElement.classList.add('show'); 
  }

  removeLeaderboard(): void {
    this.rpsPlayAreaEl.nativeElement.classList.remove('darkened');
    this.myHiddenDivEl.nativeElement.classList.remove('show');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPlayerData(): void {
    if (this.playerId === null) return;

    this.playerService.getPlayerById(this.playerId).subscribe({
      next: (playerData) => {
        if (!playerData.stats) {
          playerData.stats = { playerScore: 0, computerScore: 0, playerWins: 0, computerWins: 0, totalRounds: 0, playerHistory: [], computerHistory: [] };
        }
        this.playerService.setCurrentPlayer(playerData);
        this.computerHistory = [];
        this.updateUIDisplay();
      },
      error: (error) => {
        this.router.navigate(['/']);
      }
    });
  }

  async makeChoice(playerChoice: GameChoice): Promise<void> {
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
      this.playerService.updatePlayerStats(this.player.id, this.player.stats).subscribe({
        next: (updatedPlayer) => {
          this.playerService.setCurrentPlayer(updatedPlayer);
        },
        error: (error) => {
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
    return this.choiceKeys[Math.floor(Math.random() * Math.random() * this.choiceKeys.length)];
  }

  private getWinner(playerChoice: GameChoice, computerChoice: GameChoice): 'player' | 'computer' | 'tie' {
    if (playerChoice === computerChoice) {
      this.resultClass = 'text-yellow-300';
      return 'tie';
    }

    if (this.choices[playerChoice].beats === computerChoice) {
      this.resultClass = 'text-green-400';
      return 'player';
    } else {
      this.resultClass = 'text-red-400';
      return 'computer';
    }
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
    // Use the 'emoji' property and apply inline style for size
    return `<div class="flex items-center justify-center"><span style="font-size: 2.5em;">${this.choices[mostFrequent].emoji}</span> <span class="ml-2">${this.choices[mostFrequent].name}</span></div>`;
  }

  getHistoryDisplay(history: GameChoice[]): string {
    if (!history) return '';
    // Use the 'emoji' property and apply inline style for size
    return history.slice(-5).map(choice => `<span style="font-size: 2em; margin: 0 5px;">${this.choices[choice].emoji}</span>`).join('');
  }

  // Renamed from getChoiceSvg to getChoiceEmoji for clarity
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

    // Wait for the shake animation to complete before proceeding
    // This requires a CSS animation listener, or a fixed duration delay
    await this.delay(ANIMATION_DURATION_SHAKE);
    gameArenaEl.classList.remove('shake-animation');
  }

  finalizeRound(winner: 'player' | 'computer' | 'tie'): void {
    this.updateScore(winner);
    this.updateUIDisplay();
    this.isPlaying = false; // Allow new round to start
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

  resetPlayerScore(): void {
    if (!this.player || this.player.id === null) return;

    if (confirm('Are you sure you want to reset all your stats for this player?')) {
      this.playerService.resetPlayerScore(this.player.id).subscribe({
        next: () => {
          this.loadPlayerData();
          this.computerHistory = [];
        },
        error: () => {
        }
      });
    }
  }

  backToMenu(): void {
    this.router.navigate(['/']);
  }
}