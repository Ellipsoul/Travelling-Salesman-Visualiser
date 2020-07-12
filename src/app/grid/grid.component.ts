import { Component, OnInit, AfterContentInit, ComponentFactoryResolver, ViewChild, DoCheck } from '@angular/core';
import { PointrowComponent } from './pointrow/pointrow.component';
import { PointrowDirective } from './pointrow/pointrow.directive';
import { GridcommService } from '../gridcomm.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css'],
})

export class GridComponent implements OnInit, AfterContentInit, DoCheck {
  @ViewChild(PointrowDirective, {static: true}) pointHost: PointrowDirective; //reference to container to host the new components -- see pointrow.directive.ts

  noRows = 21; //number of rows of points
  noCols = 50; //number of columns of points

  constructor(private data: GridcommService, private resolver: ComponentFactoryResolver) {}

  ngOnInit(): void { //on component initialization

    // const offsetHeight = 350;
    // const offsetWidth = 300;

    // this.noRows = (window.innerHeight - offsetHeight)/30;
    // this.noCols = (window.innerWidth - offsetWidth)/30;

    this.makeGrid(this.noRows, this.noCols); //create grid with rows and columns
    // this.data.currentSelPointsMessage.subscribe(message => this.selectedPoints = message); //subscribe to selectedpoints 'message' - accesses the selectedpoints array held in the service; any updates will immediately be pushed to this.selectedPoints
  }

  ngAfterContentInit(): void { //after content is initialized (runs after ngOnInit)
  }

  ngDoCheck() {
  }


  makeGrid(rows: number, cols: number){ //create grid with rows and columns
    const viewContainerRef = this.pointHost.viewContainerRef; //reference to container (replaces <ng-template app-pointrowhost><ng-template>)
    viewContainerRef.clear(); //clear it for good practice

    for(let i = 0; i < rows; i++){
      const newRow = viewContainerRef.createComponent(this.resolver.resolveComponentFactory(PointrowComponent)); //componentFactory resolves a new PointrowComponent; the container creates it within itself

      (<PointrowComponent>newRow.instance).makePoints(cols, i); //reference to the created pointrow component - make its child points
    }
  }
}
