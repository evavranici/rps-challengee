import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizedButton } from './customized-button';

describe('CustomizedButton', () => {
  let component: CustomizedButton;
  let fixture: ComponentFixture<CustomizedButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomizedButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomizedButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
