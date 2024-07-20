import { AfterViewInit, Component, Input, OnDestroy } from '@angular/core';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';
import { UserCourseService } from '../../services/user-course.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-instructor-course-completion',
  templateUrl: './instructor-course-completion.component.html',
  styleUrl: './instructor-course-completion.component.css'
})
export class InstructorCourseCompletionComponent implements AfterViewInit,OnDestroy{
  @Input() chartType: ChartType = 'line';  // Default to 'line' chart

  private chartInstance: Chart | null = null;
  private courseLabels: string[] = [];
  private courseAttendanceData: { [courseName: string]: number } = {};

  constructor(
    private userCourseService: UserCourseService,
    private authService: AuthService // Assuming AuthService provides instructor's ID
  ) {}

  ngAfterViewInit(): void {
    const instructorId = this.authService.getLoggedInUserId(); // Replace with actual method to get instructor's ID
    this.userCourseService.getCourseAttendanceByInstructor(instructorId).subscribe(
      data => {
        this.courseAttendanceData = data;
        this.courseLabels = Object.keys(this.courseAttendanceData);
        this.renderChart();
      },
      error => {
        console.error('Error fetching course attendance:', error);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  }

  renderChart(): void {
    const ctx = document.getElementById('lineChart') as HTMLCanvasElement;

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const dataset = {
      label: 'Course Attendance Percentage',
      data: Object.values(this.courseAttendanceData),
      fill: false,
      borderColor: this.getRandomColor(),
      tension: 0.1
    };

    const chartData: ChartConfiguration['data'] = {
      labels: this.courseLabels,
      datasets: [dataset]
    };

    const chartOptions: ChartConfiguration['options'] = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 10
          }
        }
      }
    };

    this.chartInstance = new Chart(ctx, {
      type: this.chartType,
      data: chartData,
      options: chartOptions
    });
  }

  private getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
