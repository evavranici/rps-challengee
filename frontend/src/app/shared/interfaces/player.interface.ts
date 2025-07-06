import { GameChoice } from "../../views/rps-play/rps-play"; // Stores 'rock', 'paper', 'scissors' choices

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
  playerHistory:  GameChoice[];
  computerHistory: GameChoice[];
  totalRounds: number;
}