import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodChartTooltipComponent } from './period-chart-tooltip.component';

describe('PeriodChartTooltipComponent', () => {
  let component: PeriodChartTooltipComponent;
  let fixture: ComponentFixture<PeriodChartTooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeriodChartTooltipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeriodChartTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
