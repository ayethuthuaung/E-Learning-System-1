import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserUploadComponent } from './user-upload.component';

describe('UserUploadComponent', () => {
  let component: UserUploadComponent;
  let fixture: ComponentFixture<UserUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
