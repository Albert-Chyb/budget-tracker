import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginatedFirestoreCollectionTableComponent } from './paginated-firestore-collection-table.component';

describe('PaginatedFirestoreCollectionTableComponent', () => {
  let component: PaginatedFirestoreCollectionTableComponent;
  let fixture: ComponentFixture<PaginatedFirestoreCollectionTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaginatedFirestoreCollectionTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginatedFirestoreCollectionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
