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

  @HostListener('document:keydown', ['$event'])
  preventScreenshot(event: KeyboardEvent): void {
    // Detect common screenshot key combinations
    const isPrintScreen = event.key === 'PrintScreen';
    const isCmdShiftS = event.key === 'S' && event.shiftKey && event.metaKey;
    const isCtrlShiftS = event.key === 'S' && event.shiftKey && event.ctrlKey;
    const isCmdAltS = event.key === 'S' && event.altKey && event.metaKey;
    const isCtrlPrintScreen = event.key === 'PrintScreen' && event.ctrlKey;

    if (isPrintScreen || isCmdShiftS || isCtrlShiftS || isCmdAltS || isCtrlPrintScreen) {
      event.preventDefault();
      alert('Screenshots are disabled for this content.');
      console.warn('Screenshot attempt detected and blocked.');
    }
  }

  @HostListener('document:visibilitychange')
  onVisibilityChange(): void {
    // Detect when the user switches tabs (possible indication of taking a screenshot)
    if (document.visibilityState === 'hidden') {
      alert('Please do not attempt to capture screenshots of this content.');
      console.warn('Tab visibility changed - possible screenshot attempt.');
    }
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
