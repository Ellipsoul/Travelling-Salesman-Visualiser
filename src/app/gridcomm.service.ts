import { Injectable } from '@angular/core';
import { BehaviorSubject }  from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GridcommService { //Use of a service enables multiple-way communication between ANY components as opposed to child->parent or parent->child.

  selpoints: {x: number; y:number}[] = []; //holds the base copy of all selected points

  private selPointsMessage = new BehaviorSubject<{x: number; y:number}[]>(this.selpoints); //create the 'message' to be used in the communication service

  currentSelPointsMessage = this.selPointsMessage.asObservable(); //set the 'message' to be observable for use in other components

  constructor( ){

  }

  changeSelPointMessage(message: {x: number; y:number}[]){ //function to completely modify the 'message' - useful for emptying the array
    this.selpoints = message;
    this.selPointsMessage.next(this.selpoints); //sets the 'message' to its new value
    console.log(this.selpoints); //check console :D
  }

  addToSelPointsMessage(message: {x: number; y:number}){ //function to append to the 'message' - useful for adding objects to the array

    if(this.selpoints.findIndex(i => i.x === message.x && i.y === message.y) === -1){
      this.selpoints.push(message); //only add if the object doesn't exist
    }
    this.selPointsMessage.next(this.selpoints); //sets the 'message' to its new value
    console.log(this.selpoints); //check console :D
  }

  removeFromSelPointsMessage(message: {x: number; y:number}){ //function to remove from the 'message' - useful for removing objects from the array
    this.selpoints = this.removeFromArray(this.selpoints, message);
    this.selPointsMessage.next(this.selpoints); //sets the 'message' to its new value
    console.log(this.selpoints); //check console :D
  }

  removeFromArray(array: any[], value: any) { //helper function to remove object from array based on coordinate equality
    var index = array.findIndex(i => i.x === value.x && i.y === value.y);
    if (index !== -1) {
        array.splice(index, 1); //remove one object at the found index
    }
    return array;
  }

}
