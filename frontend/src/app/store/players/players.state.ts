import { PlayerSimplifiedDto } from '../../api/models';

export interface PlayersState {
  data: PlayerSimplifiedDto[];
  isLoading: boolean;
  error: unknown | null;
  isStale: boolean;
}

export const initialPlayersState: PlayersState = {
  data: [],
  isLoading: false,
  error: null,
  isStale: true,
};
