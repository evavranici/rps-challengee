import { Component, Input, OnInit } from '@angular/core';
import { HttpClient, } from '@angular/common/http';
import { CommonModule, NgFor, NgIf, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { PlayerService } from '../../shared/services/player.service';

// matched the DTO in backend
export interface LeaderboardPlayerStats {
  id: number;
  name: string;
  icon: string;
  winPercentage: number;
  gamesPlayed: number;
  score: number; // the Wilson Score Interval
  rank?: number; // Optional: We'll add this rank in the frontend for display
}

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.html',
  styleUrls: ['./leaderboard.css'],
  standalone: true,
  imports: [
    CommonModule,
    NgFor, NgIf, DecimalPipe,
  ]
})
export class Leaderboard implements OnInit {
  @Input() leaderboardStats: LeaderboardPlayerStats[] = [];

  constructor(
     private router: Router,
     private playerService: PlayerService,
  ) { }

  ngOnInit(): void {
    this.fetchLeaderboardStats();
  }

  fetchLeaderboardStats(): void {
    this.playerService.getLeaderboardPlayerStats().subscribe({
      next: (data: LeaderboardPlayerStats[]) => {
        // The backend already sorts by score, so we just assign ranks based on array index
        this.leaderboardStats = data.map((player, index) => ({
          ...player,
          rank: index + 1 // (1-based)
        }));
      },
      error: () => {
      }
    });
  }

  backToMenu(): void {
    this.router.navigate(['/']);
  }
}