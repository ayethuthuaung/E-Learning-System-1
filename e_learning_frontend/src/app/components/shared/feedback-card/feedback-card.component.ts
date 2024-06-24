import { Component, Input, OnInit } from '@angular/core';
import { Feedback } from '../../models/feedback.model';


@Component({
  selector: 'app-feedback-card',
  templateUrl: './feedback-card.component.html',
  styleUrls: ['./feedback-card.component.css']
})
export class FeedbackCardComponent implements OnInit {

  @Input('item')
  item!:Feedback;
  
  constructor() { }

  ngOnInit(): void {
  }

}
