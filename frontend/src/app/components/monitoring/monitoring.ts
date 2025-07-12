import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from '../../shared/pipes/safe-html.pipe';

@Component({
  selector: 'app-monitoring',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe],
  templateUrl: './monitoring.html',
  styleUrls: ['./monitoring.css'],
})
export class Monitoring {
  @Input() title: string = '';
  @Input() winRate: number = 0;
  @Input() mostUsed: string = '-';
  @Input() historyDisplay: string = '';
  @Input() isPlayer: boolean = false;
}
