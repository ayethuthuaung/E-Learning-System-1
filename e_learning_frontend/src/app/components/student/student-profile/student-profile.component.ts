import { CertificateService } from './../../services/certificate.service';
import { Course } from './../../models/course.model';
import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { UserService } from '../../services/user.service';
import { UserCourseService } from '../../services/user-course.service';
import { CourseModuleService } from '../../services/course-module.service';
import { Lesson } from '../../models/lesson.model';
import { CourseModule } from '../../models/coursemodule.model';
import { UserCourseModuleService } from '../../services/usercoursemodule.service';
import { Base64 } from 'js-base64';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css']
})
export class StudentProfileComponent implements OnInit {
  photo: any = '';
  name: string = '';
  team: string = '';
  department: string = '';
  division: string = '';
  loggedUser: any = '';
  id: number = 0;
  roles: string[] = [];
  selectedFile: File | null = null;

  courseNames: string[] = [];
  lessons: Lesson[] = [];
  selectedCourse?: Course;
  enrolledCourses: Course[] = [];
  coursePercentages: { [courseId: number]: number } = {};
  selectedCourseModules: CourseModule[] = [];
  selectedCourseLessons: { [moduleId: number]: Lesson[] } = {};
  currentlyVisibleModuleId?: number;
  modulesGroupedByLessons: { [lessonTitle: string]: CourseModule[] } = {};
  moduleVisibility: { [moduleId: number]: boolean } = {};
  moduleCompletionStatus: { [moduleId: number]: boolean } = {};
  error: string | null = null;
  
  hasUserCertificate: boolean = false;
  certificateStatuses: { [key: number]: boolean } = {};

  isChangePasswordModalOpen = false;
  private certificateWindow: Window | null = null;


  constructor(
    private router: Router,
    private courseService: CourseService,
    private userService: UserService,
    private userCourseService: UserCourseService,
    private courseModuleService: CourseModuleService,
    private userCourseModuleService: UserCourseModuleService,
    private certificateService: CertificateService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const storedUser = localStorage.getItem('loggedUser');
    if (storedUser) {
      this.loggedUser = JSON.parse(storedUser);
      console.log(this.loggedUser);

      if (this.loggedUser) {
        this.photo = this.loggedUser.photo;
        this.name = this.loggedUser.name;
        this.team = this.loggedUser.team;
        this.department = this.loggedUser.department;
        this.division = this.loggedUser.division;
        this.id = this.loggedUser.id;
        this.roles = this.loggedUser.roles.map((role: any) => role.name);
        console.log(this.id);
        this.fetchEnrolledCourses();
      }
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      this.selectedFile = file;
      this.updateProfile();
    }
  }

  updateProfile(): void {
    if (this.selectedFile && this.loggedUser) {
      this.userService.updateProfile(this.selectedFile, this.id).subscribe(
        (response: any) => {
          console.log('Profile updated successfully:', response);
          this.photo = response.url;
          this.loggedUser.photo = this.photo;
          localStorage.setItem('loggedUser', JSON.stringify(this.loggedUser));
        },
        error => {
          console.error('Error updating profile:', error);
          // Handle error response
        }
      );
    }
  }

