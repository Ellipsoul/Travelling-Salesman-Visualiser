import { Component, OnInit, AfterContentInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { GridcommService } from '../../gridcomm.service';

@Component({
  selector: 'app-point',
  animations: [
    trigger("selector", [
      state(
        "hoverednunselected",
        style({
          backgroundColor: "pink",
          width: '15px',
          height: '15px',
          margin: '7.5px'
        })
      ),
      state(
        "unselected",
        style({
          backgroundColor: "red"
        })
      ),
      state(
        "hoverednselected",
        style({
          backgroundColor: "skyblue",
          width: '15px',
          height: '15px',
          margin: '7.5px'
        })
      ),
      state(
        "selected",
        style({
          backgroundColor: "blue",
        })
      ),
      transition("* => *", [animate("0.05s")])
      // transition("* => selected", [animate("0.5s")]),
      // transition("* => hovered", [animate("0.5s")]),
      // transition("* => unselected", [animate("0.5s")])
    ])
  ],
  templateUrl: './point.component.html',
  styleUrls: ['./point.component.css']
})
export class PointComponent implements OnInit, AfterContentInit {
  isSelected = false;
  isHovered = false;
  x: Number;
  y: Number;

  message: string;

  // constructor() { }
  constructor(private data: GridcommService) { }

  selecttoggle() {
    this.isSelected = !this.isSelected;
    var outmessage = this.x.toString() + ',' + this.y.toString() + ',' + (this.isSelected?'Y':'N');

    console.log(outmessage);

    this.data.changeMessage(outmessage);
  }

  hoverin() {
    this.isHovered = true;
  }

  hoverout() {
    this.isHovered = false;
  }

  ngOnInit(): void {
    this.data.currentMessage.subscribe(message => this.message = message);
  }

  ngAfterContentInit(): void {
  }

  setCoords(inx: number, iny: number){
    this.x = inx;
    this.y = iny;
  }

}
