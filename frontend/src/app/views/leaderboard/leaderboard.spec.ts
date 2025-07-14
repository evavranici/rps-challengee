import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Leaderboard } from './leaderboard';
import { provideMockStore } from '@ngrx/store/testing';

describe('Leaderboard', () => {
  let component: Leaderboard;
  let fixture: ComponentFixture<Leaderboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Leaderboard],
      providers: [provideMockStore()],
    }).compileComponents();

    fixture = TestBed.createComponent(Leaderboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
