import { AfterViewInit, Component, Input, OnDestroy } from '@angular/core';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';
import { CourseModuleService } from '../../services/course-module.service';

@Component({
  selector: 'app-admin-course-completion',
  templateUrl: './admin-course-completion.component.html',
  styleUrls: ['./admin-course-completion.component.css']
})
export class AdminCourseCompletionComponent implements AfterViewInit, OnDestroy {
  @Input() chartType: ChartType = 'line';  // Default to 'line' chart

  private chartInstance: Chart | null = null;
  private studentLabels: string[] = [];
  private courseLabels: string[] = [];
  private studentProgressData: { [studentName: string]: { [courseName: string]: number } } = {};
  private courseProgressData: { [courseName: string]: { [studentName: string]: number } } = {};

  constructor(private courseModuleService: CourseModuleService) {}

  ngAfterViewInit(): void {
    this.courseModuleService.getAllStudentsProgress().subscribe(
      data => {
        this.studentProgressData = data;
        this.courseLabels = Object.keys(this.studentProgressData[Object.keys(this.studentProgressData)[0]]);

        this.renderChart();
      },
      error => {
        console.error('Error fetching student progress:', error);
      }
    );

    this.courseModuleService.getAllCoursesProgress().subscribe(
      data => {
        this.courseProgressData = data;
        this.studentLabels = Object.keys(this.courseProgressData[Object.keys(this.courseProgressData)[0]]);

        this.renderChart();
      },
      error => {
        console.error('Error fetching course progress:', error);
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

    const datasets = this.chartType === 'line'
      ? Object.keys(this.studentProgressData).map(studentName => ({
          label: studentName,
          data: Object.values(this.studentProgressData[studentName]),
          fill: false,
          borderColor: this.getRandomColor(),
          tension: 0.1
        }))
      : Object.keys(this.courseProgressData).map(courseName => ({
          label: courseName,
          data: Object.values(this.courseProgressData[courseName]),
          fill: false,
          borderColor: this.getRandomColor(),
          tension: 0.1
        }));

    const chartData: ChartConfiguration['data'] = {
      labels: this.chartType === 'line' ? this.courseLabels : this.studentLabels,
      datasets: datasets
    };

    const chartOptions: ChartConfiguration['options'] = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 5
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
