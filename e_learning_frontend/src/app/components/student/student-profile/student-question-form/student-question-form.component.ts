import { CourseService } from './../../../services/course.service';
import { AnswerOptionDto } from './../../../models/question.model';
import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ExamService } from '../../../services/exam.service';
import { QuestionService } from '../../../services/question.service';
import { StudentAnswerService } from '../../../services/student-answer.service';
import { UserService } from '../../../services/user.service';
import { ExamDTO } from '../../../models/examdto.model';
import { StudentAnswer } from '../../../models/student-answer.model';
import { Role } from '../../../models/user.model';
import html2canvas from 'html2canvas';
import { CertificateService } from '../../../services/certificate.service';
import { Certificate } from '../../../models/certificate.model';

interface Option {
  id: number;
  label: string;
  value: string;
  isAnswered: boolean;
  isCorrect?: boolean;
  isSelected?: boolean;
}

interface Question {
  id: number;
  text: string;
  type: string;
  marks: number;
  options: Option[];
  correctAnswers?: number[];
}

@Component({
  selector: 'app-student-question-form',
  templateUrl: './student-question-form.component.html',
  styleUrls: ['./student-question-form.component.css']
})
export class StudentQuestionFormComponent implements OnInit, OnDestroy {
  @ViewChild('questionFormContainer') questionFormContainer!: ElementRef;

  exam!: ExamDTO;
  examId: any;
  courseId: any;

  loggedUser: any = '';
  roles: Role[] = [];
  userId: any;
  instructorId: any;
  instructorName: string = ''; 

  questions: Question[] = [];
  showResults: boolean = false;
  totalMarks: number = 0;
  questionTotalMarks: number = 0;

  isOwner: boolean = false;

  duration: string = '';
  remainingTime: number = 0; 

  timerInterval: any; 

  certificate: Certificate | null = null;
  certificateId: number | undefined; 



