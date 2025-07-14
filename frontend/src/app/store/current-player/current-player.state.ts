import { Player } from '../../api/models';
import { newPlayer } from '../../shared/interfaces/player.interface';

//  the details of the player selected to play
export interface CurrentPlayerState {
  player: Player;
  isLoading: boolean;
  error: unknown | null;
}

export const initialCurrentPlayerState: CurrentPlayerState = {
  player: newPlayer,
  isLoading: false,
  error: null,
};
