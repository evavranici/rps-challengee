import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Player, PlayerStats } from '../interfaces/player.interface';
import { Observable } from 'rxjs';
import { LeaderboardPlayerStats } from '../interfaces/leaderboard.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private backendApiPrefix = 'http://localhost:8080/api';

  // player related
  getAllPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(`${this.backendApiPrefix}/players`);
  }

  getPlayerById(id: number): Observable<Player> {
    return this.http.get<Player>(`${this.backendApiPrefix}/players/${id}`);
  }

  createPlayer(player: Player): Observable<Player> {
    return this.http.post<Player>(`${this.backendApiPrefix}/players`, player);
  }

  updatePlayerStats(id: number, stats: PlayerStats): Observable<Player> {
    return this.http.put<Player>(
      `${this.backendApiPrefix}/players/${id}/stats`,
      stats
    );
  }

  resetPlayerStats(id: number): Observable<Player> {
    return this.http.put<Player>(
      `${this.backendApiPrefix}/players/${id}/reset-stats`,
      {}
    );
  }

  // leaderboard related
  getLeaderboardPlayerStats(): Observable<LeaderboardPlayerStats[]> {
    return this.http.get<LeaderboardPlayerStats[]>(
      `${this.backendApiPrefix}/players/leaderboard-stats`
    );
  }
}
