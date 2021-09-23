import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalFabComponent } from './global-fab.component';

describe('GlobalFabComponent', () => {
  let component: GlobalFabComponent;
  let fixture: ComponentFixture<GlobalFabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalFabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalFabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
