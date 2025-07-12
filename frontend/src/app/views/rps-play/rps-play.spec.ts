import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Playground } from './rps-play';

describe('RpsPlay', () => {
  let component: Playground;
  let fixture: ComponentFixture<Playground>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Playground]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Playground);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
