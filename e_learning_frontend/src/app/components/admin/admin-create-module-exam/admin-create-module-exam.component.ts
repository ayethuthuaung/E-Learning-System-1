import { Course } from './../../models/course.model';
import { Message } from '@stomp/stompjs';
import { ExamList } from './../../models/examList.model';
import { CourseModuleService } from '../../services/course-module.service';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LessonService } from '../../services/lesson.service';
import { ExamService } from '../../services/exam.service';
import { Lesson } from '../../models/lesson.model';
import { Module } from '../../models/module.model';
import { QuestionDto } from '../../models/question.model';
import Swal from 'sweetalert2';
import { ExamCreationDto } from '../../models/examCreationDto.model';
import { AnswerOptionDTO } from '../../models/answeroptiondto.model';
import { Location } from '@angular/common';
import { CourseService } from '../../services/course.service';

interface Option {
  label: string;
  value: string;
  isAnswered: boolean;
  isCorrect?: boolean; 
}

interface Question {
  text: string;
  type: string;
  marks: number;
  options: Option[];
  correctAnswer?: string; 
  isNew?: boolean;
}

@Component({
  selector: 'app-admin-create-module-exam',
  templateUrl: './admin-create-module-exam.component.html',
  styleUrl: './admin-create-module-exam.component.css'
})
export class AdminCreateModuleExamComponent implements OnInit{
  lessonId: number = -1;
  lessons :Lesson[] =[];
  lesson!: { title: ''; };
  modules: Module[] = [{ id: 1, name: '', file: '', fileInput: null, fileType: '' ,done:false, createdAt: Date.now()}];
  moduleList: Module[]=[];
  courseId: number = 0;

  isSidebarOpen = true;
  activeTab: string = 'createModule';
examForm: any;

loading = false;
currentModuleIndex: number = -1;
isEditing: boolean = false;

course: Course | undefined;


@ViewChild('formRef') formRef!: ElementRef;


 //Create Exam
 examId: number = 1; // Example exam ID
 examTitle: string='';
 examDescription: string= '';
 examDuration: string= '';
 examFinal: boolean = false;
 examPassScore: number = 0;
 formDescription: string = 'Please fill out this form';
 examList: ExamList[]=[];


 questions: Question[] = [
   {
     text: '',
     type: 'multiple-choice',
     options: [
       { label: 'Option 1', value: 'option1', isAnswered: false }
     ],
     marks:0
   }
 ];

 showResults: boolean = false; // Add this property to toggle result display



  constructor(
    private route: ActivatedRoute,
    private lessonService: LessonService,
    private examService: ExamService,
    private courseService: CourseService,
    private courseModuleService:CourseModuleService,
    private location: Location,
    private router:Router,
    private cdr: ChangeDetectorRef
   ) {}

   ngOnInit(): void {
    const lessonIdParam = this.route.snapshot.paramMap.get('lessonId');
    console.log('Lesson ID Param:', lessonIdParam);

    if (lessonIdParam !== null) {
      this.lessonId = +lessonIdParam; // Convert courseIdParam to number if not null
      this.loadModulesByLessonId(this.lessonId);
      this.loadExamByLessonId(this.lessonId);
       this.getCourseId(this.lessonId);
       
    }

  }

  loadModulesByLessonId(lessonId: number) {
    this.courseModuleService.getModulesByLessonId(lessonId).subscribe(
      modules => {
        this.moduleList = modules;
        
      },
      error => {
        console.error('Error fetching modules:', error);
        // Handle error
      }
    );
  }


  addModule() {
    this.modules.push({ id:1,name: '', file:'',fileInput: null, fileType:'',done:false, createdAt: Date.now()}); // Initialize File as null
    console.log(this.modules);
    
  }

  removeModule(index: number) {
    this.modules.splice(index, 1);
    console.log(this.modules);
    
  }

  editModule(index: number) {
    this.currentModuleIndex = index;
    const module = this.moduleList[index];
    this.modules[0].name = module.name;
    this.modules[0].id = module.id;
    this.isEditing = true;
    this.cdr.detectChanges(); // Ensure the view is updated before scrolling
    this.scrollToTop();  
  }

  scrollToTop(): void {
    const formElement = document.querySelector('#moduleExamTop');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  onSubmit(moduleForm: any) {
    if (this.currentModuleIndex !== -1) {      
      const updatedModule = this.modules[0];
      Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to update this module?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'No, cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.loading) return;
        this.loading = true;
        const formData = new FormData();
        const moduleData = {
          name: updatedModule.name,
          lessonId: this.lessonId.toString(),
        };

        if (updatedModule.fileInput) {
          formData.append('file', updatedModule.fileInput);
        }
        
        formData.append('module', new Blob([JSON.stringify(moduleData)], { type: 'application/json' })); 
        console.log(formData.get('file'));
        console.log(formData.get('module'));

      this.courseModuleService.updateModule(this.moduleList[this.currentModuleIndex].id, formData).subscribe(
        (response) => {
          console.log(response);
          
          this.loading = true;
          
          // this.moduleList[this.currentModuleIndex] = response;
          if (response.message === 'CourseModules updated successfully') {                  
            this.loading = false;
            Swal.fire('Updated!', 'The module has been updated.', 'success');
          }
          
          this.currentModuleIndex = -1;
          this.isEditing = false;
          moduleForm.resetForm();
          this.modules = [];
          this.modules = [{ id: 1, name: '', file: '', fileInput: null, fileType: '' ,done:false, createdAt: Date.now()}];

          this.loadModulesByLessonId(this.lessonId);
        },
        error => {
          this.loading = false;
          console.error('Error updating module:', error);
          Swal.fire('Error!', 'Failed to update the module.', 'error');
        }
      );
    }
  });
    } else {
      if (moduleForm.valid) {
        Swal.fire({
          title: 'Are you sure?',
          text: 'Do you want to submit these modules?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Yes, submit!',
          cancelButtonText: 'No, cancel',
        }).then((result) => {
          if (result.isConfirmed) {
            if (this.loading) return; // Prevent multiple submissions
            this.loading = true;
    
            const formData = new FormData();
            const modulesData: any[] = [];
    
            this.modules.forEach((module, index) => {
              const moduleData = {
                name: module.name,
                lessonId: this.lessonId.toString(),
              };
              modulesData.push(moduleData);
              if (module.fileInput) {
                formData.append('files', module.fileInput);
              }
            });
    
            formData.append('modules', new Blob([JSON.stringify(modulesData)], { type: 'application/json' }));
            console.log("FormData content before sending:", formData);
    
            this.courseModuleService.createModules(formData).subscribe(
              (response) => {
                this.loading = true;
                console.log(this.loading);

                console.log('Modules Created:', response);
                if (response.body.message === 'CourseModules created successfully') {                
                  this.loading = false;
                  Swal.fire('Success!', response.message, 'success');
                }

                moduleForm.resetForm();
                this.modules = [];
                this.modules = [{ id: 1, name: '', file: '', fileInput: null, fileType: '' ,done:false, createdAt: Date.now()}];
  
                this.loadModulesByLessonId(this.lessonId);
              },
              (error) => {
                this.loading = false; // Reset loading state
                console.error('Error creating modules:', error);
                Swal.fire('Error!', error.error.error, 'error');
              }
            );
          }
        });
      }    
    }
   
  }
  
  deleteModule(moduleId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this module?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        this.courseModuleService.deleteModule(moduleId).subscribe(
          () => {
            this.moduleList = this.moduleList.filter(module => module.id !== moduleId);
            Swal.fire('Deleted!', 'The module has been deleted.', 'success');
          },
          error => {
            console.error('Error deleting module:', error);
            Swal.fire('Error!', 'Failed to delete the module.', 'error');
          }
        );
      }
    });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  onFileSelected(event: any, index: number) {
    const file: File = event.target.files[0];
    this.modules[index].fileInput = file;
  }

 
//Create Exam
  addOption(questionIndex: number) {
    this.questions[questionIndex].options.push({
      label: `Option ${this.questions[questionIndex].options.length + 1}`,
      value: `option${this.questions[questionIndex].options.length + 1}`,
      isAnswered: false
    });
  }

  handleOptionClick(questionIndex: number, optionIndex: number) {
    const question = this.questions[questionIndex];
    if (optionIndex === question.options.length - 1) {
      this.addOption(questionIndex);
    }
  }

  deleteOption(qIndex: number, oIndex: number) {
    if (this.questions[qIndex].options.length > 1) {
      this.questions[qIndex].options.splice(oIndex, 1);
    }
  }


  addQuestion() {
    this.questions.push({
      text: 'New Question',
      type: 'multiple-choice',
      options: [
        { label: 'Option 1', value: 'option1', isAnswered: false }
      ],
      marks:0,
      isNew: true // Mark this question as new
    });
  }

  deleteNewQuestion(questionIndex: number) {
    if (this.questions.length > 1) {
      this.questions.splice(questionIndex, 1);
    }
  }

  selectOption(questionIndex: number, optionIndex: number) {
    const question = this.questions[questionIndex];
    question.options.forEach((option, idx) => {
      option.isAnswered = (idx === optionIndex);
    });
  }

  loadExamByLessonId(lessonId: number) {
    this.examService.getExamByLessonId(lessonId).subscribe(
      exams => {
        this.examList = exams;
        
      },
      error => {
        console.error('Error fetching modules:', error);
        // Handle error
      }
    );
  }

  onSubmitExam(examForm: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to submit this exam?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, submit!',
      cancelButtonText: 'No, cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        const examCreationDto: ExamCreationDto = {
          lessonId: this.lessonId,
          title: this.examTitle,
          description: this.examDescription,
          duration: this.examDuration,
          finalExam: this.examFinal,
          passScore: this.examPassScore,
          questionList: this.questions.map(question => ({
            content: question.text,
            questionTypeId: question.type === 'multiple-choice' ? 1 : 2, // Map types to IDs
            answerList: question.options.map(option => ({
              answer: option.label,
              isAnswered: option.isAnswered
            } as AnswerOptionDTO)),
            marks: question.marks
          } as QuestionDto))
        };

        this.examService.createExam(examCreationDto).subscribe(
          (response) => {
            console.log('Exam submitted successfully', response);
            Swal.fire('Success!', 'The exam has been submitted successfully.', 'success');
                this.examTitle= '';  
                this.examDescription='';
                this.examDuration = '';
                 this.questions = [];
                this.questions = [
                  {
                    text: '',
                    type: 'multiple-choice',
                    options: [
                      { label: 'Option 1', value: 'option1', isAnswered: false }
                    ],
                    marks:0
                  }
                ];
                this.loadExamByLessonId(this.lessonId);
                 
          },
          (error) => {
            console.error('Error submitting exam', error);
            Swal.fire('Error!', 'There was an error submitting the exam.', 'error');
          }
        );
      } 
    });
  }

  deleteExam(examId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this exam?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        this.examService.deleteExam(examId).subscribe(
          () => {
            this.examList = this.examList.filter(exam => exam.id !== examId);
            Swal.fire('Deleted!', 'The exam has been deleted.', 'success');
          },
          error => {
            console.error('Error deleting exam:', error);
            Swal.fire('Error!', 'Failed to delete the exam.', 'error');
          }
        );
      }
    });
  }

  goBack() {
    this.location.back();
  }

  onDurationChange(duration: string) {
    console.log(duration);
    
    this.examDuration = duration;
  }

  goToCourseDetails():void {
    this.router.navigate(['/course-detail', this.courseId]);
  }

  viewQuestionFormClick(examId: number): void {
    // if (this.lesson?.examListDto.id) {
      this.examService.getExamById(examId).subscribe(
        (exam) => {
          console.log("exam:", exam);
          
          this.router.navigate([`/question-form/${examId}`], { state: { exam } });
        },
        (error) => {
          console.error('Error fetching course video view', error);
        }
      );
    // }
  }

  getCourseId(lessonId: number): void {
    this.courseService.getCourseIdByLessonId(lessonId).subscribe(
      courseId => {
        console.log('Course ID:', courseId);
        this.courseId= courseId;
        this.getCourseById(this.courseId);
      },
      error => {
        console.error('Error fetching course ID:', error);
      }
    );
  }

  getCourseById(courseId: number): void {
    this.courseService.getCourseById(courseId).subscribe(
      (data: Course) => {
        this.course = data;
        console.log(this.course.name);
        
      },
      error => {
        console.error('Error fetching course', error);
      }
    );
  }

 

 }
