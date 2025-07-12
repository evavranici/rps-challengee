import { LeaderboardState } from './leaderboard/leaderboard.state';
import { PlayersState } from './players/players.state';
import { CurrentPlayerState } from './current-player/current-player.state';

// defining the shape of the entire application's NgRx state.
export interface RootState {
  leaderboard: LeaderboardState;
  players: PlayersState;
  currentPlayer: CurrentPlayerState;
}
