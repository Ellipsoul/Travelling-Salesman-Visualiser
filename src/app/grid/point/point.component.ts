import { Component, OnInit, AfterContentInit, DoCheck } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { GridcommService } from '../../gridcomm.service';

@Component({
  selector: 'app-point',
  animations: [
    trigger("selector", [
      state(
        "hoverednunselected",
        style({
          backgroundColor: "black",
          opacity: '15%',
          width: '50%',
          height: '50%'
          // width: '15px',
          // height: '15px'
        })
      ),
      state(
        "unselected",
        style({
          backgroundColor: "black",
          opacity: '15%',
          width: '35%',
          height: '35%'
          // width: '10px',
          // height: '10px'
        })
      ),
      state(
        "hoverednselected",
        style({
          backgroundColor: "black",
          opacity: '100%',
          width: '55%',
          height: '55%'
          // width: '17px',
          // height: '17px'
        })
      ),
      state(
        "selected",
        style({
          backgroundColor: "black",
          opacity: '100%',
          width: '40%',
          height: '40%'
          // width: '12px',
          // height: '12px'
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
export class PointComponent implements OnInit, AfterContentInit, DoCheck {
  isSelected = false;
  isHovered = false;
  x: number;
  y: number;


  constructor(private data: GridcommService) { }

  selecttoggle() {
    // this.isSelected = !this.isSelected;
    if(this.isSelected){
      this.data.removeFromSelPointsMessage({x: this.x, y: this.y})
    }else{
      this.data.addToSelPointsMessage({x: this.x, y: this.y})
    }
  }

  hoverin() {
    this.isHovered = true;
  }

  hoverout() {
    this.isHovered = false;
  }

  ngOnInit(): void {
    this.data.currentSelPointsMessage.subscribe(selPoints => this.isSelected = (selPoints.findIndex(i => i.x === this.x && i.y === this.y)) > -1);
  }

  ngAfterContentInit(): void {
  }

  ngDoCheck(): void {
  }

  setCoords(inx: number, iny: number){
    this.x = inx;
    this.y = iny;
  }

}
