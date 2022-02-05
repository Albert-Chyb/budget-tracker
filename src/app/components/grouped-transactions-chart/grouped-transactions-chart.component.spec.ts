import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupedTransactionsChartComponent } from './grouped-transactions-chart.component';

describe('GroupedTransactionsChartComponent', () => {
  let component: GroupedTransactionsChartComponent;
  let fixture: ComponentFixture<GroupedTransactionsChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupedTransactionsChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupedTransactionsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
