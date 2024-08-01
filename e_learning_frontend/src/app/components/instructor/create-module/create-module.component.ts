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
import { TimerComponent } from '../../shared/timer/timer.component';
import { FormGroup } from '@angular/forms';




@Component({
  selector: 'app-create-module',
  templateUrl: './create-module.component.html',
  styleUrl: './create-module.component.css'
})
export class CreateModuleComponent implements OnInit{

  lessonId: number = -1;
  lessons :Lesson[] =[];
  lesson!: { title: ''; };
  modules: Module[] = [{ id: 1, name: '',url: "", file: '', fileInput: null, fileType: '' ,done:false, createdAt: Date.now()}];
  moduleList: Module[]=[];
  courseId: number = 0;
  errorMessage: string = '';
  isSidebarOpen = true;
  activeTab: string = 'createModule';
examForm: any;

loading = false;
currentModuleIndex: number = -1;
isEditing: boolean = false;

course: Course | undefined;
moduleForm: FormGroup | undefined;
  
  moduleFormSubmitted = false;

@ViewChild('formRef') formRef!: ElementRef;
@ViewChild(TimerComponent) timerComponent!: TimerComponent;





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
    this.modules.push({ id:1,name: '',url: '', file:'',fileInput: null, fileType:'',done:false, createdAt: Date.now()}); // Initialize File as null
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
          this.modules = [{ id: 1, name: '',url: '', file: '', fileInput: null, fileType: '' ,done:false, createdAt: Date.now()}];

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
                this.modules = [{ id: 1, name: '',url: '', file: '', fileInput: null, fileType: '' ,done:false, createdAt: Date.now()}];
  
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
      }  else {
        this.errorMessage = 'Please fill the required fields';
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
     this.clearErrorMessage()
   }

   clearErrorMessage() {
    this.errorMessage = '';
  }

  goBack() {
    this.location.back();
  }

  goToCourseDetails():void {
    this.router.navigate(['/course-detail', this.courseId]);
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

