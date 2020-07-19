import { Component, OnInit, DoCheck, ViewEncapsulation } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridcommService } from '../gridcomm.service';
import { MatDialog } from '@angular/material/dialog'
import { timer, range } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DialogInfoComponent } from './dialog-info/dialog-info.component';
import { unescapeIdentifier } from '@angular/compiler';
import { MatSnackBar } from '@angular/material/snack-bar';

// Define interface for single algorithm
interface Algorithms {
  value: string;
  viewValue: string;
}

// Define interface for groups of algorithms
interface AlgorithmGroup {
  name: string;
  algorithm: Algorithms[];
}

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})

export class TopbarComponent implements OnInit, DoCheck {

  // Constructor requires the GridcommService and MatDialog inputs
  constructor(private data: GridcommService, public dialog: MatDialog, private _snackBar: MatSnackBar) { }

  // ------------------------------------------------------------------------------------------------------------------
  // Variables

  // Paths management
  selectedPoints: {x: number, y:number}[] = [];     // Array of coordinate objects to store only selected points
  prevSelectedPoints: {x: number, y:number}[] = []; // Array with previous selected points for change detection
  // Points management
  noRows = Math.floor(window.innerHeight/46); // Dynamically allocate number of rows of points
  noCols = Math.floor(window.innerWidth/35);  // Dynamically allocate number of columns of points

  // Vertices buttons manager
  verticesButtonsDisabled:boolean = false;

  // Top Bar points and possible paths counter
  currPointAmount:number = 0;     // Number of current points
  randomPointAmount: number = 3;  // Start at min number of points
  possPaths:string = "0";         // Possible number of paths

  // Timer control
  counter:number = 0;                     // Timer counter
  counterSeconds:number = 0;              // Timer counter in seconds
  timerRunning:boolean = false;           // Boolean to know if timer is running
  startText:string = "Start!";            // Text at beginning
  timeRef:any;                            // Reference time from start time
  startButtonColor:string = "success";    // Button color
  startButtonDisabled:boolean = false;    // Start button disabled or not
  abort:boolean = false;                  // Functions listening to abort

  // Algorithm Select
  algorithmControl =  new FormControl();  // Initialise form control for algorithm selector
  algorithmsMenu: AlgorithmGroup[] = [
    {
      name: "Exhaustive Algorithms",
      algorithm: [
        {value: "depth-first-search", viewValue: "Depth First Search"},
        {value: "random-search", viewValue: "Random"},
        {value: "branch-and-bound", viewValue: "Branch and Bound"}
      ]
    },
    {
      name: "Heuristic Algorithms",
      algorithm: [
        {value: "nearest-neighbour", viewValue: "Nearest Neighbour"},
        {value: "arbitrary-insertion", viewValue: "Arbitrary Insertion"},
        {value: "nearest-insertion", viewValue: "Nearest Insertion"},
        {value: "furthest-insertion", viewValue: "Furthest Insertion"}
      ]
    }
  ]
  selectedAlgorithm:string;

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
    console.log(this.selectedPoints)
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
  createPath(inPath:{A:{x: number; y:number}; B: {x: number; y:number}}): void {
    this.data.addToPaths(inPath);              // Create the path
  }

  // Removes path specified by A and B coordinates
  removePath(inPath: {A:{x: number; y:number}; B: {x: number; y:number}}): void {
    this.data.removeFromPaths(inPath);
  }

