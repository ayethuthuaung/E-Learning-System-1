import { Component, Input, OnInit } from '@angular/core';
import { Courses } from '../../models/courses.model';
import { Blog } from '../../models/blog.model';


@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  @Input('input')
  input!:Courses|Blog;

  @Input('type')
  type = 'C' // C,B
  
  constructor() { }

  castToCourse(input:Courses|Blog){
    return input as Courses;
  }

  castToBlog(input:Courses|Blog){
    return input as Blog;
  }

  ngOnInit(): void {
  }

}
