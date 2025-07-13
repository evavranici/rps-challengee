import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  LeaderboardPlayerStatsDto,
  Player,
  PlayerSimplifiedDto,
  PlayerStats,
} from '../../api/models';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private backendApiPrefix = 'http://localhost:8080/api';

  // player related
  getAllPlayers(): Observable<PlayerSimplifiedDto[]> {
    return this.http.get<PlayerSimplifiedDto[]>(
      `${this.backendApiPrefix}/players`
    );
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
  getLeaderboardPlayerStats(): Observable<LeaderboardPlayerStatsDto[]> {
    return this.http.get<LeaderboardPlayerStatsDto[]>(
      `${this.backendApiPrefix}/players/leaderboard-stats`
    );
  }
}
