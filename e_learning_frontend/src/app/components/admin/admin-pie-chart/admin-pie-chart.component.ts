import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-admin-pie-chart',
  templateUrl: './admin-pie-chart.component.html',
  styleUrls: ['./admin-pie-chart.component.css']
})
export class AdminPieChartComponent implements AfterViewInit, OnDestroy {
  private chartInstance: Chart | null = null;

  constructor(private categoryService: CategoryService) {}

  ngAfterViewInit(): void {
    this.categoryService.getCourseCountsPerCategory().subscribe(data => {
      const labels = Object.keys(data);
      const counts = Object.values(data);
      this.renderChart(labels, counts);
    });
  }

  ngOnDestroy(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  }

  renderChart(labels: string[], data: number[]): void {
    const ctx = document.getElementById('pieChart') as HTMLCanvasElement;

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const chartData: ChartConfiguration['data'] = {
      labels,
      datasets: [{
        data,
        backgroundColor: labels.map(() => this.generateColor()),
        borderColor: 'rgba(255, 255, 255, 1)',
        borderWidth: 1
      }]
    };

    const chartOptions: ChartConfiguration['options'] = {
      responsive: true,
      maintainAspectRatio: false,
    };

    this.chartInstance = new Chart(ctx, {
      type: 'pie' as ChartType,
      data: chartData,
      options: chartOptions
    });
  }

  private generateColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
