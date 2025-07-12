import { Injectable } from '@angular/core';
import { allChoices, ChoiceDefinition, GameChoice, GameMode, modeChoices } from '../interfaces/player.interface';

@Injectable({
  providedIn: 'root'
})
export class GameConfigService {
  private mode: GameMode = GameMode.Classic; // you can set the mode here

  constructor() { }

  get choices() {
    return this.getGameConfig(this.mode).choices;
  }

  get choiceKeys() {
    return this.getGameConfig(this.mode).choiceKeys;
  }

  setMode(mode: GameMode) {
    this.mode = mode;
  }

  getMode(): GameMode {
    return this.mode;
  }

  getGameConfig(mode: GameMode) {
    const keys = modeChoices[mode];
    const filteredChoices: Record<GameChoice, ChoiceDefinition> = {} as any;

    for (const key of keys) {
      filteredChoices[key] = allChoices[key];
    }

    return {
      choices: filteredChoices,
      choiceKeys: keys
    };
  }
}
