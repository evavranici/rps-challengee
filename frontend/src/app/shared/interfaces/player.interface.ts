import { GameChoice } from "../../views/rps-play/rps-play";

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
  playerHistory:  GameChoice[]; // Stores 'rock', 'paper', 'scissors' choices
  computerHistory: GameChoice[]; // Stores 'rock', 'paper', 'scissors' choices
  totalRounds: number;
}