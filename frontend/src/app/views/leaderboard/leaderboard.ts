import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { CustomizedButton } from '../../components/customized-button/customized-button';
import { LeaderboardService } from '../../shared/services/leaderboard.service';
import { LeaderboardPlayerStats } from '../../shared/interfaces/leaderboard.interface';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.html',
  styleUrls: ['./leaderboard.css'],
  standalone: true,
  imports: [
    CommonModule,
    DecimalPipe,
    CustomizedButton,
  ]
})
export class Leaderboard implements OnInit {
  @Input() showBackBtn: boolean = true;
  leaderboardStats: LeaderboardPlayerStats[] = [];

  constructor(
     private router: Router,
     public leaderboardService: LeaderboardService,
  ) { }

  ngOnInit(): void {
    console.log(this.showBackBtn)
    this.leaderboardService.fetchLeaderboardData();
    console.log('Leaderboard component initialized. Displaying data from service.');
  }

  backToMenu(): void {
    this.router.navigate(['/']);
  }
}