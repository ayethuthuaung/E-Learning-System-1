import { Component, AfterViewInit, Input, OnDestroy } from '@angular/core';
import { Chart, ChartType, ChartConfiguration } from 'chart.js/auto';

@Component({
  selector: 'app-admin-chart',
  templateUrl: './admin-chart.component.html',
  styleUrls: ['./admin-chart.component.css']
})
export class AdminChartComponent implements AfterViewInit, OnDestroy {
  @Input() chartType: ChartType = 'bar';
  @Input() chartData: ChartConfiguration['data'] = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [{
      label: 'My First Dataset',
      data: [65, 59, 80, 81, 56, 55, 40],
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

  @Input() chartOptions: ChartConfiguration['options'] = {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  private chartInstance: Chart | null = null;

  constructor() {}

  ngAfterViewInit(): void {
    this.renderChart();
  }

  ngOnDestroy(): void {
    // Ensure the chart instance is destroyed when the component is destroyed
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  }

  renderChart(): void {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;

    // Destroy any existing chart instance to prevent "Canvas is already in use" error
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    // Create new chart instance
    this.chartInstance = new Chart(ctx, {
      type: this.chartType,
      data: this.chartData,
      options: this.chartOptions
    });
  }
}
