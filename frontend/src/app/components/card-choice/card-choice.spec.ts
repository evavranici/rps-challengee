import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardChoice } from './card-choice';

describe('CardChoice', () => {
  let component: CardChoice;
  let fixture: ComponentFixture<CardChoice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardChoice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardChoice);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
