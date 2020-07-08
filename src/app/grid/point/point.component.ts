import { Component, OnInit, AfterContentInit, DoCheck } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { GridcommService } from '../../gridcomm.service';

@Component({
  selector: 'app-point',
  animations: [ //animation states - states are selected from the html tag (check point.component.html)
    trigger("selector", [
      state(
        "hoverednunselected", //when mouse is hovered over and point is unselected
        style({
          backgroundColor: "black",
          opacity: '15%',
          width: '50%',
          height: '50%'
        })
      ),
      state(
        "unselected", //when mouse is NOT hovered over and point is unselected
        style({
          backgroundColor: "black",
          opacity: '15%',
          width: '35%',
          height: '35%'
        })
      ),
      state(
        "hoverednselected", //when mouse is hovered over and point is selected
        style({
          backgroundColor: "black",
          opacity: '100%',
          width: '55%',
          height: '55%'
        })
      ),
      state(
        "selected", //when mouse is NOT hovered over and point is selected
        style({
          backgroundColor: "black",
          opacity: '100%',
          width: '40%',
          height: '40%'
        })
      ),
      transition("* => *", [animate("0.05s")]) //transition time from ANY state to ANY state
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

  //stores this point's coordinates
  x: number;
  y: number;


  constructor(private data: GridcommService) { }

  selecttoggle() { //called in html when point is clicked
    // this.isSelected = !this.isSelected;
    if(this.isSelected){
      this.data.removeFromSelPointsMessage({x: this.x, y: this.y}) //remove this point from the selectedpoints 'message'
    }else{
      this.data.addToSelPointsMessage({x: this.x, y: this.y}) //add this point to the selectedpoints 'message'
    }
  }

  hoverin() { //called in html when mouse moves into the component
    this.isHovered = true;
  }

  hoverout() { //called in html when mouse leaves the component
    this.isHovered = false;
  }

  ngOnInit(): void {
    this.data.currentSelPointsMessage.subscribe(selPoints => this.isSelected = (selPoints.findIndex(i => i.x === this.x && i.y === this.y)) > -1); //subscribe to selectedpoints 'message' - accesses the selectedpoints array held in the service; any updates will immediately be pushed to this.selectedPoints
    //An extra anonymous function is used:
    //this.isSelected = (selPoints.findIndex(i => i.x === this.x && i.y === this.y)) > -1
    //Whenever the 'message' is updated --> update this coordinate's selected state
  }

  ngAfterContentInit(): void {
  }

  ngDoCheck(): void {
  }

  setCoords(inx: number, iny: number){ //function to set this point component's coordinates
    this.x = inx;
    this.y = iny;
  }

}
