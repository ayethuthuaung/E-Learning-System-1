import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CertificateService } from '../../services/certificate.service';
import { Certificate } from '../../models/certificate.model';

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.css']
})
export class CertificateComponent implements OnInit {
  certificate: Certificate | null = null;
  userId: any;
  courseId: any;

  constructor(
    private certificateService: CertificateService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.userId = params['userId'];
      this.courseId = params['courseId'];

      if (this.userId && this.courseId) {
        this.getCertificateByUserIdAndCourseId();
      } else {
        console.error('User ID or Course ID is not defined for fetching certificate');
      }
    });
  }
  @HostListener('window:keydown', ['$event'])
  preventScreenshot(event: KeyboardEvent): void {
    const screenshotShortcuts = [
      { key: 'PrintScreen' },
      { key: 's', ctrlKey: true },
      { key: 'S', ctrlKey: true },
      { key: 's', metaKey: true },
      { key: 'S', metaKey: true },
      { key: 'Shift', ctrlKey: true, keyCode: 16 },
      { key: 'Shift', metaKey: true, keyCode: 16 }
    ];

    if (screenshotShortcuts.some(shortcut => this.isScreenshotShortcut(event, shortcut))) {
      event.preventDefault();
      alert('Screenshot is disabled for this content.');
    }
  }

  private isScreenshotShortcut(event: KeyboardEvent, shortcut: any): boolean {
    return Object.keys(shortcut).every(key => (event as any)[key] === shortcut[key]);
  }


  getCertificateByUserIdAndCourseId(): void {
    if (this.userId && this.courseId) {
      this.certificateService.getCertificateByUserIdAndCourseId(this.userId, this.courseId).subscribe(
        (data: Certificate) => {
          this.certificate = data;
          console.log('Fetched Certificate:', this.certificate);
        },
        (error) => {
          console.error('Error fetching certificate', error);
        }
      );
    } else {
      console.error('User ID or Course ID is not defined for fetching certificate');
    }
  }

}