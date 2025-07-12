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
import * as PlayersActions from './players.actions';
import * as LeaderboardSelectors from './players.selectors';
import { Store } from '@ngrx/store';

@Injectable()
export class PlayersEffects {
  private actions$ = inject(Actions);
  private apiService = inject(ApiService);
  private store = inject(Store<PlayersEffects>);

  players$;

  constructor() {
    console.log('[PlayersEffects] Constructor initialized.');

    this.players$ = createEffect(() =>
      this.actions$.pipe(
        tap((action) =>
          console.log('[PlayersEffects] Action received:', action.type)
        ),
        ofType(PlayersActions.loadPlayers),
        withLatestFrom(
          this.store.select(LeaderboardSelectors.selectPlayersIsStale)
        ),
        filter(([, isStale]) => isStale),
        switchMap(() => {
          console.log('[PlayersEffects] Fetching players from API...');
          return this.apiService.getAllPlayers().pipe(
            map((data) => PlayersActions.loadPlayersSuccess({ data })),
            catchError((error) =>
              of(PlayersActions.loadPlayersFailure({ error }))
            )
          );
        })
      )
    );
  }
}
