import { createAction, props } from '@ngrx/store';
import { LeaderboardPlayerStats } from '../../shared/interfaces/leaderboard.interface';

export const loadLeaderboardStats = createAction(
  '[Leaderboard] Load Leaderboard Stats'
);

export const loadLeaderboardStatsSuccess = createAction(
  '[Leaderboard] Load Leaderboard Stats Success',
  props<{ data: LeaderboardPlayerStats[] }>()
);

export const loadLeaderboardStatsFailure = createAction(
  '[Leaderboard] Load Leaderboard Stats Failure',
  props<{ error: any }>()
);

export const markLeaderboardStale = createAction(
  '[Leaderboard] Mark Leaderboard Stale'
);
