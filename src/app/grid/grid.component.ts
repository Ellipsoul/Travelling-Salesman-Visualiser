import { Component, OnInit, AfterContentInit } from '@angular/core';
import { PointComponent } from '../point/point.component';


@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit, AfterContentInit {

  constructor() {}

  ngOnInit(): void {
    this.loadComponents();
  }

  ngAfterContentInit(): void {
  }

  loadComponents(){

  }

}
