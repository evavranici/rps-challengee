import { Injectable, signal, WritableSignal } from '@angular/core';
import { ApiService } from './api.service';
import { Player } from '../interfaces/player.interface';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  // Public signal to hold the list of all players
  public players: WritableSignal<Player[]> = signal([]);

  // Internal flags for caching logic
  private isPlayersDataStale: boolean = true;

  constructor(
    private apiService: ApiService
  ) {}

  public fetchPlayers(): void {
    if (!this.isPlayersDataStale) {
      console.log('PlayerService: Players data is fresh. Using cached data.');
      return; // Data is fresh, no API call needed
    }

    console.log('PlayerService: Players data is stale or expired. Fetching new data...');

    this.apiService.getAllPlayers().pipe(
    ).subscribe({
      next: (data: Player[]) => {
        console.log('PlayerService: Players data received from API:', data);
        this.players.set(data);
        this.isPlayersDataStale = false; // Mark data as fresh
      },
      error: (err) => {
        console.error('PlayerService: Failed to fetch players data:', err);
        this.markPlayersStale()
      }
    });
  }

  // Called after any action that could change players list (create new player).
  public markPlayersStale(): void {
    this.isPlayersDataStale = true;
    this.players.set([]);
    console.log('PlayerService: Players data marked as stale.');
  }
}