import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CurrentPlayerState } from './current-player.state';

export const selectCurrentPlayerState = createFeatureSelector<CurrentPlayerState>('currentPlayer');

export const selectCurrentPlayer = createSelector(
  selectCurrentPlayerState,
  (state: CurrentPlayerState) => state.player
);

export const selectCurrentPlayerIsLoading = createSelector(
  selectCurrentPlayerState,
  (state: CurrentPlayerState) => state.isLoading
);

export const selectCurrentPlayerError = createSelector(
  selectCurrentPlayerState,
  (state: CurrentPlayerState) => state.error
);

export const selectCurrentPlayerStats = createSelector(
  selectCurrentPlayer,
  (player) => player?.stats || null
);
