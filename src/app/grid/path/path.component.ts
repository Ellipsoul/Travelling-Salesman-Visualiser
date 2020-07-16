import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-path',
  templateUrl: './path.component.html',
  styleUrls: ['./path.component.css'],
})
export class PathComponent implements OnInit {
  pointA: { x: number; y: number };
  pointB: { x: number; y: number };

  // 0 - light grey, 1 - dark grey, 2 - coloured?
  type: number = 0; //later on for setting colour
  pointSpacing: number = 34;

  pathWidth: number; // Div width
  pathHeight: number; // Div height
  pathLeft: number; // Div offset from left
  pathTop: number; // Div offset from top
  rotation: number; // Div rotation from top left

  constructor() {}

  ngOnInit(): void {}

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
