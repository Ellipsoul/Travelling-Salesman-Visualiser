import { Component, OnInit, AfterContentInit, DoCheck } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { GridcommService } from '../../gridcomm.service';

@Component({
  selector: 'app-point',
  animations: [  // Animation states - states are selected from the html tag (check point.component.html)
    trigger("selector", [
      state(
        "hoverednunselected",  // When mouse is hovered over and point is unselected
        style({
          backgroundColor: "black",
          opacity: '15%',
          width: '50%',
          height: '50%'
        })
      ),
      state(
        "unselected",  // When mouse is NOT hovered over and point is unselected
        style({
          backgroundColor: "black",
          opacity: '15%',
          width: '35%',
          height: '35%'
        })
      ),
      state(
        "hoverednselected",  // When mouse is hovered over and point is selected
        style({
          backgroundColor: "black",
          opacity: '100%',
          width: '55%',
          height: '55%'
        })
      ),
      state(
        "selected",  // When mouse is NOT hovered over and point is selected
        style({
          backgroundColor: "black",
          opacity: '100%',
          width: '40%',
          height: '40%'
        })
      ),
      transition("* => *", [animate("0.05s")])  // Transition time from ANY state to ANY state
    ])
  ],
  templateUrl: './point.component.html',
  styleUrls: ['./point.component.css']
})

export class PointComponent implements OnInit, AfterContentInit, DoCheck {
  isSelected = false;
  isHovered = false;
  disabled = false;
  // Stores this point's coordinates
  x: number;
  y: number;


  constructor(private data: GridcommService) { }

  // Called in html when point is clicked
  selectToggle() {
    if (!this.disabled) {
      if (this.isSelected) {
        // Remove this point from the selectedpoints 'message'
        this.data.removeFromSelPointsMessage({x:this.x, y:this.y})
      } else {
        this.data.addToSelPointsMessage({x: this.x, y: this.y})  // Add this point to the selectedpoints 'message'
      }
    }
  }

  // Called in html when mouse moves into the component
  hoverIn() {
    if (!this.disabled) {
      this.isHovered = true;
    }
  }

  // Called in html when mouse leaves the component
  hoverOut() {
    if (!this.disabled) {
      this.isHovered = false;
    }
  }

  disable(): void{
    this.isHovered = false;
  }

  ngOnInit(): void {
    // Subscribe to selectedpoints 'message' - accesses the selectedpoints array held in the service; any updates will immediately be pushed to this.selectedPoints
    this.data.currentSelPointsMessage.subscribe(selPoints => this.isSelected = (selPoints.findIndex(i => i.x === this.x && i.y === this.y)) > -1);

    // An extra anonymous function is used:
    // this.isSelected = (selPoints.findIndex(i => i.x === this.x && i.y === this.y)) > -1
    // Whenever the 'message' is updated --> update this coordinate's selected state
    this.data.currentdisablePointsMessage.subscribe(disabled => {
      this.disabled = disabled;
      if (this.disable) {
        this.disable();
      }
    });
  }

  ngAfterContentInit(): void { }

  ngDoCheck(): void { }

  // Function to set this point component's coordinates
  setCoords(inx: number, iny: number){
    this.x = inx;
    this.y = iny;
  }

}
