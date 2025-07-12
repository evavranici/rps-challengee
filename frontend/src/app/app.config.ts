import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { leaderboardReducer } from './store/leaderboard/leaderboard.reducer';
import { LeaderboardEffects } from './store/leaderboard/leaderboard.effects';
import { playersReducer } from './store/players/players.reducer';
import { PlayersEffects } from './store/players/players.effects';
import { CurrentPlayerEffects } from './store/current-player/current-player.effects';
import { currentPlayerReducer } from './store/current-player/current-player.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideStore({
      leaderboard: leaderboardReducer,
      players: playersReducer,
      currentPlayer: currentPlayerReducer,
    }),
    provideEffects([
      LeaderboardEffects,
      PlayersEffects,
      CurrentPlayerEffects,
    ]),
  ]
};
