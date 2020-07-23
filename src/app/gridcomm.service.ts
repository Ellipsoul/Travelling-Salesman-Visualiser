import { Injectable } from '@angular/core';
import { BehaviorSubject }  from 'rxjs';

@Injectable({
  providedIn: 'root'
})

// Use of a service enables multiple-way communication between ANY components as opposed to child -> parent or parent -> child.
export class GridcommService {
  // Tons of type-setting used here (variablename: type) for error handling
  //========================================================
  selPoints: {x: number; y:number}[] = [];  // Holds the base copy of all selected points

  // Create the 'message' to be used in the communication service
  private selPointsMessage = new BehaviorSubject<{x: number; y:number}[]>(this.selPoints);
  // Set the 'message' to be observable for use in other components
  currentSelPointsMessage = this.selPointsMessage.asObservable();
  //========================================================
  disablePoints: boolean = false;

  // Create the 'message' to be used in the communication service
  private disablePointsMessage = new BehaviorSubject<boolean>(this.disablePoints);

  // Set the 'message' to be observable for use in other components
  currentdisablePointsMessage = this.disablePointsMessage.asObservable();
  //========================================================
  currPaths: {A:{x: number; y: number}; B: {x: number; y: number}}[] = [];
  //========================================================
  dispPaths: {A:{x: number; y: number}; B: {x: number; y: number}} = null;

  private dispPathsMessage = new BehaviorSubject<{A:{x: number; y:number}; B: {x: number; y:number}}>(this.dispPaths); //create the 'message' to be used in the communication service

  currentDispPathsMessage = this.dispPathsMessage.asObservable(); //set the 'message' to be observable for use in other components
  //========================================================
  removePathsIndex: number = -1;

  // Create the 'message' to be used in the communication service
  private removePathsIndexMessage = new BehaviorSubject<number>(this.removePathsIndex);

  // Set the 'message' to be observable for use in other components
  currentRemovePathsIndexMessage = this.removePathsIndexMessage.asObservable();
  //========================================================
  allPathType: {Type:number, Tick:boolean} = {Type:0, Tick:false};

  // Create the 'message' to be used in the communication service
  private allPathTypeMessage = new BehaviorSubject<{Type:number, Tick:boolean}>(this.allPathType);

  // Set the 'message' to be observable for use in other components
  changeAllPathTypeMessage = this.allPathTypeMessage.asObservable();
  //========================================================

  individualPathType: {A:{x: number, y: number}, B: {x: number, y: number}, Type: number} = {A:null,B:null,Type:0};

  //create the 'message' to be used in the communication service
  private indivPathTypeMessage = new BehaviorSubject<{A:{x: number, y: number}, B: {x: number, y: number}, Type: number}>(this.individualPathType);

  // Set the 'message' to be observable for use in other components
  changeIndPathTypeMessage = this.indivPathTypeMessage.asObservable();

  constructor( ){}

  // Function to completely modify the points 'message' - useful for emptying the array
  changeSelPointMessage(newselpoints: {x: number; y:number}[]): void {
    this.selPoints = newselpoints;
    this.selPointsMessage.next(this.selPoints); // Sets the points 'message' to its new value
  }

  // Function to append to the points 'message' - useful for adding objects to the array
  addToSelPointsMessage(inpoint: {x: number; y:number}): boolean{
    var successful = false;
    if(this.selPoints.findIndex(i => i.x === inpoint.x && i.y === inpoint.y) === -1){
      this.selPoints.push(inpoint);  // Only add if the object doesn't exist
      successful = true;
    }
    this.selPointsMessage.next(this.selPoints);  // Sets the points 'message' to its new value
    return successful;
  }

  // Function to remove from the points 'message' - useful for removing objects from the array
  removeFromSelPointsMessage(inpoint: {x: number; y:number}): void {
    this.selPoints = this.removeFromArray(this.selPoints, inpoint);
    this.selPointsMessage.next(this.selPoints);  // Sets the points 'message' to its new value
  }

  disableAllPoints(disable: boolean): void{
    this.disablePoints = disable;
    this.disablePointsMessage.next(this.disablePoints)
  }

  addToPaths(inPath: {A:{x: number, y:number}, B: {x: number, y:number}}): void {
    var idxPath = this.currPaths.findIndex(i => i.A.x === inPath.A.x && i.A.y === inPath.A.y && i.B.x === inPath.B.x && i.B.y === inPath.B.y);  // Find the path
    if(idxPath === -1){     // If the path was not found then add it to the currPaths array and set new message
      this.currPaths.push(inPath);
      this.dispPathsMessage.next(inPath);
    }
  }

  removeFromPaths(inPath: {A:{x: number, y:number}, B: {x: number, y:number}}): void {
    var idxPath = this.currPaths.findIndex(i => i.A.x === inPath.A.x && i.A.y === inPath.A.y && i.B.x === inPath.B.x && i.B.y === inPath.B.y);  // Find the path
    if(idxPath !== -1){     // If the path was found then remove it from the currPaths array
      this.currPaths.splice(idxPath, 1);
    }
    this.removePathsIndexMessage.next(idxPath);
  }

  clearAllPaths(): void {
    this.currPaths = [];
    this.removePathsIndexMessage.next(-2);
  }

  setAllExistingPathsType(type: number):void {
    this.allPathType = {Type:type, Tick:!this.allPathType.Tick};
    this.allPathTypeMessage.next(this.allPathType);
  }

  setIndividualPathType(inpath: {A: {x:number, y:number}, B: {x:number, y:number}}, type: number):void {
    this.individualPathType = {A: inpath.A, B: inpath.B, Type: type};
    this.indivPathTypeMessage.next({A: inpath.A, B: inpath.B, Type: type});
  }

  // Helper function to remove object from array based on coordinate equality
  removeFromArray(array: any[], value: any): any[]{
    var index = array.findIndex(i => i.x === value.x && i.y === value.y);
    if (index !== -1) {
        array.splice(index, 1);  // Remove one object at the found index
    }
    return array;
  }

  shuffleSelectedPoints():void {
    this.selPoints.sort(() => Math.random() - 0.5);
    console.log(this.selPoints);
    this.selPointsMessage.next(this.selPoints);
  }

}
