import { createAction, props } from '@ngrx/store';
import { Player, PlayerSimplifiedDto } from '../../api/models';

/**
 * Action to initiate loading of players data.
 */
export const loadPlayers = createAction('[Players] Load Players');

/**
 * Action dispatched upon successful loading of players data.
 */
export const loadPlayersSuccess = createAction(
  '[Players] Load Players Success',
  props<{ data: PlayerSimplifiedDto[] }>()
);

/**
 * Action dispatched when loading of players data fails.
 */
export const loadPlayersFailure = createAction(
  '[Players] Load Players Failure',
  props<{ error: unknown }>()
);

/**
 * Action to explicitly mark players data as stale.
 */
export const markPlayersStale = createAction('[Players] Mark Players Stale');

export const createPlayer = createAction(
  '[Players] Create Player',
  props<{ player: Player }>()
);

/**
 * Action dispatched upon successful creation of a player.
 */
export const createPlayerSuccess = createAction(
  '[Players] Create Player Success',
  props<{ player: Player }>()
);

/**
 * Action dispatched when creation of a player fails.
 */
export const createPlayerFailure = createAction(
  '[Players] Create Player Failure',
  props<{ error: unknown }>()
);
