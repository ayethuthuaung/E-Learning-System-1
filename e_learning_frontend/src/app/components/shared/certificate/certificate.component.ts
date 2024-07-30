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
    document.addEventListener('keydown', this.handleKeyboardEvent.bind(this));
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.handleKeyboardEvent.bind(this));
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
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    // Block PrintScreen key and common screenshot shortcuts
    if (event.key === 'PrintScreen' || (event.ctrlKey && (event.key === 's' || event.key === 'S'))) {
      event.preventDefault();
      console.log('Screenshot attempt blocked');
    }
  }
}