  downloadPhoto(): void {
    if (this.photo) {
      fetch(this.photo)
        .then(response => response.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = 'profile-picture.jpg';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          alert('Your profile picture has been downloaded.');
        })
        .catch(error => console.error('Error downloading the photo:', error));
    }
  }

  fetchEnrolledCourses(): void {
    if (this.id) {
      this.userCourseService.getCoursesByUserId(this.id).subscribe({
        next: (courses) => {
          this.enrolledCourses = courses;
          this.fetchCourseNames(); // Call this method after fetching courses
          this.fetchCoursePercentages(); // Call this method after fetching courses

          this.enrolledCourses.forEach(course => {

            this.checkUserCertificate(course.id);
          });        },
        error: (e) => console.log(e)
      });
    }
  }

  fetchCourseNames(): void {
    this.enrolledCourses.forEach(course => {
      this.courseService.getCourseById(course.id).subscribe({
        next: (fetchedCourse) => {
          course.name = fetchedCourse.name; // Assuming fetchedCourse contains the name property
        },
        error: (e) => console.log(`Error fetching course ${course.id} name:`, e)
      });
    });
  }

  fetchCoursePercentages(): void {
    this.enrolledCourses.forEach(course => {
      this.courseModuleService.getCompletionPercentage(this.loggedUser.id, course.id).subscribe({
        next: (percentage) => {
          console.log(`Fetched percentage for course ${course.id}: ${percentage}`);
          this.coursePercentages[course.id] = percentage;
        },
        error: (e) => console.log(e)
      });
    });
  }

  loadCourseModulesAndLessons(courseId: number): void {
    this.courseModuleService.getModulesByCourseId(courseId).subscribe(modules => {
      this.selectedCourseModules = modules;
     
      this.selectedCourseModules.forEach(module => {
        this.moduleVisibility[module.id] = false;
        this.loadModuleLessons(module.id);
        this.userCourseModuleService.getModuleCompletionStatus(this.id, module.id).subscribe(status => {
          this.moduleCompletionStatus[module.id] = status;
        });
      });
    });
  }

  loadModuleLessons(moduleId: number): void {
    this.courseModuleService.getLessonsByModuleId(moduleId).subscribe({
      next: (lessons) => {
        this.selectedCourseLessons[moduleId] = lessons;
        this.groupModulesByLessons();
      },
      error: (err) => {
        console.error('Error fetching lessons:', err);
      }
    });
  }

  groupModulesByLessons(): void {
    this.modulesGroupedByLessons = {};
    for (const moduleId in this.selectedCourseLessons) {
      if (this.selectedCourseLessons.hasOwnProperty(moduleId)) {
        const lessons = this.selectedCourseLessons[moduleId];
        lessons.forEach(lesson => {
          if (!this.modulesGroupedByLessons[lesson.title]) {
            this.modulesGroupedByLessons[lesson.title] = [];
          }
          const module = this.selectedCourseModules.find(mod => mod.id === +moduleId);
          if (module) {
            this.modulesGroupedByLessons[lesson.title].push(module);
          }
        });
      }
    }
  }

  filterModulesBySelectedCourse(): void {
    if (this.selectedCourse) {
      this.selectedCourseModules = this.selectedCourseModules.filter(
        module => module.courseId === this.selectedCourse!.id
      );
      this.selectedCourseLessons = {};
      this.selectedCourseModules.forEach(module => {
        this.loadModuleLessons(module.id);
      });
    }
  }

  getModulesGroupedByLessonsKeys(): string[] {
    return Object.keys(this.modulesGroupedByLessons);
  }

  toggleModuleVisibility(moduleId: number): void {
    this.moduleVisibility[moduleId] = !this.moduleVisibility[moduleId];

    if (this.moduleVisibility[moduleId] && !this.selectedCourseLessons[moduleId]) {
      this.loadModuleLessons(moduleId);
    }
  }
  

  getLessonTitles(): string[] {
    return Object.keys(this.modulesGroupedByLessons);
  }

  // Add this method to return module number
  getModuleNumber(moduleId: number): number {
    let moduleNumber = 0;
    for (const lessonTitle in this.modulesGroupedByLessons) {
      if (this.modulesGroupedByLessons.hasOwnProperty(lessonTitle)) {
        const modules = this.modulesGroupedByLessons[lessonTitle];
        const index = modules.findIndex(mod => mod.id === moduleId);
        if (index !== -1) {
          moduleNumber = index + 1;
          break;
        }
      }
    }
    return moduleNumber;
  }
  handleClickOutside(moduleId: number): void {
    if (this.moduleVisibility[moduleId]) {
      this.moduleVisibility[moduleId] = false;
    }
  }
  viewCourse(course: Course): void {
    this.selectedCourse = course;
    if (this.selectedCourse) {
      this.loadCourseModulesAndLessons(this.selectedCourse.id);
      this.filterModulesBySelectedCourse();
  
      // Check if there are modules for the selected course
      if (this.selectedCourseModules.length > 0) {
        const section = document.getElementById('lessons-modules-section');
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }  else {
        // Clear the lessons and modules section if there are no modules
        this.modulesGroupedByLessons = {};
        const section = document.getElementById('lessons-modules-section');
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
    }
  }
}
  

  viewCourses(course: Course): void {
    this.selectedCourse = course;
    if (this.selectedCourse) {
      const encodedId = this.encodeId(this.selectedCourse.id.toString());
      this.router.navigate(['/course-detail', encodedId]);
    }
  }
  encodeId(id: string): string {
    const base64EncodedId = Base64.encode(id);
    const uuid = 'af782e56-8887-4130-9c0e-114ab93d7ebe'; // Static UUID-like string for format
    return `${uuid}-${base64EncodedId}`;
  
  }
  gotoCertificate(courseId: number): void {
    if (this.id && courseId) {
      console.log('Navigating to Certificate Component with:', { userId: this.id, courseId: courseId });
      const encodedUserId = this.encodeId(this.id.toString());
      const encodedCourseId = this.encodeId(courseId.toString());
      const url = this.router.createUrlTree(['/certificate'], { queryParams: { userId: encodedUserId, courseId: encodedCourseId } }).toString();
      
      if (this.certificateWindow && !this.certificateWindow.closed) {
        this.certificateWindow.focus();
      } else {
        this.certificateWindow = window.open(url, '_blank');
      }
    } else {
      console.error('User ID or Course ID is not defined');
    }
  }
  checkUserCertificate(courseId: number): void {
    console.log(courseId);
    
    if (this.certificateStatuses[courseId] !== undefined) {
      return;
    }

    this.certificateService.checkUserCertificate(this.id, courseId).subscribe({
      next: (response) => {
        this.certificateStatuses[courseId] = response;
        console.log(this.certificateStatuses);

      },
      error: (error) => {
        console.error('Error checking exam owner:', error);
        this.certificateStatuses[courseId] = false;
      }
    });
  }
  

  goBack(): void {
    window.history.back();

  }

  getFirstLessonForModule(moduleId: number): Lesson | undefined {
    const lessons = this.selectedCourseLessons[moduleId];
    return lessons && lessons.length > 0 ? lessons[0] : undefined;
  }

  isFirstModuleOfLesson(module: CourseModule, moduleIndex: number): boolean {
    if (moduleIndex === 0) {
      return true;
    }
    const previousModule = this.selectedCourseModules[moduleIndex - 1];
    const currentLesson = this.getFirstLessonForModule(module.id);
    const previousLesson = this.getFirstLessonForModule(previousModule.id);
    return currentLesson?.id !== previousLesson?.id;
  }
 


  openChangePasswordModal(): void {
    this.isChangePasswordModalOpen = true;
  }
}
