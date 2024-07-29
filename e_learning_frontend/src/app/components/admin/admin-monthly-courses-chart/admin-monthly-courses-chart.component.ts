import { AfterViewInit, Component, Input, OnDestroy } from '@angular/core';
import { UserCourseService } from '../../services/user-course.service';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-admin-monthly-courses-chart',
  templateUrl: './admin-monthly-courses-chart.component.html',
  styleUrls: ['./admin-monthly-courses-chart.component.css']
})
export class AdminMonthlyCoursesChartComponent implements AfterViewInit, OnDestroy {
  @Input() chartType: ChartType = 'bar';
  selectedStepSize: number = 1;

  private chartInstance: Chart | null = null;
  private labels: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  private data: number[] = new Array(12).fill(0); // Initialize with zeros

  constructor(private userCourseService: UserCourseService) {}

  ngAfterViewInit(): void {
    this.userCourseService.getMonthlyStudentCounts().subscribe(data => {
      // Reset data to zeros
      this.data = new Array(12).fill(0);

      // Populate data with counts
      Object.entries(data).forEach(([month, count]) => {
        const monthIndex = this.labels.indexOf(month);
        if (monthIndex !== -1) {
          this.data[monthIndex] = count;
        }
      });

      this.renderChart();
    });
  }

  ngOnDestroy(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  }

  onStepSizeChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.selectedStepSize = +value;
    this.renderChart();
  }

  renderChart(): void {
    const ctx = document.getElementById('barChart') as HTMLCanvasElement;

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const chartData: ChartConfiguration['data'] = {
      labels: this.labels,
      datasets: [{
        label: 'Monthly Student Count',
        data: this.data,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1
      }]
    };

    const chartOptions: ChartConfiguration['options'] = {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y', // Set the index axis to 'y' for horizontal bar chart
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            stepSize: this.selectedStepSize
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
