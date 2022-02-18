import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginatedTransactionsTableComponent } from './paginated-transactions-table.component';

describe('PaginatedTransactionsTableComponent', () => {
  let component: PaginatedTransactionsTableComponent;
  let fixture: ComponentFixture<PaginatedTransactionsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaginatedTransactionsTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginatedTransactionsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
