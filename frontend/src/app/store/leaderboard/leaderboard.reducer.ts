import { createReducer, on } from '@ngrx/store';
import { initialLeaderboardState } from './leaderboard.state';
import * as LeaderboardActions from './leaderboard.actions';

export const leaderboardReducer = createReducer(
  initialLeaderboardState,
  on(LeaderboardActions.loadLeaderboardStats, (state) => {
    const newState = {
      ...state,
      isLoading: true,
      error: null,
    };
    return newState;
  }),
  on(LeaderboardActions.loadLeaderboardStatsSuccess, (state, { data }) => ({
    ...state,
    data: data.map((player, index) => ({ ...player, rank: index + 1 })),
    isLoading: false,
    error: null,
    isStale: false, // marking data as fresh
  })),
  on(LeaderboardActions.loadLeaderboardStatsFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error: error,
    isStale: false, // marking data as fresh
  })),
  on(LeaderboardActions.markLeaderboardStale, (state) => ({
    ...state,
    isStale: true, // Explicitly mark data as stale so that it can be refetched on next try
  }))
);