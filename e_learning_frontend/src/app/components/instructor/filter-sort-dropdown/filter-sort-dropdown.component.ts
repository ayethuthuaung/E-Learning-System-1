import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-filter-sort-dropdown',
  templateUrl: './filter-sort-dropdown.component.html',
  styleUrls: ['./filter-sort-dropdown.component.css']
})
export class FilterSortDropdownComponent {
  @Input() filterKey: string = '';
  dropdownOpen = false;
  filterTerm: string = '';

  @Output() sortChanged = new EventEmitter<string>();
  @Output() filterChanged = new EventEmitter<{ key: string, term: string }>();

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  sort(direction: string) {
    this.sortChanged.emit(direction);
  }
  

  onFilterChange(event: any) {
    this.filterTerm = event.target.value;
    this.filterChanged.emit({ key: this.filterKey, term: this.filterTerm });
  }
  
}
