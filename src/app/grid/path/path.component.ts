import { Component, OnInit, DoCheck } from '@angular/core';
import { GridcommService } from '../../gridcomm.service';

@Component({
  selector: 'app-path',
  templateUrl: './path.component.html',
  styleUrls: ['./path.component.css'],
})
export class PathComponent implements OnInit, DoCheck {
  pointA: { x: number; y: number };
  pointB: { x: number; y: number };

  allTypeChange: number = 0;
  allTypeChangetick: boolean = false;
  prevAllTypeChangetick: boolean = false;

  type: number = 2; //setting colour: 0 - light grey; 1 - solid black; 2 - yellow?
  pointSpacing: number = 34;

  pathWidth: number = 50; // Div width
  pathHeight: number = 50; // Div height
  pathLeft: number = 30 + 12.5; // Div offset from left
  pathTop: number = 12.5; // Div offset from top
  rotation: number = 0; // Div rotation from top left


  constructor(private data: GridcommService) {}

  ngOnInit(): void {
    this.data.changeIndPathTypeMessage.subscribe(message => {
      if(message.A !== null && message.B !== null){
          if(message.A.x === this.pointA.x && message.A.y === this.pointA.y && message.B.x === this.pointB.x && message.B.y === this.pointB.y){
            this.setType(message.Type);
          }
        }
    });
    // this.allTypeChange = this.data.allPathType;
    // this.prevAllTypeChange = this.data.allPathType;
    this.data.changeAllPathTypeMessage.subscribe(message => {this.allTypeChange = message.Type; this.allTypeChangetick = message.Tick});
    this.prevAllTypeChangetick = this.allTypeChangetick;

  }

  ngDoCheck(): void {
    if(this.prevAllTypeChangetick !== this.allTypeChangetick){
      this.type = this.allTypeChange;
      this.prevAllTypeChangetick = this.allTypeChangetick;
    }
  }

  setType(inType: number): void{
    this.type = inType;
    // console.log(this, "Changed", inType);
  }

  setPath(inPath: {
    A: { x: number; y: number };
    B: { x: number; y: number };
  }): void {
    this.pointA = inPath.A;
    this.pointB = inPath.B;
    var xdiff = this.pointA.x - this.pointB.x;
    var ydiff = this.pointA.y - this.pointB.y;
    var dist = Math.hypot(xdiff,ydiff);

    this.pathWidth = dist * this.pointSpacing;
    this.pathHeight = 10;
    this.pathTop = this.pointSpacing / 2 + inPath.A.y * this.pointSpacing;
    this.pathLeft = this.pointSpacing / 2 + inPath.A.x * this.pointSpacing;
    this.rotation = -Math.atan2(ydiff,-xdiff)*180/Math.PI;
  }
}
