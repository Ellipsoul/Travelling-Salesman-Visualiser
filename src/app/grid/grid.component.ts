import { Component, OnInit, AfterContentInit, ComponentFactoryResolver, ViewChild, DoCheck, ViewContainerRef } from '@angular/core';
import { PointrowComponent } from './pointrow/pointrow.component';
import { PointrowDirective } from './pointrow/pointrow.directive';
import { PathDirective } from './path/path.directive';
import { PathComponent } from './path/path.component';

import { GridcommService } from '../gridcomm.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css'],
})

export class GridComponent implements OnInit, AfterContentInit, DoCheck {
  // Reference to container to host the new components -- see pointrow.directive.ts
  @ViewChild(PointrowDirective, {static: true}) pointHost: PointrowDirective;

  // Reference to container to host the new components -- see path.directive.ts
  @ViewChild(PathDirective, {static: true}) pathHost: PathDirective;

  noRows = Math.floor(window.innerHeight/46);  // Dynamically allocate number of rows of points
  noCols = Math.floor(window.innerWidth/35);   // Dynamically allocate number of columns of points

  pathContainer: ViewContainerRef = null;

  dispPaths: {A:{x: number; y: number}; B: {x: number; y: number}}[] = [];  // All displayed paths

  constructor(private data: GridcommService, private resolver: ComponentFactoryResolver) {}

  ngOnInit(): void {  // On component initialization

    this.makeGrid(this.noRows, this.noCols);  // Create grid with rows and columns

    // Asynchronous update (addition and removal) of path components in pathContainer
    this.data.currentRemovePathsIndexMessage.subscribe(pathIndexToRemove => this.removePath(pathIndexToRemove));
    this.data.currentDispPathsMessage.subscribe(pathToAdd => {if(pathToAdd != null){this.generatePath(pathToAdd)}});
  }

  ngAfterContentInit(): void {  // After content is initialized (runs after ngOnInit)
    this.pathContainer = this.pathHost.viewContainerRef;
    this.clearPaths();
  }

  ngDoCheck(): void {
  }

  makeGrid(rows: number, cols: number): void{  // Create grid with rows and columns
    // Reference to container (replaces <ng-template app-pointrowhost><ng-template>)
    const viewContainerRef = this.pointHost.viewContainerRef;
    viewContainerRef.clear(); //clear it for good practice

    for(let i = 0; i < rows; i++){
      // ComponentFactory resolves a new PointrowComponent; the container creates it within itself
      const newRow = viewContainerRef.createComponent(this.resolver.resolveComponentFactory(PointrowComponent));

      // Reference to the created pointrow component - make its child points
      (<PointrowComponent>newRow.instance).makePoints(cols, i);
    }
  }

  generatePath(inPath: {A:{x: number, y:number}, B: {x: number, y:number}}): void{
    if(this.pathContainer !== null){
      const newPath = this.pathContainer.createComponent(this.resolver.resolveComponentFactory(PathComponent));
      (<PathComponent>newPath.instance).setPath(inPath);
    }
  }

  removePath(index: number):void {
    if (this.pathContainer !== null) {
      if (index !== -1 && this.pathContainer.length > 0) {
        if (index === -2){
          this.clearPaths();
        } else{
          this.pathContainer.remove(index);
        }
      }
    }
  }

  clearPaths(){
    this.pathContainer.clear();
  }
}
