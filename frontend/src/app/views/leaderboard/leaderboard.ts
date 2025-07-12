import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { CustomizedButton } from '../../components/customized-button/customized-button';
import { LeaderboardPlayerStats } from '../../shared/interfaces/leaderboard.interface';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { LeaderboardState } from '../../store/leaderboard/leaderboard.state';
import * as LeaderboardSelectors from '../../store/leaderboard/leaderboard.selectors';
import * as LeaderboardActions from '../../store/leaderboard/leaderboard.actions';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.html',
  styleUrls: ['./leaderboard.css'],
  standalone: true,
  imports: [CommonModule, DecimalPipe, CustomizedButton],
})
export class Leaderboard implements OnInit {
  private router = inject(Router);
  private store = inject(Store<LeaderboardState>);

  @Input() showBackBtn: boolean = true;

  leaderboardData$: Observable<LeaderboardPlayerStats[]>;
  isLoading$: Observable<boolean>;
  error$: Observable<unknown>;

  constructor() {
    this.leaderboardData$ = this.store.pipe(
      select(LeaderboardSelectors.selectLeaderboardData)
    );
    this.isLoading$ = this.store.pipe(
      select(LeaderboardSelectors.selectLeaderboardIsLoading)
    );
    this.error$ = this.store.pipe(
      select(LeaderboardSelectors.selectLeaderboardError)
    );
  }

  ngOnInit(): void {
    this.store.dispatch(LeaderboardActions.loadLeaderboardStats());
    console.log('Leaderboard component initialized.');
  }

  backToMenu(): void {
    this.router.navigate(['/']);
  }
}
