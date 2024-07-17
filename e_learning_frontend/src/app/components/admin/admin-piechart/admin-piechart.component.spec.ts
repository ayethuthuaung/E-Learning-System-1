import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPiechartComponent } from './admin-piechart.component';

describe('CoursePiechartComponent', () => {
  let component: AdminPiechartComponent;
  let fixture: ComponentFixture<AdminPiechartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminPiechartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPiechartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
