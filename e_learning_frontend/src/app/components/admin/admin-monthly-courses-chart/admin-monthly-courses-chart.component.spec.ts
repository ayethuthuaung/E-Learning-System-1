import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMonthlyCoursesChartComponent } from './admin-monthly-courses-chart.component';

describe('AdminMonthlyCoursesChartComponent', () => {
  let component: AdminMonthlyCoursesChartComponent;
  let fixture: ComponentFixture<AdminMonthlyCoursesChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminMonthlyCoursesChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminMonthlyCoursesChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
