import { Injectable } from '@angular/core';
import { BehaviorSubject }  from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GridcommService { //Use of a service enables multiple-way communication between ANY components as opposed to child->parent or parent->child.
  //tons of type-setting used here (variablename: type) for error handling

  //========================================================
  //========================================================
  selPoints: {x: number; y:number}[] = []; //holds the base copy of all selected points

  private selPointsMessage = new BehaviorSubject<{x: number; y:number}[]>(this.selPoints); //create the 'message' to be used in the communication service

  currentSelPointsMessage = this.selPointsMessage.asObservable(); //set the 'message' to be observable for use in other components

  //========================================================
  //========================================================
  currPaths: {A:{x: number; y: number}; B: {x: number; y: number}}[] = [];

  // private currPathsMessage = new BehaviorSubject<{A:{x: number; y:number}; B: {x: number; y:number}}[]>(this.currPaths); //create the 'message' to be used in the communication service

  // currentPathsMessage = this.currPathsMessage.asObservable(); //set the 'message' to be observable for use in other components

  //========================================================
  //========================================================
  dispPaths: {A:{x: number; y: number}; B: {x: number; y: number}};

  private dispPathsMessage = new BehaviorSubject<{A:{x: number; y:number}; B: {x: number; y:number}}>(this.dispPaths); //create the 'message' to be used in the communication service

  currentDispPathsMessage = this.dispPathsMessage.asObservable(); //set the 'message' to be observable for use in other components

  //========================================================
  //========================================================
  removePathsIndex: number = -1;

  private removePathsIndexMessage = new BehaviorSubject<number>(this.removePathsIndex); //create the 'message' to be used in the communication service

  currentRemovePathsIndexMessage = this.removePathsIndexMessage.asObservable(); //set the 'message' to be observable for use in other components


  constructor( ){

  }

  changeSelPointMessage(newselpoints: {x: number; y:number}[]): void { //function to completely modify the points 'message' - useful for emptying the array
    this.selPoints = newselpoints;
    this.selPointsMessage.next(this.selPoints); //sets the points 'message' to its new value
    // console.log(this.selPoints);
  }

  addToSelPointsMessage(inpoint: {x: number; y:number}): boolean{ //function to append to the points 'message' - useful for adding objects to the array

    var successful = false;
    if(this.selPoints.findIndex(i => i.x === inpoint.x && i.y === inpoint.y) === -1){
      this.selPoints.push(inpoint); //only add if the object doesn't exist
      successful = true;
    }
    this.selPointsMessage.next(this.selPoints); //sets the points 'message' to its new value
    return successful;
  }

  removeFromSelPointsMessage(inpoint: {x: number; y:number}): void { //function to remove from the points 'message' - useful for removing objects from the array
    this.selPoints = this.removeFromArray(this.selPoints, inpoint);
    this.selPointsMessage.next(this.selPoints); //sets the points 'message' to its new value
    // console.log(this.selPoints);
  }

  addToPaths(inPath: {A:{x: number, y:number}, B: {x: number, y:number}}): void {
    this.currPaths.push(inPath);
    this.dispPathsMessage.next(inPath);
    // console.log(this.currPaths);
  }

  removeFromPaths(inPath: {A:{x: number, y:number}, B: {x: number, y:number}}): void {
    var idxPath = this.currPaths.findIndex(i => i.A.x === inPath.A.x && i.A.y === inPath.A.y && i.B.x === inPath.B.x && i.B.y === inPath.B.y); //find the path
    if(idxPath !== -1){ //if the path was found then remove it from the currPaths array
      this.currPaths.splice(idxPath, 1);
    }
    this.removePathsIndexMessage.next(idxPath);
    // console.log(this.currPaths);
  }

  clearAllPaths(): void {
    this.currPaths = [];
    this.removePathsIndexMessage.next(-2);
    // console.log(this.currPaths);
  }


  removeFromArray(array: any[], value: any): any[]{ //helper function to remove object from array based on coordinate equality
    var index = array.findIndex(i => i.x === value.x && i.y === value.y);
    if (index !== -1) {
        array.splice(index, 1); //remove one object at the found index
    }
    return array;
  }

  shuffleSelectedPoints():void {
    this.selPoints.sort(() => Math.random() - 0.5);
    console.log(this.selPoints);
    this.selPointsMessage.next(this.selPoints);
  }

}