  // Remove all paths
  removeAllPaths():void {
    this.data.clearAllPaths();
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

  // Randomise point order
  randomiseSelectedPoints(): void {
    this.selectedPoints.sort(() => Math.random() - 0.5)
  }

  // Start timer
  startTimer(): void {
    // Check if an algorithm is actually selected
    if (this.selectedAlgorithm === undefined) {
      this.noAlgorithmSelected();
    }
    // Check that enough nodes were selected
    else if (this.currPointAmount < 3) {
      this.notEnoughNodesSelected();
    }
    else {
      this.timerRunning = !this.timerRunning      // Negate whether timer is running
      this.verticesButtonsDisabled = true;        // Disable vertices control buttons

      // Handles starting the timer
      this.startText = "Running";
      this.startButtonDisabled = true;
      this.startButtonColor = "accent";
      const startTime = Date.now() - this.counter;
      this.timeRef = setInterval(() => {
        this.counter = Date.now() - startTime;
        this.counterSeconds = Math.round(this.counter/1000);
      });

      // Run the algorithm!
      this.runAlgorithm()
    }
  }

  // Shuffle selected points array (calling from the service)
  shuffleSelectedPoints():void {
    this.data.shuffleSelectedPoints()
    console.log(this.selectedPoints)
  }

  //--------------------------------------------------------------------------------------------------------------------
  // Algorithms

  // Redirect to all the different algorithms depending on the selected one
  runAlgorithm(): void {
    // Points must be shuffled when the algorithm runs
    this.shuffleSelectedPoints()

    // Perform the desired algorithm
    switch (this.selectedAlgorithm) {
      // Exhaustive Algorithms
      case "depth-first-search":
        this.depthFirstSearch()
        break

      case "random-search":
        this.randomSearch()
        break

      case "branch-and-bound":
        this.branchAndBound()
        break

      case "nearest-neighbour":
        this.nearestNeighbour()
        break

      // Heuristic Algorithms
      case "arbitrary-insertion":
        this.arbitraryInsertion()
        break

      case "nearest-insertion":
        this.nearestInsertion()
        break

      case "furthest-insertion":
        this.furtherInsertion()
        break
    }

    // TODO: Some sort of cleanup after finishing algorithm (pausing timer/making paths opaque)
    this.startText = "Finished"
    clearInterval(this.timeRef)  // Pause the timer when done
  }

  // Exhaustive algorithms
  depthFirstSearch():void {
    console.log("Starting Depth First Search!")
  }

  randomSearch():void {
    console.log("Starting Random Search!")
  }

  branchAndBound():void {
    console.log("Starting Branch and Bound!")
  }

  // Heuristic algorithms
  async nearestNeighbour():Promise<void>{
    console.log("Starting Nearest Neighbour!")
    // Initialise array of visited points (first point will be considered visited)
    let pointVisited:boolean[] = [];
    for (let i=0; i<this.selectedPoints.length; i++) {
      pointVisited.push(false)
    }
    // Declare variables for the iteration
    let minDistance:number;        // Minimum distance between points
    let currentDistance:number;    // Current comparison distance
    let minDistanceIndex:number;   // Index of closest point
    let currentIndex:number = 0;   // Current index, starting from 0
    let previousIndex:number;      // Tracking previous index for path creation

    // Algorithm main logic
    for (let _=0; _<this.selectedPoints.length-1; _++) {
      pointVisited[currentIndex] = true;  // First set the point as visited
      minDistance = Infinity;             // Initialise minimum distance point
      minDistanceIndex = -1;              // Initialise minimum distance index
      // Another pass through the entire array
      for (let j=0; j<this.selectedPoints.length; j++) {
        // Only check the point if it has not been visited
        if (pointVisited[j] === false) {
          // Calculate distance between points
          currentDistance = this.distanceBetweenPoints(this.selectedPoints[currentIndex], this.selectedPoints[j])
          // Update the minimum distance and min distance index
          if (currentDistance < minDistance) {
            minDistance = currentDistance;
            minDistanceIndex = j;
          }
        }
      }  // Closest remaining unvisited point should be found

      previousIndex = currentIndex;     // Temporarily store last index for path creation
      currentIndex = minDistanceIndex;  // Update next point to go to
      console.log(this.selectedPoints[previousIndex])
      console.log(this.selectedPoints[currentIndex])
      await this.sleep(50);  // Making use of async-await
      // Create the path
      this.createPath({A:{x:this.selectedPoints[previousIndex].x, y:this.selectedPoints[previousIndex].y},
                       B:{x:this.selectedPoints[currentIndex].x,  y:this.selectedPoints[currentIndex].y}});
    }  // End of algorithm iterations
    // Finish off with pathing back to the starting node
    this.createPath({A:{x:this.selectedPoints[currentIndex].x, y:this.selectedPoints[currentIndex].y},
                     B:{x:this.selectedPoints[0].x,  y:this.selectedPoints[0].y}
                    });
  }

  arbitraryInsertion():void {
    console.log("Starting Arbitrary Insertion!")
  }

  nearestInsertion():void {
    console.log("Starting Nearest Insertion!")
  }

  furtherInsertion():void {
    console.log("Starting furthest insertion")
  }

  // Algorithm helpers

  // Calculates distance bewtween 2 points
  distanceBetweenPoints(pointA:{x:number, y:number}, pointB:{x:number, y:number}):number {
    let distance = Math.sqrt( Math.pow(Math.abs(pointA.x-pointB.x), 2) +
                              Math.pow(Math.abs(pointA.y-pointB.y), 2))
    return distance
  }

  // Sleeping function (works only with asynchronous functions)
  sleep(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  //--------------------------------------------------------------------------------------------------------------------

  // Reset timer
  resetTimer(): void {
    this.verticesButtonsDisabled = false;
    this.timerRunning = false;
    this.startButtonColor = "success";
    this.startButtonDisabled = false;
    this.startText = "Start!";
    this.counter = 0;
    this.counterSeconds = 0;
    this.removeAllPaths(); // REMOVES ALL PATHS
    clearInterval(this.timeRef);
  }

  // Opens the dialog
  openDialog():void {
    this.dialog.open(DialogInfoComponent);
  }

  // Opens the snackbar warning of no algorithm selected
  noAlgorithmSelected():void {
    this._snackBar.open("Please select an algorithm!", "Close", {
      duration: 5000,
    });
  }

  // Opens a snackbar warning user that not enough nodes were selected
  notEnoughNodesSelected():void {
    this._snackBar.open("You must initialise at least 3 vertices!", "Close", {
      duration: 5000
    })
  }

}
