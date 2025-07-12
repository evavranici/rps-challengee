import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  filter,
  map,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { of } from 'rxjs';
import { ApiService } from '../../shared/services/api.service';
import * as LeaderboardActions from './leaderboard.actions';
import * as LeaderboardSelectors from './leaderboard.selectors';
import { Store } from '@ngrx/store';
import { LeaderboardState } from './leaderboard.state';

@Injectable()
export class LeaderboardEffects {
  private actions$ = inject(Actions);
  private apiService = inject(ApiService);
  private store = inject(Store<LeaderboardState>);

  loadLeaderboardStats$;

  constructor() {
    console.log('[LeaderboardEffects] Constructor initialized.');

    this.loadLeaderboardStats$ = createEffect(() =>
      this.actions$.pipe(
        tap((action) =>
          console.log('[LeaderboardEffects] Action received:', action.type)
        ),
        ofType(LeaderboardActions.loadLeaderboardStats),
        withLatestFrom(
          this.store.select(LeaderboardSelectors.selectLeaderboardIsStale)
        ),
        filter(([, isStale]) => isStale),
        tap(() =>
          console.log(
            '[LeaderboardEffects] loadLeaderboardStats action caught.'
          )
        ),
        switchMap(() => {
          console.log(
            '[LeaderboardEffects] Fetching leaderboard stats from API...'
          );
          return this.apiService.getLeaderboardPlayerStats().pipe(
            map((data) =>
              LeaderboardActions.loadLeaderboardStatsSuccess({ data })
            ),
            catchError((error) =>
              of(LeaderboardActions.loadLeaderboardStatsFailure({ error }))
            )
          );
        })
      )
    );
  }
}
