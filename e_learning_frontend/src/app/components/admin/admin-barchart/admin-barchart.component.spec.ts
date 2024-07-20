import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBarchartComponent } from './admin-barchart.component';

describe('AdminBarchartComponent', () => {
  let component: AdminBarchartComponent;
  let fixture: ComponentFixture<AdminBarchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminBarchartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminBarchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
