import { Injectable, signal, WritableSignal } from '@angular/core';
import { ApiService } from './api.service';
import { LeaderboardPlayerStats } from '../interfaces/leaderboard.interface';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {
  // Public signal to hold the leaderboard data
  public leaderboardStats: WritableSignal<LeaderboardPlayerStats[]> = signal([]);

  // Internal flags for caching logic
  private isLeaderboardDataStale: boolean = true;

  constructor(
    private apiService: ApiService
  ) {}

  public fetchLeaderboardData(): void {
    if (!this.isLeaderboardDataStale) {
      console.log('LeaderboardService: Data is fresh. Using cached data.');
      return;
    }

    console.log('LeaderboardService: Data is stale or expired. Fetching new data...');
    this.apiService.getLeaderboardPlayerStats().subscribe({
      next: (data: LeaderboardPlayerStats[]) => {
        console.log('LeaderboardService: Data received from API:', data);
        const rankedData = data.map((player, index) => ({
          ...player,
          rank: index + 1 // (1-based)
        }));
        this.leaderboardStats.set(rankedData);
        this.isLeaderboardDataStale = false;
      },
      error: (err) => {
        console.error('LeaderboardService: Failed to fetch leaderboard data:', err);
        this.markLeaderboardStale();
      }
    });
  }

  // Called after any action that could change leaderboard scores (end of a game round, player reset).
  public markLeaderboardStale(): void {
    this.isLeaderboardDataStale = true;
    this.leaderboardStats.set([]);
  }
}