import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterSortDropdownComponent } from './filter-sort-dropdown.component';

describe('FilterSortDropdownComponent', () => {
  let component: FilterSortDropdownComponent;
  let fixture: ComponentFixture<FilterSortDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterSortDropdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterSortDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
