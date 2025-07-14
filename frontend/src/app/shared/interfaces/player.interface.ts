import { Player, PlayerStats } from '../../api/models';

//interfaces
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
  well: { name: 'Well', beats: ['rock', 'scissors'], emoji: '⛲️' },
};

export const modeChoices: Record<GameMode, GameChoice[]> = {
  classic: ['rock', 'paper', 'scissors'],
  extended: ['rock', 'paper', 'scissors', 'well'],
};

export const newStats: PlayerStats = {
  playerScore: 0,
  computerScore: 0,
  playerWins: 0,
  computerWins: 0,
  playerHistory: [],
  computerHistory: [],
  totalRounds: 0,
};

export const newPlayer: Player = {
  id: undefined,
  name: '',
  icon: '',
  stats: newStats,
};

// enums
export enum GameMode {
  Classic = 'classic',
  Extended = 'extended',
}

// types
export type GameChoice = 'rock' | 'paper' | 'scissors' | 'well';
