import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodCategoriesPieChartComponent } from './period-categories-pie-chart.component';

describe('PeriodCategoriesPieChartComponent', () => {
  let component: PeriodCategoriesPieChartComponent;
  let fixture: ComponentFixture<PeriodCategoriesPieChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeriodCategoriesPieChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeriodCategoriesPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
