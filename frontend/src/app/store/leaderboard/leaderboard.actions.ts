import { createAction, props } from '@ngrx/store';
import { LeaderboardPlayerStatsDto } from '../../api/models';

export const loadLeaderboardStats = createAction(
  '[Leaderboard] Load Leaderboard Stats'
);

export const loadLeaderboardStatsSuccess = createAction(
  '[Leaderboard] Load Leaderboard Stats Success',
  props<{ data: LeaderboardPlayerStatsDto[] }>()
);

export const loadLeaderboardStatsFailure = createAction(
  '[Leaderboard] Load Leaderboard Stats Failure',
  props<{ error: unknown }>()
);

export const markLeaderboardStale = createAction(
  '[Leaderboard] Mark Leaderboard Stale'
);
