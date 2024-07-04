import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConservationListComponent } from './conservation-list.component';

describe('ConservationListComponent', () => {
  let component: ConservationListComponent;
  let fixture: ComponentFixture<ConservationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConservationListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConservationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
