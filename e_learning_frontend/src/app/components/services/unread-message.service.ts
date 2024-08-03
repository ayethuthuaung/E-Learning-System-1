import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnreadMessageService {
  private unreadMessageCountSubject = new BehaviorSubject<number>(0);
  unreadMessageCount$ = this.unreadMessageCountSubject.asObservable();

  private unreadNotiCountSubject = new BehaviorSubject<number>(0);
  unreadNotiCount$ = this.unreadNotiCountSubject.asObservable();

  setUnreadMessageCount(count: number): void {
    this.unreadMessageCountSubject.next(count);
  }
  
  clearUnreadMessageCount() {
    this.unreadMessageCountSubject.next(0);
  }

  getUnreadMessageCount() {
    return this.unreadMessageCountSubject.asObservable();
  }
  setUnreadNotiCount(count: number): void {
    this.unreadNotiCountSubject.next(count);
  }
  clearUnreadNotiCount() {
    this.unreadNotiCountSubject.next(0);
  }

  getUnreadNotiCount() {
    return this.unreadNotiCountSubject.asObservable();
  }
}