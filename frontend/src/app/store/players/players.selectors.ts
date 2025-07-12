import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PlayersState } from './players.state';

export const selectPlayersState =
  createFeatureSelector<PlayersState>('players');

// Select the list of players data
export const selectPlayersData = createSelector(
  selectPlayersState,
  (state: PlayersState) => state.data
);

// Select the loading status
export const selectPlayersIsLoading = createSelector(
  selectPlayersState,
  (state: PlayersState) => state.isLoading
);

// Select the error status
export const selectPlayersError = createSelector(
  selectPlayersState,
  (state: PlayersState) => state.error
);

// Select the stale status (used for caching logic in effects)
export const selectPlayersIsStale = createSelector(
  selectPlayersState,
  (state: PlayersState) => state.isStale
);
