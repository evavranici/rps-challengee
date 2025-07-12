import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Player, PlayerStats } from '../interfaces/player.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private backendApiPrefix = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }
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
    return this.http.put<Player>(`${this.backendApiPrefix}/players/${id}/stats`, stats);
  }

  resetPlayerStats(id: number): Observable<any> {
    return this.http.put(`${this.backendApiPrefix}/players/${id}/reset-stats`, {});
  }

  // leaderboard related
  getLeaderboardPlayerStats(): Observable<any> {
    return this.http.get(`${this.backendApiPrefix}/players/leaderboard-stats`);
  }
}
