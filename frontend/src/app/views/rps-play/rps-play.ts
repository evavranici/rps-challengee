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
      if (this.player) {
        this.updateUIDisplay();
      }
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
        console.log('Loaded player:', playerData);
      },
      error: (error) => {
        console.error('Error fetching player data:', error);
        alert('Failed to load player data. Redirecting to home.');
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
    this.computerHistory.push(computerChoice);
    this.player.stats.totalRounds++;

    await this.startCountdown();

    this.displayChoices(playerChoice, computerChoice);

    await this.playAnimation(winner);

    this.updateUIDisplay();

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
    return this.choiceKeys[Math.floor(Math.random() * this.choiceKeys.length)];
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
    this.computerMostUsed = this.getMostFrequentDisplay(this.computerHistory);

    // Limit history display to the last 5 elements
    const playerLast5 = stats.playerHistory.slice(-5);
    const computerLast5 = this.computerHistory.slice(-5);

    this.playerHistoryDisplay = this.getHistoryDisplay(stats.playerHistory);
    this.computerHistoryDisplay = this.getHistoryDisplay(this.computerHistory);
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
    let playerEl;
    let computerEl;
    let winningEl: HTMLElement;
    let losingEl: HTMLElement;

    await new Promise(resolve => setTimeout(resolve, 50));

    playerEl = this.playerChoiceDisplayEl.nativeElement;
    computerEl = this.computerChoiceDisplayEl.nativeElement;

    if (winner === 'player') {
      winningEl = playerEl;
      losingEl = computerEl;
    } else {
      winningEl = computerEl;
      losingEl = playerEl;
    }

    this.gameArenaEl.nativeElement.style.transform = 'scale(1.05)'

    setTimeout(() => {
      winningEl.classList.add('show-in-front');
      playerEl.classList.add('player-moves');
      computerEl.classList.add('computer-moves');
    }, 500);

    setTimeout(() => {
      losingEl.classList.add('animate-vanish');
      this.gameArenaEl.nativeElement.style.transform = 'scale(1)'
      this.updateScore(winner);
      this.isPlaying = false;
    }, 2000);

  }

  resetPlayerScore(): void {
    if (!this.player || this.player.id === null) return;

    if (confirm('Are you sure you want to reset all your stats for this player?')) {
      this.playerService.resetPlayerScore(this.player.id).subscribe({
        next: (response) => {
          this.loadPlayerData();
          this.computerHistory = [];
        },
        error: (error) => {
        }
      });
    }
  }

  backToMenu(): void {
    this.router.navigate(['/']);
  }
}