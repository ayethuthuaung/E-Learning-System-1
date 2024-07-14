import { AfterViewInit, Component, ContentChild, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { Client } from '../../models/client.model';
import { Feedback } from '../../models/feedback.model';
import { SlideConfig } from '../../models/slide-config.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements  AfterViewInit {

 @Input() items: any[] = [];
 @Input() item: Category[] = [];
  @Output() categoryClicked: EventEmitter<string> = new EventEmitter<string>();

  @ContentChild('template')
  template: TemplateRef<any> | undefined;

  @ViewChild('slideContainer')
  slideContainer!: ElementRef;

  @Input('slideConfig')
  slideConfig = new SlideConfig();

  dots: number[] = [];
  activeSlideID = 1;
  sliderContainerWidth = 0;
  slideWidth = 0;
  elementsToShow = 1;
  sliderWidth = 0;
  sliderMarginLeft = 0;
  isSlidesOver = false;

  constructor() { }

  ngAfterViewInit(): void {
    this.setUpSlider();
  }

  onCategoryClick(category: Category) {
    this.categoryClicked.emit(category.name); 
  }

  setUpSlider() {
    this.calculateDimensions();
    this.calculateSliderDimensions();

    if (this.slideConfig.autoPlay) {
      this.autoPlay();
    }
  }

  @HostListener('window:resize', ['$event'])
  onScreenResize() {
    this.calculateDimensions();
    this.calculateSliderDimensions();
  }

  calculateDimensions() {
    if (window.innerWidth < 500)
      this.elementsToShow = this.slideConfig.breakpoints.sm;
    else if (window.innerWidth < 900)
      this.elementsToShow = this.slideConfig.breakpoints.md;
    else if (window.innerWidth < 1300)
      this.elementsToShow = this.slideConfig.breakpoints.lg;
    else
      this.elementsToShow = this.slideConfig.breakpoints.xl;

    if (this.items.length < this.elementsToShow) {
      this.elementsToShow = this.items.length;
    }

    this.dots = Array(this.items.length - this.elementsToShow + 1);
  }

  calculateSliderDimensions() {
    let container = this.slideContainer.nativeElement as HTMLElement;
    this.sliderContainerWidth = container.clientWidth;
    this.slideWidth = this.sliderContainerWidth / this.elementsToShow;
    this.sliderWidth = this.slideWidth * this.items.length;
  }

  prev() {
    if (this.sliderMarginLeft === 0) {
      return;
    }
    this.activeSlideID--;
    this.sliderMarginLeft = this.sliderMarginLeft + this.slideWidth;
  }

  next() {
    const notShowingElementsCount = this.items.length - this.elementsToShow;
    const possibleMargin = -(notShowingElementsCount * this.slideWidth);
    if (this.sliderMarginLeft <= possibleMargin) {
      this.isSlidesOver = true;
      return;
    }
    this.isSlidesOver = false;
    this.activeSlideID++;
    this.sliderMarginLeft = this.sliderMarginLeft - this.slideWidth;
  }

  move(slideID: number) {
    let difference = slideID - this.activeSlideID;
    if (difference > 0) {
      // Next
      for (let index = 0; index < difference; index++) {
        this.next();
      }
    } else if (difference < 0) {
      // Prev
      for (let index = 0; index < Math.abs(difference); index++) {
        this.prev();
      }
    }
  }

  autoPlay() {
    setTimeout(() => {
      if (this.isSlidesOver === true) {
        this.sliderMarginLeft = this.slideWidth;
      }
      this.next();
      this.autoPlay();
    }, 1000);
  }
}