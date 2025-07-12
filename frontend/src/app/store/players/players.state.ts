import { Player } from "../../shared/interfaces/player.interface";

export interface PlayersState {
  data: Player[];
  isLoading: boolean;
  error: any | null;
  isStale: boolean;
}

export const initialPlayersState: PlayersState = {
  data: [],
  isLoading: false,
  error: null,
  isStale: true,
};
