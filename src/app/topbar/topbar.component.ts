import { Component, OnInit, DoCheck, ViewEncapsulation } from '@angular/core';
import {FormControl} from '@angular/forms';
import { GridcommService } from '../gridcomm.service';
import { MatDialog } from '@angular/material/dialog'
import { timer } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DialogInfoComponent } from './dialog-info/dialog-info.component';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})

export class TopbarComponent implements OnInit, DoCheck {

  // Constructor requires the GridcommService and MatDialog inputs
  constructor(private data: GridcommService, public dialog: MatDialog) { }

  // ------------------------------------------------------------------------------------------------------------------
  // Variables

  // Paths management
  selectedPoints: {x: number, y:number}[] = [];     // Array of coordinate objects to store only selected points
  prevSelectedPoints: {x: number, y:number}[] = []; // Array with previous selected points for change detection
  // Points management
  noRows = 21;  // Number of rows of points
  noCols = 50;  // Number of columns of points

  // Top Bar points and possible paths counter
  currPointAmount:number = 0;     // Number of current points
  randomPointAmount: number = 3;  // Start at min number of points
  possPaths:string = "0";         // Possible number of paths

  // Timer control
  counter:number = 0;                   // Timer counter
  counterSeconds:number = 0;            // Timer counter in seconds
  timerRunning:boolean = false;         // Boolean to know if timer is running
  startText:string = "Start!";          // Text at beginning
  timeRef:any;                          // Reference time from start time
  startButtonColor:string = "success";  // Button color

  // ------------------------------------------------------------------------------------------------------------------
  // Class functions

  // Subscribe to selectedpoints 'message' - accesses the selectedpoints array held in the service;
  // Any updates will immediately be pushed to this.selectedPoints
  ngOnInit(): void {
    this.data.currentSelPointsMessage.subscribe(message => this.selectedPoints = message);
    this.possPaths = this.calculatePossiblePaths(this.currPointAmount);
    // this.openDialog(); TODO: Uncomment this once done with project
  }

  // Runs whenever a change is detected in ANY component in the app (could be mouse changes or any data changes)
  ngDoCheck(): void {
    if(!this.arraysEqual(this.prevSelectedPoints, this.selectedPoints)) {  // If there is a change in selected points
      // Update previous selected points; slice makes copy of array - cannot just update with (=)
      this.prevSelectedPoints = this.selectedPoints.slice(0);
      this.currPointAmount = this.selectedPoints.length;
      this.possPaths = this.calculatePossiblePaths(this.currPointAmount);
    }
  }

  // Calculate the possible number of paths
  calculatePossiblePaths(currPointAmount:number): string{
    if (currPointAmount < 3) {
      return "N/A"
    }
    // Format properly depending on number size
    let possiblePaths = this.factorial(currPointAmount - 1) / 2
    if (possiblePaths < 100000000) {
      return possiblePaths.toString()
    }
    else {
      return possiblePaths.toExponential(3)
    }
  }

  // Simple factorial
  factorial(currPointAmount:number): number {
    return (currPointAmount != 1) ? currPointAmount * this.factorial(currPointAmount - 1) : 1;
  }

  // Function to update the number of random points selected
  updateRandomAmount(event): void {
    this.randomPointAmount = event.value;
    this.possPaths = this.calculatePossiblePaths(this.currPointAmount);  // Recalculate possible paths
  }

  // Auxiliary function (can be called from html) to add a number (no) of random points in the grid
  // Combine with clearAll for generation instead of appending random points
  randomize(no: number): void{
    this.clearAll();
    for(let num = 0; num < no; num++){
      var added = false;
      while(!added){
        // Updates the selectedpoints 'message' with the new random point. More info: gridcomm.service.ts
        added = this.data.addToSelPointsMessage(
          { x: this.getRandomNumberBetweenZ(this.noCols),
            y: this.getRandomNumberBetweenZ(this.noRows)});
      }
    }
  }

  // Auxiliary function (can be called from html) to clear all selected points
  clearAll(): void{
    this.data.changeSelPointMessage([]);  // Empties the selectedpoints 'message'; More info: gridcomm.service.ts
  }

  // Helper function to generate random number
  getRandomNumberBetweenZ(max: number): number{
    return Math.floor(Math.random()*(max));
  }

  // Creates path specified by A and B coordinates
  createPath(inPath: {A:{x: number; y:number}; B: {x: number; y:number}}): void {
    this.data.addToPaths(inPath);           // Create the path
    this.data.currPaths.push(inPath);       // Add path to paths list
  }

  // Removes path specified by A and B coordinates
  removePath(inPath: {A:{x: number; y:number}; B: {x: number; y:number}}): void {
    this.data.removeFromPaths(inPath);
  }

  // Array equality checker (can't simply call [] === [] in typescript)
  arraysEqual(a: any[], b: any[]): boolean {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (var i = 0; i < a.length; ++i) {  // Element-wise checking
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  // Start timer
  startTimer(): void {
    this.createPath({A:{x:1,y:1},B:{x:3,y:3}});
    this.timerRunning = !this.timerRunning  // Negate whether timer is running
    if (this.timerRunning) {
      this.startText = "Pause";
      this.startButtonColor = "accent";
      const startTime = Date.now() - this.counter;
      this.timeRef = setInterval(() => {
        this.counter = Date.now() - startTime;
        this.counterSeconds = Math.round(this.counter/1000);
      });
    }
    else {
      this.startText = "Start!";
      this.startButtonColor = "success";
      clearInterval(this.timeRef);
    }
  }

  // Reset timer
  resetTimer(): void {
    this.removePath({A:{x:1,y:1},B:{x:3,y:3}});
    this.timerRunning = false;
    this.startButtonColor = "success";
    this.startText = "Start!";
    this.counter = 0;
    this.counterSeconds = 0;
    clearInterval(this.timeRef);
  }

  // Opens the dialog
  openDialog():void {
    this.dialog.open(DialogInfoComponent);
  }
}
