import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { leaderboardReducer } from './store/leaderboard/leaderboard.reducer';
import { LeaderboardEffects } from './store/leaderboard/leaderboard.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideStore({
      leaderboard: leaderboardReducer
    }),
    provideEffects([
      LeaderboardEffects
    ]),
  ]
};
