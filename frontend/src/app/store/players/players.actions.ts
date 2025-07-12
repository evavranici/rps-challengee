import { createAction, props } from '@ngrx/store';
import { Player } from '../../shared/interfaces/player.interface';

/**
 * Action to initiate loading of players data.
 */
export const loadPlayers = createAction(
  '[Players] Load Players'
);

/**
 * Action dispatched upon successful loading of players data.
 */
export const loadPlayersSuccess = createAction(
  '[Players] Load Players Success',
  props<{ data: Player[] }>()
);

/**
 * Action dispatched when loading of players data fails.
 */
export const loadPlayersFailure = createAction(
  '[Players] Load Players Failure',
  props<{ error: any }>()
);

/**
 * Action to explicitly mark players data as stale.
 */
export const markPlayersStale = createAction(
  '[Players] Mark Players Stale'
);
