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
  @ViewChild(PointrowDirective, {static: true}) pointHost: PointrowDirective; //reference to container to host the new components -- see pointrow.directive.ts

  @ViewChild(PathDirective, {static: true}) pathHost: PathDirective; //reference to container to host the new components -- see path.directive.ts

  noRows = Math.floor(window.innerHeight/46); // Dynamically allocate number of rows of points
  noCols = Math.floor(window.innerWidth/35);  // Dynamically allocate number of columns of points

  pathContainer: ViewContainerRef = null;

  dispPaths: {A:{x: number; y: number}; B: {x: number; y: number}}[] = []; //all displayed paths

  constructor(private data: GridcommService, private resolver: ComponentFactoryResolver) {}

  ngOnInit(): void { //on component initialization

    // const offsetHeight = 350;
    // const offsetWidth = 300;

    // this.noRows = (window.innerHeight - offsetHeight)/30;
    // this.noCols = (window.innerWidth - offsetWidth)/30;

    this.makeGrid(this.noRows, this.noCols); //create grid with rows and columns

    //asynchronous update (addition and removal) of path components in pathContainer
    this.data.currentRemovePathsIndexMessage.subscribe(pathIndexToRemove => this.removePath(pathIndexToRemove));
    this.data.currentDispPathsMessage.subscribe(pathToAdd => this.generatePath(pathToAdd));
  }

  ngAfterContentInit(): void { //after content is initialized (runs after ngOnInit)
    this.pathContainer = this.pathHost.viewContainerRef;
    this.clearPaths();
  }

  ngDoCheck(): void {
  }

  makeGrid(rows: number, cols: number): void{ //create grid with rows and columns
    const viewContainerRef = this.pointHost.viewContainerRef; //reference to container (replaces <ng-template app-pointrowhost><ng-template>)
    viewContainerRef.clear(); //clear it for good practice

    for(let i = 0; i < rows; i++){
      const newRow = viewContainerRef.createComponent(this.resolver.resolveComponentFactory(PointrowComponent)); //componentFactory resolves a new PointrowComponent; the container creates it within itself

      (<PointrowComponent>newRow.instance).makePoints(cols, i); //reference to the created pointrow component - make its child points
    }
  }

  generatePath(inPath: {A:{x: number, y:number}, B: {x: number, y:number}}): void{
    if(this.pathContainer !== null){
      const newPath = this.pathContainer.createComponent(this.resolver.resolveComponentFactory(PathComponent));
      (<PathComponent>newPath.instance).setPath(inPath);
    }
  }

  removePath(index: number): void{
    if(this.pathContainer !== null){
      if(index !== -1 && this.pathContainer.length > 0){
        if(index === -2){
          this.clearPaths();
        }else{
          this.pathContainer.remove(index);
        }
      }
    }
  }

  clearPaths(){
    this.pathContainer.clear();
  }
}
