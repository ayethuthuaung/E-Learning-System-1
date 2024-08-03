import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CertificateService } from '../../services/certificate.service';
import { Certificate } from '../../models/certificate.model';
import { Base64 } from 'js-base64';

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
      const encodedUserId = params['userId'];
      const encodedCourseId = params['courseId'];

      if (encodedUserId && encodedCourseId) {
        this.userId = this.decodeId(encodedUserId);
        this.courseId = this.decodeId(encodedCourseId);
        this.getCertificateByUserIdAndCourseId();
      } else {
        console.error('User ID or Course ID is not defined for fetching certificate');
      }
      
    });
    document.addEventListener('keydown', this.handleKeyboardEvent.bind(this));
  }
  decodeId(encodedId: string): number {
    try {
      // Extract the Base64 encoded ID part
      const parts = encodedId.split('-');
      if (parts.length !== 6) {
        throw new Error('Invalid encoded ID format');
      }
      const base64EncodedId = parts[5];
      // Decode the Base64 string
      const decodedString = Base64.decode(base64EncodedId);
      // Convert the decoded string to a number
      const decodedNumber = Number(decodedString);
      if (isNaN(decodedNumber)) {
        throw new Error('Decoded ID is not a valid number');
      }
      return decodedNumber;
    } catch (error) {
      console.error('Error decoding ID:', error);
      throw new Error('Invalid ID');
    }
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
