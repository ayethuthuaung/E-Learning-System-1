import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-filter-sort-dropdown',
  templateUrl: './filter-sort-dropdown.component.html',
  styleUrls: ['./filter-sort-dropdown.component.css']
})
export class FilterSortDropdownComponent {
  @Input() filterKey: string = '';
  @Input() availableNames: string[] = [];
  dropdownOpen = false;
  filterTerm: string = '';
  selectedNames: Set<string> = new Set();

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
  onCheckboxChange(event: any, name: string) {
    if (event.target.checked) {
      this.selectedNames.add(name);
    } else {
      this.selectedNames.delete(name);
    }
    this.filterChanged.emit({ key: this.filterKey, term: Array.from(this.selectedNames).join(',') });
  }

  isSelected(name: string): boolean {
    return this.selectedNames.has(name);
  }
}
