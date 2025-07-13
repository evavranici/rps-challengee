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
import * as PlayersSelectors from './players.selectors';
import * as LeaderboardActions from '../leaderboard/leaderboard.actions';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

@Injectable()
export class PlayersEffects {
  private actions$ = inject(Actions);
  private apiService = inject(ApiService);
  private store = inject(Store<PlayersEffects>);
  private router = inject(Router);

  players$;
  createPlayer$;

  constructor() {
    console.log('[PlayersEffects] Constructor initialized.');

    this.players$ = createEffect(() =>
      this.actions$.pipe(
        tap((action) =>
          console.log('[PlayersEffects] Action received:', action.type)
        ),
        ofType(PlayersActions.loadPlayers),
        withLatestFrom(
          this.store.select(PlayersSelectors.selectPlayersIsStale)
        ),
        filter(([, isStale]) => isStale),
        switchMap(() => {
          console.log('[PlayersEffects] Fetching players from API...');
          return this.apiService.getPlayers().pipe(
            map((data) => PlayersActions.loadPlayersSuccess({ data })),
            catchError((error) =>
              of(PlayersActions.loadPlayersFailure({ error }))
            )
          );
        })
      )
    );

    this.createPlayer$ = createEffect(() =>
      this.actions$.pipe(
        ofType(PlayersActions.createPlayer),
        tap((action) =>
          console.log(
            '[PlayersEffects] Create Player action received:',
            action.player.name
          )
        ),
        switchMap((action) =>
          this.apiService.createNewPlayer(action.player).pipe(
            map((createdPlayer) => {
              console.log(
                '[PlayersEffects] Player created successfully:',
                createdPlayer.name
              );
              // Also dispatch markPlayersStale to ensure the player list is reloaded
              this.store.dispatch(PlayersActions.markPlayersStale());
              this.store.dispatch(LeaderboardActions.markLeaderboardStale());
              this.store.dispatch(LeaderboardActions.loadLeaderboardStats());
              // Navigate to the new player's game page
              this.router.navigate(['/rps-play', createdPlayer.id]);
              return PlayersActions.createPlayerSuccess({
                player: createdPlayer,
              });
            }),
            catchError((error) => {
              console.error('[PlayersEffects] Failed to create player:', error);
              // You might want to show a user-friendly error message here
              return of(PlayersActions.createPlayerFailure({ error }));
            })
          )
        )
      )
    );
  }
}
