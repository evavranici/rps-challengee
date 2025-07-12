// src/app/store/players/players.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { initialPlayersState } from './players.state';
import * as PlayersActions from './players.actions';

export const playersReducer = createReducer(
  initialPlayersState,

  on(PlayersActions.loadPlayers, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(PlayersActions.loadPlayersSuccess, (state, { data }) => ({
    ...state,
    data: data,
    isLoading: false,
    isStale: false,
  })),

  on(PlayersActions.loadPlayersFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error: error,
    isStale: true, // marking data as stale if fetching failed
  })),

  on(PlayersActions.markPlayersStale, (state) => ({
    ...state,
    isStale: true, // explicitly mark data as stale
    data: [],
  }))
);
