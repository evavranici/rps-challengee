//interfaces
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

export interface ChoiceDefinition {
  name: string;
  beats: GameChoice[];
  emoji: string;
}

// constants
export const allChoices: Record<GameChoice, ChoiceDefinition> = {
  rock: { name: 'Rock', beats: ['scissors'], emoji: '✊' },
  paper: { name: 'Paper', beats: ['rock'], emoji: '✋' },
  scissors: { name: 'Scissors', beats: ['paper'], emoji: '✌️' },
  well: { name: 'Well', beats: ['rock', 'scissors'], emoji: '⛲️' }
};

export const modeChoices: Record<GameMode, GameChoice[]> = {
  classic: ['rock', 'paper', 'scissors'],
  extended: ['rock', 'paper', 'scissors', 'well'],
};

// enums
export enum GameMode {
  Classic = 'classic',
  Extended = 'extended',
}

// types
export type GameChoice = 'rock' | 'paper' | 'scissors' | 'well';