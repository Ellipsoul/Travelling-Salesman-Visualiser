import { Component, OnInit, DoCheck } from '@angular/core';
import {FormControl} from '@angular/forms';
import { GridcommService } from '../gridcomm.service';



@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})

export class TopbarComponent implements OnInit, DoCheck {

  constructor(private data: GridcommService) { }


  selectedPoints: {x: number, y:number}[] = []; //array of coordinate objects to store only selected points
  prevSelectedPoints: {x: number, y:number}[] = []; //array with previous selected points for change detection

  noRows = 21; //number of rows of points
  noCols = 50; //number of columns of points
  currPointAmount = 0;
  randomPointAmount: number = 2; //start at min number of points
  possPaths: string = '0'; //possible number of paths - string so we can format it better?

  ngOnInit(): void {
    this.data.currentSelPointsMessage.subscribe(message => this.selectedPoints = message); //subscribe to selectedpoints 'message' - accesses the selectedpoints array held in the service; any updates will immediately be pushed to this.selectedPoints
    this.setPossiblePaths();
  }

  ngDoCheck() { //runs whenever a change is detected in ANY component in the app (could be mouse changes or any data changes)
    if(!this.arraysEqual(this.prevSelectedPoints, this.selectedPoints)){ //if there is a change in selected points
      this.prevSelectedPoints = this.selectedPoints.slice(0); //update previous selected points; slice makes copy of array - cannot just update with (=)
      this.currPointAmount = this.selectedPoints.length;
      console.log("changed");
    }
  }

  updateRandomAmount(event) {
    this.randomPointAmount = event.value;
    this.setPossiblePaths();
  }

  randomize(no: number): void{ //auxiliary function (can be called from html) to add a number (no) of random points in the grid - combine with clearAll for generation instead of appending random points
    this.clearAll();
    for(let num = 0; num < this.randomPointAmount; num++){
      var added = false;
      while(!added){
        added = this.data.addToSelPointsMessage({x: this.getRandomNumberBetweenZ(this.noCols), y: this.getRandomNumberBetweenZ(this.noRows)}); //updates the selectedpoints 'message' with the new random point - see gridcomm.service.ts for more information
      }
    }
  }

  clearAll(): void{ //auxiliary function (can be called from html) to clear all selected points
    this.data.changeSelPointMessage([]); //empties the selectedpoints 'message' - see gridcomm.service.ts for more information
  }


  setPossiblePaths(): void{
    this.possPaths = this.currPointAmount.toString();
  }



  getRandomNumberBetweenZ(max: number){ //helper function to generate random number
    return Math.floor(Math.random()*(max));
  }

  arraysEqual(a: any[], b: any[]) { //array equality checker (can't simply call [] === [] in typescript)
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (var i = 0; i < a.length; ++i) { //element-wise checking
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

}
