import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home} from './views/home/home';
import { AddPlayer } from './views/add-player/add-player';
import { Leaderboard } from './views/leaderboard/leaderboard';
import { Playground } from './views/rps-play/rps-play';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'add-player', component: AddPlayer },
  { path: 'leaderboard', component: Leaderboard },
  { path: 'rps-play/:id', component: Playground },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }