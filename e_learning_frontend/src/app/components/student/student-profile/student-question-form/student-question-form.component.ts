import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExamService } from '../../../services/exam.service';
import { QuestionService } from '../../../services/question.service';
import { StudentAnswer } from '../../../models/student-answer.model';
import { ExamDTO } from '../../../models/examdto.model';
import html2canvas from 'html2canvas';


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
  marks : number;
  options: Option[];
  correctAnswer?: string;
}

@Component({
  selector: 'app-student-question-form',
  templateUrl: './student-question-form.component.html',
  styleUrl: './student-question-form.component.css'
})
export class StudentQuestionFormComponent implements OnInit{
  @ViewChild('questionFormContainer') questionFormContainer!: ElementRef;

  exam!: ExamDTO;
  examId: any;
  loggedUser: any = '';
  userId: any;
  instructorId: any;
  instructorName: string = ''; 

  questions: Question[] = [];
  showResults: boolean = false;
  totalMarks: number = 0;

  constructor(
    private route: ActivatedRoute,
    private examService: ExamService, 
    private questionService: QuestionService
  ) {}

  ngOnInit(): void {

    
    this.route.paramMap.subscribe(params => {
      console.log(params);
      
      
      this.examId = +params.get('examId')!;
      console.log("ExamId", this.examId);
      
      if(this.examId != null){
        this.loadQuestions(this.examId);
  
      }
      
      
      this.exam = history.state.exam;
      console.log(`Module ID: ${this.examId}`);
      console.log(`Module: ${JSON.stringify(this.exam)}`);
    });
    // const storedUser = localStorage.getItem('loggedUser');
    // if (storedUser) {
    //   this.loggedUser = JSON.parse(storedUser);
    //   console.log(this.loggedUser);

    //   if (this.loggedUser) {
    //     this.userId = this.loggedUser.id;
    //     // this.instructorId = this.exam.userId;
    //     // console.log(this.instructorId);
        
    //     // this.instructorName = this.course?.user?.name || ''; // Set instructorName
    //   }
    // } 
    
   
  }

  loadQuestions(examId : number) {

    // Fetch exam and questions data

    this.examService.getExamById(examId).subscribe((data: ExamDTO) => {
      console.log(data);
      
      this.questions = data.questions.map(question => ({
        id: question.id,
        text: question.content,
        type: question.questionTypeId === 1 ? 'multiple-choice' : 'checkbox',
        marks: question.marks,
        options: question.answerList.map(option => ({
          id: option.id,
          label: option.answer,
          value: option.answer,
          isAnswered: false
        })),
        correctAnswer: ''
      }));
    });
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
    const answers: StudentAnswer[] = this.questions.map(question => ({
      questionId: question.id,
      answerOptionId: question.options.find(option => option.isAnswered)?.id || 0, // Replace with appropriate default if no option is selected
      isAnswered: question.options.some(option => option.isAnswered)
    }));

    this.questionService.submitStudentAnswers(answers).subscribe(response => {
      console.log('Answers submitted successfully', response);
      this.checkAnswers(response);
      this.showResults = true;

    }, error => {
      console.error('Error submitting answers', error);
    });
  }

  checkAnswers(response: any) {
    response.forEach((res: any) => {
      const question = this.questions.find(q => q.id === res.question.id);
      if (question) {
        question.correctAnswer = res.correctAnswerId;
        question.options.forEach(option => {
          option.isCorrect = option.id === res.correctAnswerId;
         
          option.isSelected = option.id === res.selectedOptionId;
          if(option.isCorrect && option.isSelected){

            this.totalMarks+= question.marks;
          }
        });
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

}
