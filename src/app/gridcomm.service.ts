import { Injectable } from '@angular/core';
import { BehaviorSubject }  from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GridcommService {
  private messagesource = new BehaviorSubject<string>("lol");
  currentMessage = this.messagesource.asObservable();

  constructor( ){

  }

  changeMessage(message: string){
    this.messagesource.next(message);
  }

}
