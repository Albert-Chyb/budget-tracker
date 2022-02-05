import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletPickerComponent } from './wallet-picker.component';

describe('WalletPickerComponent', () => {
  let component: WalletPickerComponent;
  let fixture: ComponentFixture<WalletPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalletPickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
