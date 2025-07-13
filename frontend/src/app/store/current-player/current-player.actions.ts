import { createAction, props } from '@ngrx/store';
import { Player, PlayerStats } from '../../api/models';

export const loadCurrentPlayer = createAction(
  '[Current Player] Load Current Player',
  props<{ playerId: number }>()
);

export const loadCurrentPlayerSuccess = createAction(
  '[Current Player] Load Current Player Success',
  props<{ player: Player }>()
);

export const loadCurrentPlayerFailure = createAction(
  '[Current Player] Load Current Player Failure',
  props<{ error: unknown }>()
);

export const updateCurrentPlayerStats = createAction(
  '[Current Player] Update Current Player Stats',
  props<{ playerId: number; stats: PlayerStats }>()
);

export const updateCurrentPlayerStatsSuccess = createAction(
  '[Current Player] Update Current Player Stats Success',
  props<{ player: Player }>()
);

export const updateCurrentPlayerStatsFailure = createAction(
  '[Current Player] Update Current Player Stats Failure',
  props<{ error: unknown }>()
);

export const resetCurrentPlayerStats = createAction(
  '[Current Player] Reset Current Player Stats',
  props<{ playerId: number }>()
);

export const resetCurrentPlayerStatsSuccess = createAction(
  '[Current Player] Reset Current Player Stats Success',
  props<{ player: Player }>()
);

export const resetCurrentPlayerStatsFailure = createAction(
  '[Current Player] Reset Current Player Stats Failure',
  props<{ error: unknown }>()
);

export const clearCurrentPlayer = createAction(
  '[Current Player] Clear Current Player'
);
