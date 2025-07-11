import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Player } from '../../shared/interfaces/player.interface';
import { CustomizedButton } from '../../components/customized-button/customized-button';
import { PlayerService } from '../../shared/services/player-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CustomizedButton,
  ]
})
export class Home implements OnInit {
  players: Player[] = [];
  selectedPlayer: Player | null = null;

  constructor(
    private router: Router,
    public playerService: PlayerService,
  ) { }

  ngOnInit(): void {
    this.playerService.fetchPlayers();
  }

  selectPlayer(player: Player): void {
    this.selectedPlayer = player;
    this.router.navigate(['/rps-play', this.selectedPlayer.id]);
  }

  goToCreatePlayer(): void {
    this.router.navigate(['/add-player']);
  }

  viewLeaderboard(): void {
    this.router.navigate(['/leaderboard']);
  }
}