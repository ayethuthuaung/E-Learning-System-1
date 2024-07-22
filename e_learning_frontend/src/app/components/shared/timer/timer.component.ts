import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent {
  hours: number | null = null;
  minutes: number | null = null;
  seconds: number | null = null;

  @Output() durationChange = new EventEmitter<string>();

  updateDuration() {
    const duration = `${this.pad(this.hours)}:${this.pad(this.minutes)}:${this.pad(this.seconds)}`;
    console.log(duration);
    this.durationChange.emit(duration);
  }

  pad(value: number | null): string {
    return value !== null ? value.toString().padStart(2, '0') : '00';
  }
}
