import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customized-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customized-button.html',
  styleUrl: './customized-button.css'
})
export class CustomizedButton {
  @Input() text: string = '';
  @Input() disabled: boolean = false;
  @Input() className: string = '';

  @Output() buttonClick = new EventEmitter<void>();

  baseClasses: string = 'btn-action w-full md:w-2/3 mx-auto font-bold py-3 px-6 rounded-lg text-white transition duration-300';
  disabledClasses: string = 'disabled:opacity-50 disabled:cursor-not-allowed';

  onClick(): void {
    if (!this.disabled) {
      this.buttonClick.emit();
    }
  }

  // Getter to combine all classes for ngClass binding
  get combinedClasses(): string {
    return `${this.baseClasses} ${this.className} ${this.disabledClasses}`;
  }
}