// matched the DTO in backend
export interface LeaderboardPlayerStats {
  id: number;
  name: string;
  icon: string;
  winPercentage: number;
  gamesPlayed: number;
  score: number; // the Wilson Score Interval
  rank?: number; // Optional: We'll add this rank in the frontend for display
}