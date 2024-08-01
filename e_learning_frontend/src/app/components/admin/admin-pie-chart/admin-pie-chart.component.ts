import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-admin-pie-chart',
  templateUrl: './admin-pie-chart.component.html',
  styleUrl: './admin-pie-chart.component.css'
})
export class AdminPieChartComponent implements AfterViewInit, OnDestroy{
  private chartInstance: Chart | null = null;
  private baseColors: string[] = [
    '#007bff', // Blue
    '#ff69b4', // Pink
    '#28a745', // Green
    '#fd7e14', // Orange
    '#ffc107',  // Yellow
    '#fffff',
    '#3085d6'
  ];
  private usedColors: Set<string> = new Set();

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
        backgroundColor: labels.map(() => this.getUniqueColor()),
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

  private getUniqueColor(): string {
    // Check if all base colors are used
    if (this.usedColors.size >= this.baseColors.length) {
      throw new Error('No more colors available.');
    }

    // Get a random base color if not all have been used
    let color: string;
    do {
      color = this.baseColors[Math.floor(Math.random() * this.baseColors.length)];
    } while (this.usedColors.has(color));
    
    this.usedColors.add(color);

    // Generate a light variant if needed
    if (this.usedColors.size > this.baseColors.length) {
      color = this.getLightColorVariant(color);
    }
    
    return color;
  }

  private getLightColorVariant(baseColor: string): string {
    const color = baseColor.substring(1); // Remove #
    const rgb = parseInt(color, 16); // Convert hex to RGB
    const r = (rgb >> 16) & 0xff; // Red
    const g = (rgb >> 8) & 0xff;  // Green
    const b = (rgb >> 0) & 0xff;  // Blue

    // Adjust brightness for light color
    const adjustment = 0.5; // 50% lighter
    const newR = Math.min(255, Math.floor(r + (255 - r) * adjustment));
    const newG = Math.min(255, Math.floor(g + (255 - g) * adjustment));
    const newB = Math.min(255, Math.floor(b + (255 - b) * adjustment));

    return `rgb(${newR},${newG},${newB})`;
  }
}

