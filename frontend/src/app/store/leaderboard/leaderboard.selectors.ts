import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LeaderboardState } from './leaderboard.state';

export const selectLeaderboardState = createFeatureSelector<LeaderboardState>('leaderboard');

export const selectLeaderboardData = createSelector(
  selectLeaderboardState,
  (state) => state.data
);

export const selectLeaderboardIsLoading = createSelector(
  selectLeaderboardState,
  (state) => state.isLoading
);

export const selectLeaderboardError = createSelector(
  selectLeaderboardState,
  (state) => state.error
);

export const selectLeaderboardIsStale = createSelector(
  selectLeaderboardState,
  (state: LeaderboardState) => state.isStale
);