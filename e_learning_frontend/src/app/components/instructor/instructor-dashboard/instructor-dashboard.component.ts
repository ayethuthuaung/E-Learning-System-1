import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { CourseService } from '../../services/course.service';
import { UserCourseService } from '../../services/user-course.service';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import { Course } from '../../models/course.model';
import { UserCourse } from '../../models/usercourse.model';

@Component({
  selector: 'app-instructor-dashboard',
  templateUrl: './instructor-dashboard.component.html',
  styleUrls: ['./instructor-dashboard.component.css']
})
export class InstructorDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  isSidebarOpen = true;
  courseCount: number = 0;
  courseNames: string[] = [];
  acceptedStudentCounts: { [courseName: string]: number,  } = {};
  studentCounts: { courseId: number, studentCount: number, acceptedCount: number }[] = [];
  chartInstance: Chart<'bar'> | null = null;
  chartConfig: ChartConfiguration<'bar'> = {
    type: 'bar',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Accepted Student Count',
          data: [],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(250, 210, 210, 0.2)'
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(250, 210, 210)'
          ],
          borderWidth: 1
        }]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          stacked: false,
          beginAtZero: true
        },
        y: {
          stacked: false,
          beginAtZero: true,
          ticks: {
            stepSize: 1 // Ensure y-axis steps are whole numbers
          }
        }
      }
    }
  };

  constructor(
    private authService: AuthService,
    private courseService: CourseService,
    private userCourseService: UserCourseService
  ) {}

  ngOnInit(): void {
    this.loadInstructorCourseCounts();
    this.loadAcceptedStudentCounts();
    this.loadStudentCounts();
  }

  ngAfterViewInit(): void {
    this.renderChart();
  }

  ngOnDestroy(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  private loadInstructorCourseCounts(): void {
    const instructorId = this.authService.getLoggedInUserId();
    this.courseService.getInstructorCourses(instructorId).subscribe(
      (courses: Course[]) => {
        this.courseCount = courses.length;
        this.courseNames = courses.map(course => course.name);
        this.updateChartData();
      },
      (error) => {
        console.error('Error loading courses:', error);
      }
    );
  }
  private loadStudentCounts(): void {
    const instructorId = this.authService.getLoggedInUserId();
    this.userCourseService.getAllUserCourses(instructorId).subscribe(
      (userCourses: UserCourse[]) => {
        const courseCounts = new Map<number, { studentCount: number, acceptedCount: number }>();

        userCourses.forEach(userCourse => {
          const courseId = userCourse.courseId;
          if (!courseCounts.has(courseId)) {
            courseCounts.set(courseId, { studentCount: 0, acceptedCount: 0 });
          }
          const counts = courseCounts.get(courseId)!;
          counts.studentCount++;
          if (userCourse.status === 'Accept') {
            counts.acceptedCount++;
          }
        });

        this.studentCounts = Array.from(courseCounts, ([courseId, counts]) => ({
          courseId,
          ...counts
        }));
      },
      (error) => {
        console.error('Error fetching student counts', error);
      }
    );
  }


  private loadAcceptedStudentCounts(): void {
    this.userCourseService.getAcceptedStudentCounts().subscribe(
      (acceptedStudentCounts: { [courseName: string]: number }) => {
        this.acceptedStudentCounts = acceptedStudentCounts;
        this.updateChartData();
      },
      (error) => {
        console.error('Error fetching accepted student counts', error);
      }
    );
  }

  private updateChartData(): void {
    const acceptedStudentData = this.courseNames.map(name =>
      this.acceptedStudentCounts[name] || 0
    );

    this.chartConfig.data.labels = this.courseNames;
    this.chartConfig.data.datasets[0].data = acceptedStudentData.map(count => Math.round(count)); // Round to nearest integer

    this.renderChart();
  }

  private renderChart(): void {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    this.chartInstance = new Chart(ctx, this.chartConfig);
  }
}
