import { Component, OnInit, OnDestroy } from '@angular/core';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent implements OnInit, OnDestroy {
  acceptedCourseCount: number = 0;
  private pollingInterval: any;
  private pollingIntervalMs: number = 2000;

  constructor(private courseService: CourseService) { }

  ngOnInit(): void {
    this.fetchAcceptedCourseCount();
    this.startPolling();
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }


  private startPolling() {
    this.pollingInterval = setInterval(() => {
      this.fetchAcceptedCourseCount();
    }, this.pollingIntervalMs);
  }

  private stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }


  fetchAcceptedCourseCount() {
    this.courseService.getAllCourses('accept')
      .subscribe(courses => {
        this.acceptedCourseCount = courses.length;
      });
  }

 
}
