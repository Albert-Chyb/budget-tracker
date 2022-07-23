import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmountDialogComponent } from './amount-dialog.component';

describe('AmountDialogComponent', () => {
  let component: AmountDialogComponent;
  let fixture: ComponentFixture<AmountDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmountDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmountDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
