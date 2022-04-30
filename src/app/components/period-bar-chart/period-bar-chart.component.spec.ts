import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodBarChartComponent } from './period-bar-chart.component';

describe('PeriodBarChartComponent', () => {
  let component: PeriodBarChartComponent;
  let fixture: ComponentFixture<PeriodBarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeriodBarChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeriodBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
