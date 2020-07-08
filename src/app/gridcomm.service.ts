import { Injectable } from '@angular/core';
import { BehaviorSubject }  from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GridcommService {
  selpoints: {x: number; y:number}[] = [];

  // private message = new BehaviorSubject<string>("lol");
  private selPointsMessage = new BehaviorSubject<{x: number; y:number}[]>(this.selpoints);

  // currentMessage = this.message.asObservable();
  currentSelPointsMessage = this.selPointsMessage.asObservable();

  constructor( ){

  }

  changeSelPointMessage(message: {x: number; y:number}[]){
    this.selpoints = message;
    this.selPointsMessage.next(this.selpoints);
    console.log(this.selpoints);
  }

  addToSelPointsMessage(message: {x: number; y:number}){
    if(this.selpoints.findIndex(i => i.x === message.x && i.y === message.y) === -1){
      this.selpoints.push(message);
    }
    this.selPointsMessage.next(this.selpoints);
    console.log(this.selpoints);
  }

  removeFromSelPointsMessage(message: {x: number; y:number}){
    this.selpoints = this.removeFromArray(this.selpoints, message);
    this.selPointsMessage.next(this.selpoints);
    console.log(this.selpoints);
  }

  removeFromArray(array: any[], value: any) {
    var index = array.findIndex(i => i.x === value.x && i.y === value.y);
    if (index !== -1) {
        array.splice(index, 1);
    }
    return array;
  }

}
