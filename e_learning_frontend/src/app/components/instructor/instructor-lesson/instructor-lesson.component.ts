import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Module } from '../../models/module.model';
import { Lesson } from '../../models/lesson.model';
import { LessonService } from '../../services/lesson.service';

@Component({
  selector: 'app-instructor-lesson',
  templateUrl: './instructor-lesson.component.html',
  styleUrls: ['./instructor-lesson.component.css']
})
export class InstructorLessonComponent implements OnInit {

  courseId: number = -1; // Initialize courseId with a default value
  course = { name: '' };
  modules: Module[] = [];
  nameDuplicateError = false;
  isSidebarOpen = true;
  activeTab: string = 'createLesson';

  constructor(private route: ActivatedRoute, private lessonService: LessonService) { }

  ngOnInit(): void {
    const courseIdParam = this.route.snapshot.paramMap.get('courseId');
    console.log('Course ID Param:', courseIdParam);

    if (courseIdParam !== null) {
      this.courseId = +courseIdParam; // Convert courseIdParam to number if not null
    }
  }

  addModule() {
    this.modules.push({ name: '', file:'',fileInput: null, fileType:null }); // Initialize File as null
    console.log(this.modules);
    
  }

  validateCourseName(name: string) {
    // Implement your validation logic here
    // For example, checking for duplicate names
    this.nameDuplicateError = false; // Set to true if a duplicate name is found
  }

  removeModule(index: number) {
    this.modules.splice(index, 1);
    console.log(this.modules);
    
  }


  onSubmit(courseForm: any) {
    if (courseForm.valid) {
        const formData = new FormData();
        formData.append('courseId', this.courseId.toString());
        formData.append('title', this.course.name);

        this.modules.forEach((module, index) => {
            formData.append(`modules[${index}].name`, module.name);
            if (module.fileInput) {
                formData.append(`modules[${index}].fileInput`, module.fileInput, module.fileInput.name);
            }
        });

        this.lessonService.createLesson(formData).subscribe(
            (createdLesson) => {
                console.log('Lesson Created:', createdLesson);
            },
            (error) => {
                console.error('Error creating lesson:', error);
            }
        );
    }
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
}
