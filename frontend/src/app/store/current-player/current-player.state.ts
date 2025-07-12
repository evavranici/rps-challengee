import { Player } from '../../shared/interfaces/player.interface';

//  the details of the player selected to play
export interface CurrentPlayerState {
  player: Player | null;
  isLoading: boolean;
  error: any | null;
}

export const initialCurrentPlayerState: CurrentPlayerState = {
  player: null,
  isLoading: false,
  error: null,
};
