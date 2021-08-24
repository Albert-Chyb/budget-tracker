import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewWalletDialogComponent } from './new-wallet-dialog.component';

describe('NewWalletDialogComponent', () => {
  let component: NewWalletDialogComponent;
  let fixture: ComponentFixture<NewWalletDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewWalletDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewWalletDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
