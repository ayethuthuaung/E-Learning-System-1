import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { CourseService } from '../../services/course.service';
import { UserCourseService } from '../../services/user-course.service';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import { Course } from '../../models/course.model';
import { UserCourse } from '../../models/usercourse.model';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

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
  instructorCount: number = 0;
  activeUserCount: number = 0;
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
      layout: {
        padding: {
          left: 25, // Adjust this value for space on the left side of the chart
          right: 25, // Adjust this value for space on the right side of the chart
          top: 25, // Optional: Adjust top padding if needed
          bottom: 25 // Optional: Adjust bottom padding if needed
        }
      },
      
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
          },
          grid: {
            color: 'rgba(75, 192, 192, 0.2)' // Optional: Make the grid border invisible if needed
          }
        }
      }
    }
  };
  constructor(
    private authService: AuthService,
    private courseService: CourseService,
    private userCourseService: UserCourseService,
    private userService:UserService
  ) {}

  ngOnInit(): void {
    this.fetchInstructorCount(); 
    this.loadAcceptedCourses();
    this.loadStudentCounts();
    this.loadActiveUserCount();
    this.loadAcceptedStudentCounts();
  }

  ngAfterViewInit(): void {
    this.renderChart(); // Render the chart once view has been initialized
  }

  ngOnDestroy(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy(); // Clean up chart instance on component destruction
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  private loadAcceptedCourses(): void {
    const instructorId = this.authService.getLoggedInUserId();
    this.courseService.getInstructorCourses(instructorId).subscribe(
      (courses: Course[]) => {
        // Filter only accepted courses
        const acceptedCourses = courses.filter(course => course.status === 'Accept');
        this.courseCount = acceptedCourses.length;
        this.courseNames = acceptedCourses.map(course => course.name); // Ensure IDs are strings
        this.updateChartData();
        this.loadStudentCounts();
        this.loadAcceptedStudentCounts();
      },
      (error) => {
        console.error('Error loading accepted courses:', error);
      }
    );
  }

  private loadStudentCounts(): void {
  const instructorId = this.authService.getLoggedInUserId();
  this.userCourseService.getAllUserCourses(instructorId).subscribe(
    (userCourses: UserCourse[]) => {
      // Filter to include only courses that are accepted
      const acceptedCourseIds = this.courseNames.map(courseName => {
        const userCourse = userCourses.find(uc => uc.course && uc.course.name === courseName);
        return userCourse ? userCourse.courseId : null;
      }).filter(id => id !== null) as number[];

      const courseCounts = new Map<number, { studentCount: number, acceptedCount: number }>();

      userCourses.forEach(userCourse => {
        if (userCourse.course && acceptedCourseIds.includes(userCourse.courseId)) {
          if (!courseCounts.has(userCourse.courseId)) {
            courseCounts.set(userCourse.courseId, { studentCount: 0, acceptedCount: 0 });
          }
          const counts = courseCounts.get(userCourse.courseId)!;
          counts.studentCount++;
          if (userCourse.status === 'Accept') {
            counts.acceptedCount++;
          }
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
  fetchInstructorCount() {
    this.userService.getInstructorCount().subscribe(count => {
      console.log('Instructor Count Response:', count); // Check the response structure
      this.instructorCount = count['instructorCount']; // Ensure this line matches the response structure
    });
  }

  private loadActiveUserCount(): void {
    this.userService.getUserLists().subscribe(
      (users: User[]) => {
        this.activeUserCount = users.filter(user => user.status === 'Active').length;
      },
      (error) => {
        console.error('Error fetching user list:', error);
      }
    );
  }

  private updateChartData(): void {
    // Filter course names to only include those with accepted students
    const filteredCourseNames = this.courseNames.filter(name => this.acceptedStudentCounts[name] > 0);
    const filteredAcceptedStudentData = filteredCourseNames.map(name => this.acceptedStudentCounts[name]);

    this.chartConfig.data.labels = filteredCourseNames;
    this.chartConfig.data.datasets[0].data = filteredAcceptedStudentData.map(count => Math.round(count)); // Round to nearest integer

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
