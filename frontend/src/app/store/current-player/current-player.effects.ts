// src/app/store/current-player/current-player.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ApiService } from '../../shared/services/api.service';
import * as CurrentPlayerActions from './current-player.actions';
import * as LeaderboardActions from '../leaderboard/leaderboard.actions';
import { Store } from '@ngrx/store';
import { RootState } from '../root.state';

@Injectable()
export class CurrentPlayerEffects {
  loadCurrentPlayer$;
  updateCurrentPlayerStats$;
  resetCurrentPlayerStats$;

  constructor(
    private actions$: Actions,
    private apiService: ApiService,
    private store: Store<RootState>,
  ) {
      // load the current player's data
      this.loadCurrentPlayer$ = createEffect(() =>
        this.actions$.pipe(
          ofType(CurrentPlayerActions.loadCurrentPlayer),
          tap(action => console.log('[CurrentPlayerEffects] Load Current Player action received:', action.playerId)),
          switchMap(action =>
            this.apiService.getPlayerById(action.playerId).pipe(
              map(player => CurrentPlayerActions.loadCurrentPlayerSuccess({ player })),
              catchError(error => {
                console.error('[CurrentPlayerEffects] Failed to load current player:', error);
                return of(CurrentPlayerActions.loadCurrentPlayerFailure({ error }));
              })
            )
          )
        )
      );

      // update the current player's stats
      this.updateCurrentPlayerStats$ = createEffect(() =>
        this.actions$.pipe(
          ofType(CurrentPlayerActions.updateCurrentPlayerStats),
          tap(action => console.log('[CurrentPlayerEffects] Update Current Player Stats action received:', action.playerId, action.stats)),
          switchMap(action =>
            this.apiService.updatePlayerStats(action.playerId, action.stats).pipe(
              map(player => {
                // on a successful player stats update, dispatch success action & mark leaderboard as stale and trigger its reload
                this.store.dispatch(LeaderboardActions.markLeaderboardStale());
                this.store.dispatch(LeaderboardActions.loadLeaderboardStats());
                return CurrentPlayerActions.updateCurrentPlayerStatsSuccess({ player });
              }),
              catchError(error => {
                console.error('[CurrentPlayerEffects] Failed to update current player stats:', error);
                return of(CurrentPlayerActions.updateCurrentPlayerStatsFailure({ error }));
              })
            )
          )
        )
      );

      // reset the current player's stats
      this.resetCurrentPlayerStats$ = createEffect(() =>
        this.actions$.pipe(
          ofType(CurrentPlayerActions.resetCurrentPlayerStats),
          tap(action => console.log('[CurrentPlayerEffects] Reset Current Player Stats action received:', action.playerId)),
          switchMap(action =>
            this.apiService.resetPlayerStats(action.playerId).pipe(
              map(player => {
                // on a successful player stats reset, dispatch success action & mark leaderboard as stale and trigger its reload
                this.store.dispatch(LeaderboardActions.markLeaderboardStale());
                this.store.dispatch(LeaderboardActions.loadLeaderboardStats());
                return CurrentPlayerActions.resetCurrentPlayerStatsSuccess({ player });
              }),
              catchError(error => {
                console.error('[CurrentPlayerEffects] Failed to reset current player stats:', error);
                return of(CurrentPlayerActions.resetCurrentPlayerStatsFailure({ error }));
              })
            )
          )
        )
      );
  }
}
