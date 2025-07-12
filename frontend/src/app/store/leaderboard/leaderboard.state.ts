// src/app/store/leaderboard/leaderboard.state.ts
import { LeaderboardPlayerStats } from '../../shared/interfaces/leaderboard.interface';

export const leaderboardFeatureKey = 'leaderboard';

export interface LeaderboardState {
  data: LeaderboardPlayerStats[];
  isLoading: boolean;
  error: any | null;
  isStale: boolean; // if the cached data is considered stale and needs refetching
}

export const initialLeaderboardState: LeaderboardState = {
  data: [],
  isLoading: false,
  error: null,
  isStale: true, // initially is stale, so it will be fetched on first load
};