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

    console.log(duration);
    
    this.durationChange.emit(duration);
  }

  pad(value: number): string {
    console.log(value);

    return value.toString().padStart(2, '0');
  }

  ngOnChanges() {
    console.log("Hi");
    
    this.updateDuration();
  }
}
