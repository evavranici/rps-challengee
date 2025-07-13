import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  LeaderboardPlayerStatsDto,
  Player,
  PlayerSimplifiedDto,
  PlayerStats,
} from '../../api/models';
import { getAllPlayers } from '../../api/fn/player-management/get-all-players';
import {
  getPlayerById,
  GetPlayerById$Params,
} from '../../api/fn/player-management/get-player-by-id';
import {
  createPlayer,
  CreatePlayer$Params,
} from '../../api/fn/player-management/create-player';
import { getLeaderboardStats } from '../../api/fn/player-management/get-leaderboard-stats';
import {
  updatePlayerStats,
  UpdatePlayerStats$Params,
} from '../../api/fn/player-management/update-player-stats';
import {
  resetPlayerStats,
  ResetPlayerStats$Params,
} from '../../api/fn/player-management/reset-player-stats';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private rootUrl = 'http://localhost:8080';

  // player related
  getPlayers(): Observable<PlayerSimplifiedDto[]> {
    return getAllPlayers(this.http, this.rootUrl).pipe(map((res) => res.body));
  }

  getSpecificPlayer(id: number): Observable<Player> {
    const params: GetPlayerById$Params = { id };

    return getPlayerById(this.http, this.rootUrl, params).pipe(
      map((response) => response.body as Player)
    );
  }

  createNewPlayer(player: Player): Observable<Player> {
    const params: CreatePlayer$Params = { body: player };

    return createPlayer(this.http, this.rootUrl, params).pipe(
      map((response) => response.body as Player)
    );
  }

  updateSpecificPlayerStats(
    id: number,
    stats: PlayerStats
  ): Observable<Player> {
    const params: UpdatePlayerStats$Params = { id, body: stats };

    return updatePlayerStats(this.http, this.rootUrl, params).pipe(
      map((response) => response.body as Player)
    );
  }

  resetPlayerStats(id: number): Observable<Player> {
    const params: ResetPlayerStats$Params = { id };

    return resetPlayerStats(this.http, this.rootUrl, params).pipe(
      map((response) => response.body as Player)
    );
  }

  // leaderboard related
  getLeaderboardPlayerStats(): Observable<LeaderboardPlayerStatsDto[]> {
    return getLeaderboardStats(this.http, this.rootUrl).pipe(
      map((response) => response.body as LeaderboardPlayerStatsDto[])
    );
  }
}
