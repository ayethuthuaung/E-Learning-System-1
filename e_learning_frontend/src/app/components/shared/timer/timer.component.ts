import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent {
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;

  @Output() durationChange = new EventEmitter<string>();

  updateDuration() {
    const duration = `${this.pad(this.hours)}:${this.pad(this.minutes)}:${this.pad(this.seconds)}`;  
    this.durationChange.emit(duration);
  }

  pad(value: number): string {
    return value.toString().padStart(2, '0');
  }

  resetTimer() {
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
    this.updateDuration();
  }
}
