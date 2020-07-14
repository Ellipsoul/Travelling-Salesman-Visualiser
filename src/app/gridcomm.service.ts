import { Injectable } from '@angular/core';
import { BehaviorSubject }  from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GridcommService { //Use of a service enables multiple-way communication between ANY components as opposed to child->parent or parent->child.
  //tons of type-setting used here (variablename: type) for error handling

  selPoints: {x: number; y:number}[] = []; //holds the base copy of all selected points

  // ========== TESTING ==========
  firstSelPoint: {x: number; y:number} = null;
  // =============================



  dispPaths: {A:{x: number; y: number}; B: {x: number; y: number}}[] = []; //all displayed paths

  private selPointsMessage = new BehaviorSubject<{x: number; y:number}[]>(this.selPoints); //create the 'message' to be used in the communication service

  currentSelPointsMessage = this.selPointsMessage.asObservable(); //set the 'message' to be observable for use in other components


  private dispPathsMessage = new BehaviorSubject<{A:{x: number; y:number}; B: {x: number; y:number}}[]>(this.dispPaths); //create the 'message' to be used in the communication service

  currentDispPathsMessage = this.dispPathsMessage.asObservable(); //set the 'message' to be observable for use in other components

  constructor( ){

  }

  changeSelPointMessage(newselpoints: {x: number; y:number}[]): void{ //function to completely modify the 'message' - useful for emptying the array
    this.selPoints = newselpoints;
    this.selPointsMessage.next(this.selPoints); //sets the 'message' to its new value
    console.log(this.selPoints); //check console :D

    // ========== TESTING ==========
    if(newselpoints.length == 0){
      this.dispPaths = [];
      this.dispPathsMessage.next(this.dispPaths);
      this.firstSelPoint = null;
    }
    // =============================
  }

  addToSelPointsMessage(inpoint: {x: number; y:number}): boolean{ //function to append to the 'message' - useful for adding objects to the array

    // ========== TESTING ==========
    if(this.firstSelPoint != null){
      this.addToPaths({A:this.firstSelPoint, B:inpoint})
    }
    // =============================



    var successful = false;
    if(this.selPoints.findIndex(i => i.x === inpoint.x && i.y === inpoint.y) === -1){
      this.selPoints.push(inpoint); //only add if the object doesn't exist
      successful = true;
    }
    this.selPointsMessage.next(this.selPoints); //sets the 'message' to its new value
    console.log(this.selPoints); //check console :D

    // ========== TESTING ==========
    this.firstSelPoint = inpoint;
    // =============================




    return successful;
  }

  removeFromSelPointsMessage(inpoint: {x: number; y:number}): void{ //function to remove from the 'message' - useful for removing objects from the array
    this.selPoints = this.removeFromArray(this.selPoints, inpoint);
    this.selPointsMessage.next(this.selPoints); //sets the 'message' to its new value
    console.log(this.selPoints); //check console :D
  }

  addToPaths(inPath: {A:{x: number; y:number}; B: {x: number; y:number}}): void{
    this.dispPaths.push(inPath);
    this.dispPathsMessage.next(this.dispPaths);
  }

  removeFromPaths(inPath: {A:{x: number; y:number}; B: {x: number; y:number}}): void{
    var index = this.dispPaths.findIndex(i => i.A.x === inPath.A.x && i.A.y === inPath.A.y && i.B.x === inPath.B.x && i.B.y === inPath.B.y);
    if(index !== -1){
      this.dispPaths.splice(index, 1);
    }
    this.dispPathsMessage.next(this.dispPaths);
  }


  removeFromArray(array: any[], value: any): any[]{ //helper function to remove object from array based on coordinate equality
    var index = array.findIndex(i => i.x === value.x && i.y === value.y);
    if (index !== -1) {
        array.splice(index, 1); //remove one object at the found index
    }
    return array;
  }

}
