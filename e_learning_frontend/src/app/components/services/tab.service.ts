import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TabService {
  private activeTab: string = 'createModule';

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  getActiveTab() {
    return this.activeTab;
  }
}
