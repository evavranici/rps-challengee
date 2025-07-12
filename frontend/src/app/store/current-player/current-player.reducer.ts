import { createReducer, on } from '@ngrx/store';
import { initialCurrentPlayerState } from './current-player.state';
import * as CurrentPlayerActions from './current-player.actions';

export const currentPlayerReducer = createReducer(
  initialCurrentPlayerState,

  // loading current player
  on(CurrentPlayerActions.loadCurrentPlayer, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(CurrentPlayerActions.loadCurrentPlayerSuccess, (state, { player }) => ({
    ...state,
    player: player,
    isLoading: false,
    error: null,
  })),
  on(CurrentPlayerActions.loadCurrentPlayerFailure, (state, { error }) => ({
    ...state,
    player: null, // clear player on failure
    isLoading: false,
    error: error,
  })),

  // updating current player stats
  on(CurrentPlayerActions.updateCurrentPlayerStats, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(
    CurrentPlayerActions.updateCurrentPlayerStatsSuccess,
    (state, { player }) => ({
      ...state,
      player: player,
      isLoading: false,
      error: null,
    })
  ),
  on(
    CurrentPlayerActions.updateCurrentPlayerStatsFailure,
    (state, { error }) => ({
      ...state,
      isLoading: false,
      error: error,
    })
  ),

  // resetting current player stats
  on(CurrentPlayerActions.resetCurrentPlayerStats, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(
    CurrentPlayerActions.resetCurrentPlayerStatsSuccess,
    (state, { player }) => ({
      ...state,
      player: player,
      isLoading: false,
      error: null,
    })
  ),
  on(
    CurrentPlayerActions.resetCurrentPlayerStatsFailure,
    (state, { error }) => ({
      ...state,
      isLoading: false,
      error: error,
    })
  ),

  // clearing current player
  on(CurrentPlayerActions.clearCurrentPlayer, () => ({
    ...initialCurrentPlayerState, // Reset to initial state (null)
  }))
);
