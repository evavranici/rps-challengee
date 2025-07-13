import { Player } from '../../api/models';

//  the details of the player selected to play
export interface CurrentPlayerState {
  player: Player | null;
  isLoading: boolean;
  error: unknown | null;
}

export const initialCurrentPlayerState: CurrentPlayerState = {
  player: null,
  isLoading: false,
  error: null,
};
