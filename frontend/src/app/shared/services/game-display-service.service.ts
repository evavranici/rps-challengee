import { inject, Injectable } from '@angular/core';
import { GameConfigService } from './game-config.service';
import { GameChoice } from '../interfaces/player.interface';

@Injectable({ providedIn: 'root' })
export class GameDisplayService {
  private gameConfig = inject(GameConfigService);

  createChoiceHtml(choice: GameChoice, isPlayer: boolean): string {
    const choices = this.gameConfig.choices;
    const glowClass = isPlayer ? 'selected-player' : 'selected-computer';
    return `<div class="choice-card-display ${glowClass}" style="width: 150px;">
              <div class="w-full h-20 flex items-center justify-center text-6xl">${choices[choice].emoji}</div>
              <p class="text-center font-semibold text-lg mt-2">${choices[choice].name}</p>
            </div>`;
  }

  getHistoryHtml(history: GameChoice[]): string {
    const choices = this.gameConfig.choices;
    return history
      .map(
        (c) =>
          `<span style="font-size: 2em; margin: 0 5px;">${choices[c].emoji}</span>`
      )
      .join('');
  }

  getMostFrequentHtml(history: GameChoice[]): string {
    if (!history || history.length === 0) return '-';
    const countMap = history.reduce((acc, choice) => {
      acc[choice] = (acc[choice] ?? 0) + 1;
      return acc;
    }, {} as Record<GameChoice, number>);
    const mostFrequent = Object.keys(countMap).reduce((a, b) =>
      countMap[a as GameChoice] > countMap[b as GameChoice] ? a : b
    ) as GameChoice;

    const choices = this.gameConfig.choices;
    return `<div class="flex items-center justify-center">
              <span style="font-size: 2.5em;">${choices[mostFrequent].emoji}</span>
              <span class="ml-2">${choices[mostFrequent].name}</span>
            </div>`;
  }
}
