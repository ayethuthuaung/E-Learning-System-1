import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CourseService } from './../../services/course.service';
import { Course } from './../../models/course.model';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';
import { UserCourseService } from '../../services/user-course.service';
import { SlideConfig } from '../../models/slide-config.model';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  trendingCourses: Course[] = [];
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  latestCourses: Course[] = [];
  categories: Category[] = [];
  selectedCategory: string = '';
  translateX = 0;
  translateXTrending = 0;
  intervalId: any;
  intervalIdTrending: any;
  slideConfig = {
    showLeftRightArrow: true,
    interval: 5000 // Slide every 5 seconds
  }

  @ViewChild('latestCoursesSlider') latestCoursesSlider!: ElementRef;
  @ViewChild('trendingCoursesSlider') trendingCoursesSlider!: ElementRef;

  constructor(
    private categoryService: CategoryService,
    private courseService: CourseService,
    private userCourseService: UserCourseService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchTrendingCourses();
    this.getLatestAcceptedCourses();
    this.getAllCourses();
    this.getCategories();
    this.startAutoSlide();
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
    clearInterval(this.intervalIdTrending);
  }

  ngAfterViewInit() {
    this.addEventListeners();
  }

  private getAllCourses() {
    this.courseService.getAllCourses('Accept')
      .subscribe({
        next: (data) => {
          this.courses = data;
          this.filteredCourses = data;
        },
        error: (e) => console.error('Error fetching all courses:', e)
      });
  }

  private getCategories() {
    this.categoryService.getCategoryList()
      .subscribe({
        next: (data) => {
          this.categories = data;
        },
        error: (e) => console.error('Error fetching categories:', e)
      });
  }

  filterCourses(category: string) {
    if (category === 'all') {
      this.filteredCourses = this.courses;
    } else {
      this.filteredCourses = this.courses.filter(course =>
        course.categories.some(cat => cat.name === category)
      );
    }
    this.selectedCategory = category;
  }

  private getLatestAcceptedCourses() {
    this.courseService.getLatestAcceptedCourses()
      .subscribe({
        next: (data) => {
          this.latestCourses = data;
          this.startAutoSlide();
        },
        error: (e) => console.error('Error fetching latest accepted courses:', e)
      });
  }

  fetchTrendingCourses(): void {
    this.userCourseService.getTrendingCourses()
      .subscribe(
        (courses: Course[]) => {
          this.trendingCourses = courses;
          this.startAutoSlide();
        },
        (error) => {
          console.error('Error fetching trending courses:', error);
        }
      );
  }

  addEventListeners() {
    const latestSlider = this.latestCoursesSlider.nativeElement;
    const trendingSlider = this.trendingCoursesSlider.nativeElement;

    if (latestSlider) {
      latestSlider.addEventListener('mouseenter', () => clearInterval(this.intervalId));
      latestSlider.addEventListener('mouseleave', () => {
        this.intervalId = setInterval(() => {
          this.nextLatest();
        }, this.slideConfig.interval);
      });
    }

    if (trendingSlider) {
      trendingSlider.addEventListener('mouseenter', () => clearInterval(this.intervalIdTrending));
      trendingSlider.addEventListener('mouseleave', () => {
        this.intervalIdTrending = setInterval(() => {
          this.nextTrending();
        }, this.slideConfig.interval);
      });
    }
  }

  startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.nextLatest();
    }, this.slideConfig.interval);

    this.intervalIdTrending = setInterval(() => {
      this.nextTrending();
    }, this.slideConfig.interval);
  }

  nextLatest() {
    const maxTranslateX = -((this.latestCourses.length - 1) * 400); // Adjust based on card width + margin
    this.translateX = this.translateX <= maxTranslateX ? 0 : this.translateX - 400;
  }

  prevLatest() {
    const maxTranslateX = -((this.latestCourses.length - 1) * 400);
    this.translateX = this.translateX >= 0 ? maxTranslateX : this.translateX + 400;
  }

  nextTrending() {
    const maxTranslateXTrending = -((this.trendingCourses.length - 1) * 400); // Adjust based on card width + margin
    this.translateXTrending = this.translateXTrending <= maxTranslateXTrending ? 0 : this.translateXTrending - 400;
  }

  prevTrending() {
    const maxTranslateXTrending = -((this.trendingCourses.length - 1) * 400);
    this.translateXTrending = this.translateXTrending >= 0 ? maxTranslateXTrending : this.translateXTrending + 400;
  }
}
