import { Component, OnInit, AfterContentInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-point',
  animations: [
    trigger("selector", [
      state(
        "unselected",
        style({
          // height: "250px",
          opacity: 1,
          backgroundColor: "red"
        })
      ),
      state(
        "selected",
        style({
          // height: "100px",
          opacity: 0.5,
          backgroundColor: "blue"
        })
      ),
      transition("* => selected", [animate("0.5s")]),
      transition("* => unselected", [animate("0.5s")])
    ])
  ],
  templateUrl: './point.component.html',
  styleUrls: ['./point.component.css']
})
export class PointComponent implements OnInit, AfterContentInit {
  isSelected = false;
  x;
  y;

  toggle() {
    this.isSelected = !this.isSelected;
  }

  constructor() { }

  ngOnInit(): void {

  }

  ngAfterContentInit(): void {
  }

}
