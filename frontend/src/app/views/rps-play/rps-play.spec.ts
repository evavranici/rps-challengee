import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RpsPlay } from './rps-play';

describe('RpsPlay', () => {
  let component: RpsPlay;
  let fixture: ComponentFixture<RpsPlay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RpsPlay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RpsPlay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
