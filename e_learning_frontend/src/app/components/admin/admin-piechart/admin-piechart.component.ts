import { Component, OnInit } from '@angular/core';
declare var CanvasJS: any;

@Component({
  selector: 'app-admin-piechart',
  templateUrl: './admin-piechart.component.html',
  styleUrls: ['./admin-piechart.component.css']
})
export class AdminPiechartComponent implements OnInit {

  colors: string[] = [
    "#ff9f9f", // Slightly darker pink
    "#ffc686", // Slightly darker peach
    "#fbff8f", // Slightly darker yellow
    "#a3ff9c", // Slightly darker green
    "#7cd7ff", // Slightly darker blue
    "#849bff", // Slightly darker purple
    "#ff9ff4"  // Slightly darker pink
  ];

  // Sample dynamic data
  chartData: { y: number, label: string, color?: string }[] = [
    { y: 15, label: "Inbox", color: this.colors[0] },
    { y: 28, label: "Archives", color: this.colors[1] },
    { y: 10, label: "Labels", color: this.colors[2] },
    { y: 7, label: "Drafts", color: this.colors[3] },
    { y: 15, label: "Trash", color: this.colors[4] },
    { y: 12, label: "AAA", color: this.colors[5] },
    { y: 6, label: "Spam", color: this.colors[6] }
  ];

  constructor() { }

  ngOnInit(): void {
    this.renderChart();
  }

  renderChart(): void {
    var chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      title: {
        text: "Email Categories",
        horizontalAlign: "left"
      },
      data: [{
        type: "doughnut",
        startAngle: 60,
        indexLabelFontSize: 17,
        indexLabel: "{label} - #percent%",
        toolTipContent: "<b>{label}:</b> {y} (#percent%)",
        dataPoints: this.chartData
      }]
    });
    chart.render();
  }

  addField(y: number, label: string): void {
    const colorIndex = this.chartData.length % this.colors.length;
    const newField = { y, label, color: this.colors[colorIndex] };
    this.chartData.push(newField);
    this.renderChart(); // Re-render chart to reflect new data
  }
}
