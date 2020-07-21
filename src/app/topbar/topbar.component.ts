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

  // Distance control
  currentPathDistance:number = 0;         // Current path distance
  minPathDistance:number = 0;             // Minimum path distance
  distanceMatrix:number[][] = [];         // Matrix of distances between points

  // Algorithm Select
  algorithmControl =  new FormControl();  // Initialise form control for algorithm selector
  algorithmsMenu: AlgorithmGroup[] = [
    {
      name: "Brute Force Algorithms",
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
        {value: "nearest-insertion", viewValue: "Nearest Insertion"},
        {value: "farthest-insertion", viewValue: "Farthest Insertion"},
        {value: "arbitrary-insertion", viewValue: "Arbitrary Insertion"},
        {value: "convex-hull", viewValue: "Convex Hull"}
      ]
    }
  ]
  selectedAlgorithm:string;  // Currently selected algorithm

  // Speed Control
  runSpeed:number = 10000 / 505;

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
  updateRandomAmount(event:any): void {
    this.randomPointAmount = event.value;
    this.possPaths = this.calculatePossiblePaths(this.currPointAmount);  // Recalculate possible paths
  }

  // Auxiliary function (can be called from html) to add a number (no) of random points in the grid
  // Combine with clearAll for generation instead of appending random points
  randomize(no: number): void{
    this.clearAll();        // Removing all points
    this.removeAllPaths();  // Removing all paths
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
    this.removeAllPaths();                // Removing all paths
  }

  // Helper function to generate random number
  getRandomNumberBetweenZ(max: number): number{
    return Math.floor(Math.random()*(max));
  }

  // Creates path specified by A and B coordinates
  createPath(inPath:{A:{x: number, y:number}, B: {x: number, y:number}}): void {
    this.data.addToPaths(inPath);              // Create the path
  }

  // Removes path specified by A and B coordinates
  removePath(inPath: {A:{x: number, y:number}, B: {x: number, y:number}}): void {
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
        this.counterSeconds = Math.round(this.counter/100)/10;
      });

      // Run the algorithm!
      this.runAlgorithm()
    }
  }

  // Event to update the speed variable
  updateSpeed(event:any):void {
    this.runSpeed = 10000 / event.value;
    // this.runSpeed = Math.abs(event.value - 1010);  //  Linear mapping of runSpeed
    console.log(this.runSpeed);  // Logarithmic mapping of runSpeed
  }

  //--------------------------------------------------------------------------------------------------------------------
  // Algorithms

  // Redirect to all the different algorithms depending on the selected one
  async runAlgorithm():Promise<void> {
    // Points must be shuffled when the algorithm runs
    this.shuffleSelectedPoints()
    // Disable all points from being clicked
    this.data.disableAllPoints(true);
    // Perform the desired algorithm
    switch (this.selectedAlgorithm) {
      // Exhaustive Algorithms
      case "depth-first-search":
        await this.depthFirstSearch()
        break

      case "random-search":
        await this.randomSearch()
        break

      case "branch-and-bound":
        await this.branchAndBound()
        break

      case "nearest-neighbour":
        await this.nearestNeighbour()
        break

      // Heuristic Algorithms
      case "arbitrary-insertion":
        await this.arbitraryInsertion()
        break

      case "nearest-insertion":
        await this.nearestInsertion()
        break

      case "farthest-insertion":
        await this.fartherInsertion()
        break

      case "convex-hull":
        await this.convexHull()
        break
    }

    // =================================================================================================================
    // Setting Path Types

    // NOTE - MUST USE await this.sleep(1) ~~~ OTHERWISE paths can't keep up with the changes - which was why it didn't work yesterday

    // Setting a single path type:
    // NOTE - 1ms seems to work fine and not cause errors + doesn't cause noticeable delay
    // for(let p = 0; p < this.data.currPaths.length; p++){
    //   await this.sleep(1);
    //   this.data.setIndividualPathType(this.data.currPaths[p], 1);
    // }

    // Setting type of all existing paths
    // CAUTION - sets all EXISTING paths to this type ~ HOWEVER: future paths will be created with the default type-0 (open to discussion ~ is this wanted behaviour?)
    // WHEN SETTING TYPES, all paths only detect CHANGES in the allPathType
    // SO if you want to set all paths to type-1 again, need an update with another data.setAllExistingPathsType(1)

    await this.sleep(1);
    this.data.setAllExistingPathsType(1);
    // =================================================================================================================

    clearInterval(this.timeRef)                // Pause the timer when done
    this.timerRunning = false;                 // Stop "timerRunning"
    if (!this.abort) {
      // Set all lines to opaque
      this.startText = "Finished!"             // Display that the algorithm has finished
      this.algorithmFinished();
    } else {
      this.abort = false;                      // Setting abort back to false if aborted
    }
  }

  //--------------------------------------------------------------------------------------------------------------------
  // Exhaustive algorithms

  // Depth First Search
  async depthFirstSearch():Promise<void> {  // recursive implementation
    console.log("Starting Depth First Search!")
    // Copy of selected points created for safety
    let selectedPointsCopy = this.selectedPoints.slice(0)

    // Best solution created as an object ~ a "hacky" method to allow values to be changed by reference (any changes in the function will be applied to this variable)
    // minDist contains the shortest path distance, minPath contains corresponding points that makes that path
    let bestSolution:{minDist:number, minPath:{x:number, y:number}[]} = {minDist:Number.MAX_VALUE,minPath:[]};

    //await for function to finish before moving on
    await this.permutePoints(selectedPointsCopy.slice(1), [], this.selectedPoints[0], bestSolution); // notice selectedPointsCopy.slice(1) - the first point can be neglected as it will always be the start point ~ only need to permute the remaining n-1 points to find possible paths

    if (this.abort) {
      this.removeAllPaths();             // Repeated removeAllPaths in case of asynchronous call
      return;
    };

    // console.log(bestSolution.minDist)
    let bestPath = bestSolution.minPath; //array of coordinates that makes best path
    let pathLength = bestPath.length;

    for(let b = 0; b < pathLength-1; b++){ //draw out best path for for final printing
      this.createPath({A:{x:bestPath[b].x, y:bestPath[b].y}, B:{x:bestPath[b+1].x,  y:bestPath[b+1].y}});
    }
    this.createPath({A:{x:bestPath[0].x, y:bestPath[0].y}, B:{x:bestPath[pathLength-1].x,  y:bestPath[pathLength-1].y}});

    this.currentPathDistance = Math.round((bestSolution.minDist + Number.EPSILON) * 100) / 100;
    this.minPathDistance = this.currentPathDistance;
  }

  // depthFirstSearch Helper: Recursive asynchronous function to go through all possible combinations of points
  async permutePoints(leftoverPoints:{x:number, y:number}[], pointSequence:{x:number, y:number}[], previousPoint: {x:number, y:number}, sol:{minDist:number, minPath:{x:number, y:number}[]}): Promise<void>{

    if (this.abort) { // multiple abort checks to catch recursive calls at various depths and abort
      return;
    };

    if(leftoverPoints.length === 0){ // BASE CASE: whenever all remaining points are used up OR whenever a permutation is complete
      // create path to complete loop
      let newPath = {A:{x:this.selectedPoints[0].x, y:this.selectedPoints[0].y}, B:{x:pointSequence[pointSequence.length-1].x,  y:pointSequence[pointSequence.length-1].y}};

      await this.sleep(this.runSpeed); // Making use of async-await to create path
      this.data.setAllExistingPathsType(0);
      this.createPath(newPath);
      if (this.abort) { // multiple abort checks to catch recursive calls at various depths and abort
        return;
      };
      this.data.setIndividualPathType(newPath,2);

      // calculate distance formed by path loop
      let totalDist = this.distanceBetweenPoints(this.selectedPoints[0],pointSequence[0]);
      for(let p = 0; p < pointSequence.length-1; p++){
        totalDist += this.distanceBetweenPoints(pointSequence[p],pointSequence[p+1]);
      }
      totalDist += this.distanceBetweenPoints(pointSequence[pointSequence.length-1], this.selectedPoints[0]);
      // set current distance
      this.currentPathDistance = Math.round((totalDist + Number.EPSILON) * 100) / 100;

      // if distance is shorter than current minimum, then update minPath and minDist
      if(totalDist <= sol.minDist){
        let minPath = [this.selectedPoints[0]].concat(pointSequence)
        sol.minDist = totalDist;
        sol.minPath = minPath;
        this.minPathDistance = Math.round((sol.minDist + Number.EPSILON) * 100) / 100;
      }

      await this.sleep(this.runSpeed); // Making use of async-await to remove path
      this.removePath(newPath);
      if (this.abort) { // multiple abort checks to catch recursive calls at various depths and abort
        return;
      };

      return;
    }
    for(let i = 0; i < leftoverPoints.length; i++){ // RECURSIVE CASE: for remaining unused points, go through all permutations of this subset (through recursion)

      if (this.abort) { // multiple abort checks to catch recursive calls at various depths and abort
        return;
      };
      // keep one point fixed and permute the rest
      let currPoint:{x:number, y:number} = leftoverPoints[i];

      await this.sleep(this.runSpeed); // Making use of async-await to create path
      let newPath = {A:{x:previousPoint.x, y:previousPoint.y}, B:{x:currPoint.x,  y:currPoint.y}};
      this.data.setAllExistingPathsType(0);
      this.createPath(newPath);
      this.data.setIndividualPathType(newPath,2);
      // remove the fixed point from leftover points
      let newLeftoverPoints = leftoverPoints.slice(0,i).concat(leftoverPoints.slice(i+1));
      // add the fixed point to the current permutation
      // HOWEVER because how javascript works with arrays, we don't want to modify the original array by reference
      // SO we make a copy of the array and the point is removed
      pointSequence.push(currPoint);
      let newPointSequence = pointSequence.slice(0);
      pointSequence.splice(pointSequence.length-1,1);
      // recurse with remaning unused points and current permutation
      await this.permutePoints(newLeftoverPoints, newPointSequence, currPoint, sol);

      if (this.abort) { // multiple abort checks to catch recursive calls at various depths and abort
        return;
      };

      await this.sleep(this.runSpeed); // Making use of async-await to remove path
      this.removePath(newPath);
    }

  }

  // Random Search
  async randomSearch():Promise<void> {
    console.log("Starting Random Search!")
  }

  // Branch and Bound Algorithm
  async branchAndBound():Promise<void> {
    console.log("Starting Branch and Bound!")
  }

  //--------------------------------------------------------------------------------------------------------------------
  // Heuristic algorithms

  // Nearest Neighbour
  async nearestNeighbour():Promise<void>{
    console.log("Starting Nearest Neighbour!")
    // Initialise array of visited points (first point will be considered visited)
    let pointVisited:boolean[] = [];
    for (let i=0; i<this.selectedPoints.length; i++) {
      pointVisited.push(false)
    }
    // Declare variables for the iteration
    let minDistance:number;            // Minimum distance between points
    let currentDistance:number;        // Current comparison distance
    let minDistanceIndex:number;       // Index of closest point
    let currentIndex:number = 0;       // Current index, starting from 0
    let previousIndex:number;          // Tracking previous index for path creation
    let totalDistance:number = 0;      // Increment the total path distance

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
      totalDistance += minDistance               // Increment total distance tracker
      previousIndex = currentIndex;              // Temporarily store last index for path creation
      currentIndex = minDistanceIndex;           // Update next point to go to
      console.log(this.selectedPoints[previousIndex])
      console.log(this.selectedPoints[currentIndex])
      await this.sleep(this.runSpeed);  // Making use of async-await
      // Change previous path colour to grey
      if (this.data.currPaths.length != 0) {
        this.data.setIndividualPathType(this.data.currPaths[this.data.currPaths.length-1], 0)
      }
      // Create the path as yellow
      this.createPath({A:{x:this.selectedPoints[previousIndex].x, y:this.selectedPoints[previousIndex].y},
                       B:{x:this.selectedPoints[currentIndex].x,  y:this.selectedPoints[currentIndex].y}});
      // Listens constantly for the reset button click, and aborts the function if it occurs
      if (this.abort) {
        this.removeAllPaths();  // Repeated removeAllPaths in case of asynchronous call
        return
      };
    }  // End of algorithm iterations
    // Finish off with pathing back to the starting node
    this.createPath({A:{x:this.selectedPoints[currentIndex].x, y:this.selectedPoints[currentIndex].y},
                     B:{x:this.selectedPoints[0].x,  y:this.selectedPoints[0].y}});
    // Find distance from last point to first point and increment. Set the final distance
    totalDistance += this.distanceBetweenPoints(this.selectedPoints[currentIndex], this.selectedPoints[0])
    this.currentPathDistance = Math.round((totalDistance + Number.EPSILON) * 100) / 100;
    this.minPathDistance = this.currentPathDistance;
  }  // End of nearest neighbour algorithm


  // Nearest Insertion
  async nearestInsertion():Promise<void> {
    console.log("Starting Nearest Insertion!")
    // Initialise array of points included/excluded from cycle
    let partOfCycle:boolean[] = [true];
    for (let i=0; i<this.selectedPoints.length-1; i++) {
      partOfCycle.push(false);
    }
    // Calculate distances matrix
    this.calculateDistanceMatrix()
    console.log(this.distanceMatrix);

    // Declare required variables for algorithm
    let minDistanceFromPoint:number;
    let minDistanceFromPointIndex:number;
    let minDistanceAllPoints:number;
    let minDistanceAllPointsIndex:number;

    let extraDistance:number;
    let minExtraDistance:number;
    let minExtraDistancePath:{A:{x:number, y:number}, B:{x:number, y:number}};
    let firstPath:{A:{x:number, y:number}, B:{x:number, y:number}};

    // Start of main algorithm logic, need to draw n-1 paths
    for (let _=0; _<this.selectedPoints.length-1; _++) {
      minDistanceAllPoints = Infinity;  // Reset minimum distance from all points
      // Find minimum distance to unvisited point from a visited point
      for (let i=0; i<this.selectedPoints.length; i++) {
        minDistanceFromPoint = Infinity // Reset minimum distance from current point
        if (partOfCycle[i]) {  // Only check visited nodes
          for (let j=0; j<this.selectedPoints.length; j++) {
            // Listens constantly for the reset button click, and aborts the function if it occurs
            if (this.abort) {
              this.removeAllPaths();  // Repeated removeAllPaths in case of asynchronous call
              return
            };
            if (!partOfCycle[j]) {  // Only compare with unvisited nodes
              if (this.distanceMatrix[i][j] < minDistanceFromPoint) {  // Closer node found
                minDistanceFromPoint = this.distanceMatrix[i][j];      // Update currently closest node
                minDistanceFromPointIndex = j;
              }
            }
          }  // End of comparing all unvisited points with visited points
          if (minDistanceFromPoint < minDistanceAllPoints) {
            minDistanceAllPoints = minDistanceFromPoint;               // Update closest node from a point
            minDistanceAllPointsIndex = minDistanceFromPointIndex;
          }
        }
      }      // End of iterating through all visited points, closest node and index should be found
      partOfCycle[minDistanceAllPointsIndex] = true;  // Set that node to be part of the cycle
      console.log(minDistanceAllPointsIndex);
      // Find insertion that will minimise the addition of distance
      if (this.data.currPaths.length === 0) {  // Base case with the first point
        await this.sleep(this.runSpeed);  // Making use of async-await
        this.createPath({A:{x:this.selectedPoints[0].x, y:this.selectedPoints[0].y},
                         B:{x:this.selectedPoints[minDistanceAllPointsIndex].x,
                            y:this.selectedPoints[minDistanceAllPointsIndex].y}})  // Create the first path
        firstPath = this.data.currPaths[0];  // Store the first path for the end
      }
      else {  // Main case with paths to check and insert
        minExtraDistance = Infinity;
        for (let k=0; k<this.data.currPaths.length; k++) {
          extraDistance = this.distanceBetweenPoints(this.data.currPaths[k].A,
                                                     this.selectedPoints[minDistanceAllPointsIndex]) +
                          this.distanceBetweenPoints(this.data.currPaths[k].B,
                                                     this.selectedPoints[minDistanceAllPointsIndex]) -
                          this.calculatePathLength(this.data.currPaths[k]);
          if (extraDistance < minExtraDistance) {  // Lower cost path insertion found
            minExtraDistance = extraDistance;
            minExtraDistancePath = this.data.currPaths[k];
          }
        }    // End of looping through paths, minimum cost path insertion found
        await this.sleep(this.runSpeed);          // Making use of async-await
        this.removePath(minExtraDistancePath);    // Removing previous path
        if (this.data.currPaths.length === 1) {
          this.data.setIndividualPathType(this.data.currPaths[0], 0)  // Base case with one path
        }
        else if (this.data.currPaths.length > 1) {                    // Normal case with 2 paths
          this.data.setIndividualPathType(this.data.currPaths[this.data.currPaths.length-1], 0);
          this.data.setIndividualPathType(this.data.currPaths[this.data.currPaths.length-2], 0);
        }
        await this.sleep(this.runSpeed);        // Making use of async-await
        this.createPath({A:{x:this.selectedPoints[minDistanceAllPointsIndex].x,
                            y:this.selectedPoints[minDistanceAllPointsIndex].y},
                        B:{x:minExtraDistancePath.A.x, y:minExtraDistancePath.A.y}});  // Inserting 2 paths
        this.createPath({A:{x:this.selectedPoints[minDistanceAllPointsIndex].x,
                            y:this.selectedPoints[minDistanceAllPointsIndex].y},
                        B:{x:minExtraDistancePath.B.x, y:minExtraDistancePath.B.y}});
      }
    }  // End of main algorithm for loop
    await this.sleep(this.runSpeed);        // Making use of async-await
    this.createPath(firstPath);             // Add back the first path to finish off

    // Calculate the total path distance
    let pathsDistance:number = 0;

    for (let i=0; i<this.data.currPaths.length; i++) {
      pathsDistance += this.calculatePathLength(this.data.currPaths[i]);
    }
    this.currentPathDistance = Math.round((pathsDistance + Number.EPSILON) * 100) / 100;
    this.minPathDistance = this.currentPathDistance;
  }  // End of entire nearest insertion algorithm function


  // Furthest Insertion
  async fartherInsertion():Promise<void> {
    console.log("Starting Farthest Insertion!")
    // Initialise array of points included/excluded from cycle
    let partOfCycle:boolean[] = [true];
    for (let i=0; i<this.selectedPoints.length-1; i++) {
      partOfCycle.push(false);
    }
    // Calculate distances matrix
    this.calculateDistanceMatrix()
    console.log(this.distanceMatrix);

    // Declare required variables for algorithm
    let maxDistanceFromPoint:number;
    let maxDistanceFromPointIndex:number;
    let maxDistanceAllPoints:number;
    let maxDistanceAllPointsIndex:number;

    let extraDistance:number;
    let minExtraDistance:number;
    let minExtraDistancePath:{A:{x:number, y:number}, B:{x:number, y:number}};
    let firstPath:{A:{x:number, y:number}, B:{x:number, y:number}};

    // Start of main algorithm logic, need to draw n-1 paths
    for (let _=0; _<this.selectedPoints.length-1; _++) {
      maxDistanceAllPoints = 0;  // Reset maximum distance from all points
      // Find maximum distance to unvisited point from a visited point
      for (let i=0; i<this.selectedPoints.length; i++) {
        maxDistanceFromPoint = 0; // Reset maximum distance from current point
        if (partOfCycle[i]) {     // Only check visited nodes
          for (let j=0; j<this.selectedPoints.length; j++) {
            // Listens constantly for the reset button click, and aborts the function if it occurs
            if (this.abort) {
              this.removeAllPaths();
              return
            };
            if (!partOfCycle[j]) {    // Only compare with unvisited nodes
              if (this.distanceMatrix[i][j] > maxDistanceFromPoint) {  // Farther node found
                maxDistanceFromPoint = this.distanceMatrix[i][j];      // Update currently farthest node
                maxDistanceFromPointIndex = j;
              }
            }
          }  // End of comparing all unvisited points with visited points
          if (maxDistanceFromPoint > maxDistanceAllPoints) {
            maxDistanceAllPoints = maxDistanceFromPoint;               // Update farthest node from a point
            maxDistanceAllPointsIndex = maxDistanceFromPointIndex;
          }
        }
      }      // End of iterating through all visited points, closest node and index should be found
      partOfCycle[maxDistanceAllPointsIndex] = true;  // Set that node to be part of the cycle
      console.log(maxDistanceAllPointsIndex);
      // Find insertion that will minimise the addition of distance
      if (this.data.currPaths.length === 0) {  // Base case with the first point
        await this.sleep(this.runSpeed);  // Making use of async-await
        this.createPath({A:{x:this.selectedPoints[0].x, y:this.selectedPoints[0].y},
                         B:{x:this.selectedPoints[maxDistanceAllPointsIndex].x,
                            y:this.selectedPoints[maxDistanceAllPointsIndex].y}})  // Create the first path
        firstPath = this.data.currPaths[0];  // Store the first path for the end
      }
      else {  // Main case with paths to check and insert
        minExtraDistance = Infinity;
        for (let k=0; k<this.data.currPaths.length; k++) {
          extraDistance = this.distanceBetweenPoints(this.data.currPaths[k].A,
                                                     this.selectedPoints[maxDistanceAllPointsIndex]) +
                          this.distanceBetweenPoints(this.data.currPaths[k].B,
                                                     this.selectedPoints[maxDistanceAllPointsIndex]) -
                          this.calculatePathLength(this.data.currPaths[k]);
          if (extraDistance < minExtraDistance) {  // Lower cost path insertion found
            minExtraDistance = extraDistance;
            minExtraDistancePath = this.data.currPaths[k];
          }
        }    // End of looping through paths, minimum cost path insertion found
        await this.sleep(this.runSpeed);          // Making use of async-await
        this.removePath(minExtraDistancePath);    // Removing previous path
        if (this.data.currPaths.length === 1) {
          this.data.setIndividualPathType(this.data.currPaths[0], 0)  // Base case with one path
        }
        else if (this.data.currPaths.length > 1) {                    // Normal case with 2 paths
          this.data.setIndividualPathType(this.data.currPaths[this.data.currPaths.length-1], 0);
          this.data.setIndividualPathType(this.data.currPaths[this.data.currPaths.length-2], 0);
        }
        await this.sleep(this.runSpeed);        // Making use of async-await
        this.createPath({A:{x:this.selectedPoints[maxDistanceAllPointsIndex].x,
                            y:this.selectedPoints[maxDistanceAllPointsIndex].y},
                        B:{x:minExtraDistancePath.A.x, y:minExtraDistancePath.A.y}});  // Inserting 2 paths
        this.createPath({A:{x:this.selectedPoints[maxDistanceAllPointsIndex].x,
                            y:this.selectedPoints[maxDistanceAllPointsIndex].y},
                        B:{x:minExtraDistancePath.B.x, y:minExtraDistancePath.B.y}});
      }
    }  // End of main algorithm for loop
    await this.sleep(this.runSpeed);        // Making use of async-await
    this.createPath(firstPath);             // Add back the first path to finish off

    // Calculate the total path distance
    let pathsDistance:number = 0;

    for (let i=0; i<this.data.currPaths.length; i++) {
      pathsDistance += this.calculatePathLength(this.data.currPaths[i]);
    }
    this.currentPathDistance = Math.round((pathsDistance + Number.EPSILON) * 100) / 100;
    this.minPathDistance = this.currentPathDistance;
  } // End of entire farthest insertion algorithm function

  // Arbitrary Insertion
  async arbitraryInsertion():Promise<void> {
    console.log("Starting Arbitrary Insertion!")
    // Initialise array of points included/excluded from cycle
    let partOfCycle:boolean[] = [true];
    for (let i=0; i<this.selectedPoints.length-1; i++) {
      partOfCycle.push(false);
    }
    // Calculate distances matrix
    this.calculateDistanceMatrix()
    console.log(this.distanceMatrix);

    // Declare required variables for algorithm
    let minDistanceAllPointsIndex:number;
    let pointIndexToAdd:number;

    let extraDistance:number;
    let minExtraDistance:number;
    let minExtraDistancePath:{A:{x:number, y:number}, B:{x:number, y:number}};
    let firstPath:{A:{x:number, y:number}, B:{x:number, y:number}};

    // Start of main algorithm logic, need to draw n-1 paths
    for (let _=0; _<this.selectedPoints.length-1; _++) {
      // Listens constantly for the reset button click, and aborts the function if it occurs
      if (this.abort) {
        this.removeAllPaths();
        return
      };
      // Find insertion that will minimise the addition of distance
      if (this.data.currPaths.length === 0) {  // Base case with the first point
        let slicedFirstRowOfMatrix:number[] = this.distanceMatrix[0].slice(1, this.distanceMatrix[0].length);
        let minValue:number = Math.min(...slicedFirstRowOfMatrix);
        pointIndexToAdd = slicedFirstRowOfMatrix.indexOf(minValue) + 1;

        await this.sleep(this.runSpeed);  // Making use of async-await
        this.createPath({A:{x:this.selectedPoints[0].x, y:this.selectedPoints[0].y},
                         B:{x:this.selectedPoints[pointIndexToAdd].x,
                            y:this.selectedPoints[pointIndexToAdd].y}})  // Create the first path
        firstPath = this.data.currPaths[0];   // Store the first path for the end
        partOfCycle[pointIndexToAdd] = true;  // Add to visited nodes
      }
      else {  // Main case with paths to check and insert
        // Pick a random point
        pointIndexToAdd = 0;
        while (partOfCycle[pointIndexToAdd] === true) {
          pointIndexToAdd += 1;
        }
        partOfCycle[pointIndexToAdd] = true;  // Add to visited nodes

        // Find path to replace at minimum cost increase
        minExtraDistance = Infinity;
        for (let k=0; k<this.data.currPaths.length; k++) {
          extraDistance = this.distanceBetweenPoints(this.data.currPaths[k].A,
                                                     this.selectedPoints[pointIndexToAdd]) +
                          this.distanceBetweenPoints(this.data.currPaths[k].B,
                                                     this.selectedPoints[pointIndexToAdd]) -
                          this.calculatePathLength(this.data.currPaths[k]);
          if (extraDistance < minExtraDistance) {  // Lower cost path insertion found
            minExtraDistance = extraDistance;
            minExtraDistancePath = this.data.currPaths[k];
          }
        }    // End of looping through paths, minimum cost path insertion found
        await this.sleep(this.runSpeed);          // Making use of async-await
        this.removePath(minExtraDistancePath);    // Removing previous path
        if (this.data.currPaths.length === 1) {
          this.data.setIndividualPathType(this.data.currPaths[0], 0)  // Base case with one path
        }
        else if (this.data.currPaths.length > 1) {                    // Normal case with 2 paths
          this.data.setIndividualPathType(this.data.currPaths[this.data.currPaths.length-1], 0);
          this.data.setIndividualPathType(this.data.currPaths[this.data.currPaths.length-2], 0);
        }
        await this.sleep(this.runSpeed);        // Making use of async-await
        this.createPath({A:{x:this.selectedPoints[pointIndexToAdd].x,
                            y:this.selectedPoints[pointIndexToAdd].y},
                        B:{x:minExtraDistancePath.A.x, y:minExtraDistancePath.A.y}});  // Inserting 2 paths
        this.createPath({A:{x:this.selectedPoints[pointIndexToAdd].x,
                            y:this.selectedPoints[pointIndexToAdd].y},
                        B:{x:minExtraDistancePath.B.x, y:minExtraDistancePath.B.y}});
      }
    }  // End of main algorithm for loop
    await this.sleep(this.runSpeed);        // Making use of async-await
    this.createPath(firstPath);             // Add back the first path to finish off

    // Calculate the total path distance
    let pathsDistance:number = 0;

    for (let i=0; i<this.data.currPaths.length; i++) {
      pathsDistance += this.calculatePathLength(this.data.currPaths[i]);
    }
    this.currentPathDistance = Math.round((pathsDistance + Number.EPSILON) * 100) / 100;
    this.minPathDistance = this.currentPathDistance;
  }

  // Convex Hull
  async convexHull():Promise<void> {
    console.log("Starting Convex Hull!")
  }

  //--------------------------------------------------------------------------------------------------------------------
  // General algorithm helpers

  // Calculates distance bewtween 2 points
  distanceBetweenPoints(pointA:{x:number, y:number}, pointB:{x:number, y:number}):number {
    let distance = Math.sqrt( Math.pow(Math.abs(pointA.x-pointB.x), 2) +
                              Math.pow(Math.abs(pointA.y-pointB.y), 2))
    return distance
  }

  // Calculate the length of a path (using Justin's memey syntax)
  calculatePathLength(inPath:{A:{x: number, y:number}, B: {x: number, y:number}}):number {
    let pathLength = Math.sqrt( Math.pow(Math.abs(inPath.A.x-inPath.B.x), 2) +
                                Math.pow(Math.abs(inPath.A.y-inPath.B.y), 2));
    return pathLength
  }

  // Sleeping function (works only with asynchronous functions)
  sleep(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Shuffle selected points array (calling from the service)
  shuffleSelectedPoints():void {
    this.data.shuffleSelectedPoints()
    // console.log(this.selectedPoints)
  }

  // Calculates the matrix of distances between selected points
  calculateDistanceMatrix():void {
    this.distanceMatrix = [];  // Reset the distance matrix!
    let row:number[];
    let distance:number;
    for (let i=0; i<this.selectedPoints.length; i++) {
      row = [];
      for (let j=0; j<this.selectedPoints.length; j++) {
        if (i===j) {
          row.push(0)
        }
        else {
          distance = this.distanceBetweenPoints(this.selectedPoints[i], this.selectedPoints[j])
          row.push(distance)
        }
      }
      this.distanceMatrix.push(row);
    }
  }

  //--------------------------------------------------------------------------------------------------------------------

  // Reset timer
  resetTimer(): void {
    if (this.timerRunning) {
      this.abort = true;                              // Functions listen to "abort"
    }

    this.verticesButtonsDisabled = false;             // Re-enable vertices buttons
    this.timerRunning = false;                        // Stop the timer
    this.startButtonColor = "success";                // Reset the timer to show "Start"
    this.startButtonDisabled = false;                 // Re-enable the start timer
    this.startText = "Start!";                        // Reset the start timer text
    this.counter = 0;                                 // Timer variables
    this.counterSeconds = 0;
    clearInterval(this.timeRef);

    this.removeAllPaths();                            // Remove all paths

    this.currentPathDistance = 0;                     // Set distances back to 0
    this.minPathDistance = 0;

    this.data.disableAllPoints(false);
  }

  // Opens the dialog
  openDialog():void {
    this.dialog.open(DialogInfoComponent);
  }

  // Opens the snackbar warning of no algorithm selected
  noAlgorithmSelected():void {
    this._snackBar.open("Please select an algorithm!", "Close", {
      duration: 3000
    });
  }

  // Opens a snackbar warning user that not enough nodes were selected
  notEnoughNodesSelected():void {
    this._snackBar.open("You must initialise at least 3 vertices!", "Close", {
      duration: 3000
    });
  }

  // Opens a snackbar informing the user that the algorithm has finished!
  algorithmFinished():void{
    this._snackBar.open("Algorithm finished!", "Close", {
      duration: 3000
    });
  }

}
