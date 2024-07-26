import { Component, AfterViewInit, Input, OnDestroy } from '@angular/core';
import { Chart, ChartType, ChartConfiguration } from 'chart.js/auto';
import { UserCourseService } from '../../services/user-course.service';

@Component({
  selector: 'app-admin-chart',
  templateUrl: './admin-chart.component.html',
  styleUrls: ['./admin-chart.component.css']
})
export class AdminChartComponent implements AfterViewInit, OnDestroy {
  @Input() chartType: ChartType = 'bar';

  private chartInstance: Chart | null = null;
  private courseLabels: string[] = [];
  private courseData: number[] = [];
  private pollingInterval: any;
  private pollingIntervalMs: number = 3000; // 3 seconds

  constructor(private userCourseService: UserCourseService) {}

  ngAfterViewInit(): void {
    this.fetchChartData();
    this.startPolling();
  }

  ngOnDestroy(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
    this.stopPolling();
  }

  private startPolling(): void {
    this.pollingInterval = setInterval(() => {
      this.fetchChartData();
    }, this.pollingIntervalMs);
  }

  private stopPolling(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }

  private fetchChartData(): void {
    this.userCourseService.getAcceptedUserCounts().subscribe(data => {
      this.courseLabels = Object.keys(data);
      this.courseData = Object.values(data);
      this.renderChart();
    });
  }

  renderChart(): void {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const chartData: ChartConfiguration['data'] = {
      labels: this.courseLabels,
      datasets: [{
        label: 'Student Count',
        data: this.courseData,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(201, 203, 207, 0.2)'
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
          'rgb(201, 203, 207)'
        ],
        borderWidth: 1
      }]
    };

    const chartOptions: ChartConfiguration['options'] = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 2
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
}
