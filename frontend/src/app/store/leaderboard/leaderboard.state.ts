import { LeaderboardPlayerStatsDto } from '../../api/models';

export const leaderboardFeatureKey = 'leaderboard';

export interface LeaderboardState {
  data: LeaderboardPlayerStatsDto[];
  isLoading: boolean;
  error: unknown | null;
  isStale: boolean; // if the cached data is considered stale and needs refetching
}

export const initialLeaderboardState: LeaderboardState = {
  data: [],
  isLoading: false,
  error: null,
  isStale: true, // initially it's stale, so it will be fetched on first load
};
