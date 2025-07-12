import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Player } from '../../shared/interfaces/player.interface';
import { CustomizedButton } from '../../components/customized-button/customized-button';
import { Store } from '@ngrx/store';
import * as LeaderboardActions from '../../store/leaderboard/leaderboard.actions';
import * as PlayersActions from '../../store/players/players.actions';
import * as PlayersSelectors from '../../store/players/players.selectors';
import { Observable } from 'rxjs';
import { RootState } from '../../store/root.state';

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
  players$: Observable<Player[]>;
  selectedPlayer: Player | null = null;

  constructor(
    private router: Router,
    private store: Store<RootState>,
  ) {
    this.players$ = this.store.select(PlayersSelectors.selectPlayersData);
  }

  ngOnInit(): void {
    this.store.dispatch(PlayersActions.loadPlayers());
    this.store.dispatch(LeaderboardActions.loadLeaderboardStats());
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