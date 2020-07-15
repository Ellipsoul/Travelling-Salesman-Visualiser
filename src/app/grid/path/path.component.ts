import { Component, OnInit } from '@angular/core';
import { MinLengthValidator } from '@angular/forms';

@Component({
  selector: 'app-path',
  templateUrl: './path.component.html',
  styleUrls: ['./path.component.css'],
})
export class PathComponent implements OnInit {
  pointA: { x: number; y: number };
  pointB: { x: number; y: number };

  // 0 - vertical; 1 - horizontal, 2 - bot-left to top-right; 3 - top-left to bot-right
  type: number = 0;
  pointSpacing: number = 34;

  pathWidth: number = 50; // Div width
  pathHeight: number = 50; // Div height
  pathLeft: number = 30 + 12.5; // Div offset from left
  pathTop: number = 12.5; // Div offset from top

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
    var xmin = Math.min(this.pointA.x, this.pointB.x);
    var ymin = Math.min(this.pointA.y, this.pointB.y);

    if (xdiff == 0) {
      // Vertical line
      this.type = 0;
      this.pathWidth = 5;
      this.pathHeight = Math.abs(ydiff) * this.pointSpacing;
      this.pathLeft = 27 + this.pointSpacing / 2 + xmin * this.pointSpacing;
      this.pathTop = this.pointSpacing / 2 + ymin * this.pointSpacing;
    } else if (ydiff == 0) {
      // Horizontal line
      this.type = 1;
      this.pathWidth = Math.abs(xdiff) * this.pointSpacing;
      this.pathHeight = 5;
      this.pathLeft = 30 + this.pointSpacing / 2 + xmin * this.pointSpacing;
      this.pathTop = this.pointSpacing / 2 + ymin * this.pointSpacing - 2.7;
    } else if (xdiff / ydiff < 0) {
      // Bot-left to top-right
      this.type = 2;
      this.pathWidth = Math.abs(xdiff) * this.pointSpacing;
      this.pathHeight = Math.abs(ydiff) * this.pointSpacing;
      this.pathLeft = 30 + this.pointSpacing / 2 + xmin * this.pointSpacing;
      this.pathTop = this.pointSpacing / 2 + ymin * this.pointSpacing;
    } else {
      // Top-left to bot-right
      this.type = 3;
      this.pathWidth = Math.abs(xdiff) * this.pointSpacing;
      this.pathHeight = Math.abs(ydiff) * this.pointSpacing;
      this.pathLeft = 30 + this.pointSpacing / 2 + xmin * this.pointSpacing;
      this.pathTop = this.pointSpacing / 2 + ymin * this.pointSpacing;
    }
  }
}
