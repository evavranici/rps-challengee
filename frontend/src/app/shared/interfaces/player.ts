export interface Player {
  id: number | null;
  name: string;
  icon: string;
  stats: PlayerStats;
}

export interface PlayerStats {
  playerScore: number;
  computerScore: number;
  playerWins: number;
  computerWins: number;
  playerHistory: [];
  computerHistory: [];
  totalRounds: number;
}