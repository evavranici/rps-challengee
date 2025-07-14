import { Injectable } from '@angular/core';

const ANIMATION_DELAY_INITIAL = 50;
const ANIMATION_DELAY_SHOW_MOVES = 500;
const ANIMATION_DELAY_VANISH = 2000;
const ANIMATION_DURATION_SHAKE = 500;

@Injectable({ providedIn: 'root' })
export class GameAnimationService {
  delay(ms: number): Promise<void> {
    return new Promise((res) => setTimeout(res, ms));
  }

  async playAnimation(
    winner: 'player' | 'computer' | 'tie',
    playerEl: HTMLElement,
    computerEl: HTMLElement,
    gameArenaEl: HTMLElement,
    onFinish: () => void
  ): Promise<void> {
    this.clearAnimations(playerEl, computerEl, gameArenaEl);

    if (winner === 'tie') {
      await this.handleTieAnimation(gameArenaEl);
      onFinish();
      return;
    }

    const [winningEl, losingEl] =
      winner === 'player' ? [playerEl, computerEl] : [computerEl, playerEl];

    await this.delay(ANIMATION_DELAY_INITIAL);
    gameArenaEl.style.transform = 'scale(1.05)';

    await this.delay(ANIMATION_DELAY_SHOW_MOVES);
    this.applyMoveAnimations(winningEl, playerEl, computerEl);

    await this.delay(ANIMATION_DELAY_VANISH - ANIMATION_DELAY_SHOW_MOVES);
    this.applyVanishAnimation(losingEl, gameArenaEl);

    onFinish();
  }

  applyMoveAnimations(
    winningEl: HTMLElement,
    playerEl: HTMLElement,
    computerEl: HTMLElement
  ): void {
    winningEl.classList.add('show-in-front');
    playerEl.classList.add('player-moves');
    computerEl.classList.add('computer-moves');
  }

  async handleTieAnimation(gameArenaEl: HTMLElement): Promise<void> {
    await this.delay(ANIMATION_DELAY_SHOW_MOVES);
    gameArenaEl.classList.add('shake-animation');

    await this.delay(ANIMATION_DURATION_SHAKE);
    gameArenaEl.classList.remove('shake-animation');
  }

  applyVanishAnimation(losingEl: HTMLElement, gameArenaEl: HTMLElement): void {
    losingEl.classList.add('animate-vanish');
    gameArenaEl.style.transform = 'scale(1)';
  }

  clearAnimations(
    playerEl: HTMLElement,
    computerEl: HTMLElement,
    gameArenaEl: HTMLElement
  ): void {
    gameArenaEl.classList.remove('shake-animation');
    gameArenaEl.style.transform = 'scale(1)';
    playerEl.classList.remove(
      'show-in-front',
      'player-moves',
      'animate-vanish'
    );
    computerEl.classList.remove(
      'show-in-front',
      'computer-moves',
      'animate-vanish'
    );
  }
}
