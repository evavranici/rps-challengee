import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameChoice } from '../../shared/interfaces/player.interface';

@Component({
  selector: 'app-card-choice',
  imports: [CommonModule],
  templateUrl: './card-choice.html',
  styleUrl: './card-choice.css'
})
export class CardChoice {
  @Input() id!: string;
  @Input() choiceKey!: GameChoice;
  @Input() emoji!: string;
  @Input() name!: string;
  @Input() rule!: string;
  @Input() isDisabled: boolean = false;

  @Output() choiceMade = new EventEmitter<GameChoice>();

   makeChoice(): void {
    if (!this.isDisabled) {
      this.choiceMade.emit(this.choiceKey);
    }
  }
}
