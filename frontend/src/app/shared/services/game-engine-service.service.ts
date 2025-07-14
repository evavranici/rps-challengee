import { inject, Injectable } from '@angular/core';
import { GameConfigService } from './game-config.service';
import { GameChoice, newStats } from '../interfaces/player.interface';
import { Player, PlayerStats } from '../../api/models';

@Injectable({ providedIn: 'root' })
export class GameEngineService {
  private gameConfigService = inject(GameConfigService);

  getComputerChoice(): GameChoice {
    const keys = this.gameConfigService.choiceKeys;
    return keys[Math.floor(Math.random() * keys.length)];
  }

  getWinner(
    player: GameChoice,
    computer: GameChoice
  ): 'player' | 'computer' | 'tie' {
    const choices = this.gameConfigService.choices;
    if (player === computer) return 'tie';
    return choices[player].beats.includes(computer) ? 'player' : 'computer';
  }

  updateStats(
    playerChoice: GameChoice,
    computerChoice: GameChoice,
    winner: 'player' | 'computer' | 'tie',
    player: Player
  ): PlayerStats {
    const updatedStats = player.stats ? { ...player.stats } : { ...newStats };

    // Create a NEW stats object to maintain immutability
    updatedStats.playerHistory = [
      ...updatedStats.playerHistory.slice(-4),
      playerChoice,
    ];
    updatedStats.computerHistory = [
      ...updatedStats.computerHistory.slice(-4),
      computerChoice,
    ];
    updatedStats.totalRounds = (updatedStats.totalRounds ?? 0) + 1;

    if (winner === 'player') {
      updatedStats.playerScore = (updatedStats.playerScore ?? 0) + 1;
    } else if (winner === 'computer') {
      updatedStats.computerScore = (updatedStats.computerScore ?? 0) + 1;
    }

    return updatedStats;
  }
}
