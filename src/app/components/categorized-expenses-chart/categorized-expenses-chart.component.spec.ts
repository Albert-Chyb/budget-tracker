import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorizedExpensesChartComponent } from './categorized-expenses-chart.component';

describe('CategorizedExpensesChartComponent', () => {
  let component: CategorizedExpensesChartComponent;
  let fixture: ComponentFixture<CategorizedExpensesChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategorizedExpensesChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategorizedExpensesChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