  constructor(
    private route: ActivatedRoute,
    private examService: ExamService, 
    private questionService: QuestionService,
    private studentAnswerService: StudentAnswerService,
    private userService: UserService,
    private courseService: CourseService,
    private location: Location,
    private certificateService: CertificateService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.examId = +params.get('examId')!;
      if (this.examId != null) {
       this.courseId = this.getCourseId(this.examId);
        this.loadQuestions(this.examId);
      }
      this.exam = history.state.exam;

      if (this.exam && this.exam.duration) {
        this.startTimer(this.parseDuration(this.exam.duration));
      }
    });

    const storedUser = localStorage.getItem('loggedUser');
    if (storedUser) {
      this.loggedUser = JSON.parse(storedUser);
      if (this.loggedUser) {
        this.userId = this.loggedUser.id;
        this.roles = this.loggedUser.roles;
        this.checkOwner();

        // Access role IDs

        if (this.roles.length > 0) {
          this.roles.forEach(role => {
            console.log(role.id); // Print each role ID
          });
        }
      }
    }
  }

  getCourseId(examId: number): void {
    this.courseService.getCourseIdByExamId(examId).subscribe(
      (courseId: number) => {
        this.courseId = courseId;
        console.log('Course ID:', this.courseId);
      },
      (error) => {
        console.error('Error fetching course ID:', error);
      }
    );
  }

  parseDuration(duration: string): number {
    const parts = duration.split(':');
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parseInt(parts[2], 10);
    return (hours * 3600) + (minutes * 60) + seconds;
  }

  ngOnDestroy(): void {
    clearInterval(this.timerInterval); // Clear interval when component is destroyed
  }

  startTimer(durationSeconds: number): void {
    this.remainingTime = durationSeconds;

    this.timerInterval = setInterval(() => {
      this.remainingTime--;
      if (this.remainingTime <= 0) {
        clearInterval(this.timerInterval);
        this.submitAnswers(); // Auto-submit when timer expires
      }
    }, 1000); // Update every second
  }

  formatTime(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${this.pad(hrs)}:${this.pad(mins)}:${this.pad(secs)}`;
  }
  
  pad(value: number): string {
    return value.toString().padStart(2, '0');
  }


  hasRole(roleId: number): boolean {
    return this.roles.some(role => role.id === roleId);
  }

  checkOwner() {
    console.log('Checking examId:', this.examId);
    this.userService.checkExamOwner(this.examId, this.userId).subscribe({
      next: (response) => {
        console.log("Owner check response:", response);
        this.isOwner = response;
        console.log('Is owner:', this.isOwner);
      },
      error: (error) => {
        console.error('Error checking exam owner:', error);
      }
    });
  }
  

  
  
  loadQuestions(examId: number) {
    this.examService.getExamById(examId).subscribe((data: ExamDTO) => {
      this.exam = data; // Ensure exam is set here

      this.questions = data.questions.map(question => ({
        id: question.id,
        text: question.content,
        type: question.questionTypeId === 1 ? 'multiple-choice' : 'checkbox',
        marks: question.marks,
        options: this.shuffleArray(question.answerList.map(option => ({
          id: option.id,
          label: option.answer,
          value: option.answer,
          isAnswered: false,
          isCorrect: option.isAnswered
        }))),
        correctAnswers: question.answerList.filter(option => option.isAnswered).map(option => option.id)
        // adminOwnerCorrectAnswers: []
        // adminOwnerCorrectAnswers: 

        
      }));
      this.questionTotalMarks = this.questions.reduce((total, question) => total + question.marks, 0);
   
    });
  }



  shuffleArray(array: any[]): any[] {
    return array
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

  selectOption(questionIndex: number, optionIndex: number) {
    const question = this.questions[questionIndex];
    if (question.type === 'multiple-choice') {
      question.options.forEach((option, idx) => {
        option.isAnswered = idx === optionIndex;
      });
    } else {
      question.options[optionIndex].isAnswered = !question.options[optionIndex].isAnswered;
    }
  }

  submitAnswers() {
    clearInterval(this.timerInterval);
    const answers: StudentAnswer[] = this.questions.map(question => ({
      questionId: question.id,
      answerOptionId: question.options.find(option => option.isAnswered)?.id || null,
      isAnswered: question.options.some(option => option.isAnswered),
      userId: this.userId,
    }));

    this.studentAnswerService.submitStudentAnswers(answers).subscribe(response => {      
      this.checkAnswers(response);
      this.showResults = true;
    }, error => {
      console.error('Error submitting answers', error);
    });
  }

  checkAnswers(response: any) {  
    response.forEach((res: any) => {     
      const question = this.questions.find(q => q.id === res.questionId);
      if (question) {        
        question.correctAnswers = res.correctAnswerIds || [];
        const selectedOptions = question.options.filter(option => option.isAnswered).map(option => option.id);
  
        question.options.forEach(option => {
          if(question.correctAnswers)
          option.isCorrect = question.correctAnswers.includes(option.id);
          option.isSelected = selectedOptions.includes(option.id);
        });
        
        if (question.type === 'multiple-choice') {
          const selectedOption = question.options.find(option => option.isAnswered);
          if(question.correctAnswers)
          if (selectedOption && question.correctAnswers.includes(selectedOption.id)) {
            this.totalMarks += question.marks;
          }
        } else if (question.type === 'checkbox') {
          if(question.correctAnswers)
          if (selectedOptions.length === question.correctAnswers.length && selectedOptions.every(id => question.correctAnswers!.includes(id))) {
            this.totalMarks += question.marks;
          }
        }
      }
    });
  }

  captureScreenshot() {
    const container = this.questionFormContainer.nativeElement;
    html2canvas(container).then((canvas) => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'Answer-Form.png';
      link.click();
    });
  }

  getOptionLabel(question: Question, correctAnswerId: number): string | undefined {
    const option = question.options.find(option => option.id === correctAnswerId);
    return option ? option.label : undefined;
  }


  

  gotoCertificate(): void {
    if (this.userId && this.courseId) {
      console.log('Navigating to Certificate Component with:', { userId: this.userId, courseId: this.courseId });
      this.router.navigate(['/certificate'], { queryParams: { userId: this.userId, courseId: this.courseId } });
    } else {
      console.error('User ID or Course ID is not defined');
    }
  }
  
  

  goBack() {
    this.location.back();
  }
}
