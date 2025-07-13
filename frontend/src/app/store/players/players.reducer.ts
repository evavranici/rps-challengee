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
  })),
  on(PlayersActions.createPlayer, (state) => ({
    ...state,
    error: null,
  })),

  on(PlayersActions.createPlayerSuccess, (state) => ({
    ...state,
    // Option 1: Add the new player to the current list immediately (optimistic update)
    // data: [...state.data, player],
    // Option 2 (recommended for this scenario): Just mark as stale to trigger a full reload
    isStale: true, // Mark data stale so next loadPlayers fetches the new player
    error: null,
  })),

  on(PlayersActions.createPlayerFailure, (state, { error }) => ({
    ...state,
    error: error,
    // Do not mark stale here, as the list itself might still be valid, only creation failed
  }))
);
