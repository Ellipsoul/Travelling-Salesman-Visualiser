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

  noRows = 21; //number of rows of points
  noCols = 50; //number of columns of points

  pathContainer: ViewContainerRef = null;

  prevDispPaths: {A:{x: number; y: number}; B: {x: number; y: number}}[] = []; //all displayed paths
  dispPaths: {A:{x: number; y: number}; B: {x: number; y: number}}[] = []; //all displayed paths

  constructor(private data: GridcommService, private resolver: ComponentFactoryResolver) {}

  ngOnInit(): void { //on component initialization

    // const offsetHeight = 350;
    // const offsetWidth = 300;

    // this.noRows = (window.innerHeight - offsetHeight)/30;
    // this.noCols = (window.innerWidth - offsetWidth)/30;

    this.makeGrid(this.noRows, this.noCols); //create grid with rows and columns
    // this.data.currentSelPointsMessage.subscribe(message => this.selectedPoints = message); //subscribe to selectedpoints 'message' - accesses the selectedpoints array held in the service; any updates will immediately be pushed to this.selectedPoints
    // this.generatePath({x:1,y:1},{x:2,y:2});
    this.data.currentDispPathsMessage.subscribe(message => this.dispPaths = message);
  }

  ngAfterContentInit(): void { //after content is initialized (runs after ngOnInit)
    this.pathContainer = this.pathHost.viewContainerRef;
    this.clearPaths();
    // this.removePath();
  }


  // ========== TESTING ==========
  ngDoCheck(): void {
    if(!this.arraysEqual(this.prevDispPaths, this.dispPaths)) {
      this.prevDispPaths = this.dispPaths.slice(0);
      console.log(this.dispPaths);

      if(this.dispPaths.length == 0){
        this.clearPaths();
      }else{
        this.generatePath(this.dispPaths[this.dispPaths.length-1]);
      }

    }
  }
  // =============================


  makeGrid(rows: number, cols: number): void{ //create grid with rows and columns
    const viewContainerRef = this.pointHost.viewContainerRef; //reference to container (replaces <ng-template app-pointrowhost><ng-template>)
    viewContainerRef.clear(); //clear it for good practice

    for(let i = 0; i < rows; i++){
      const newRow = viewContainerRef.createComponent(this.resolver.resolveComponentFactory(PointrowComponent)); //componentFactory resolves a new PointrowComponent; the container creates it within itself

      (<PointrowComponent>newRow.instance).makePoints(cols, i); //reference to the created pointrow component - make its child points
    }
  }

  generatePath(inPath: {A:{x: number; y:number}; B: {x: number; y:number}}): void{
    const newPath = this.pathContainer.createComponent(this.resolver.resolveComponentFactory(PathComponent));
    (<PathComponent>newPath.instance).setPath(inPath);
  }

  clearPaths(): void{
    this.pathContainer.clear();
  }

  // Array equality checker (can't simply call [] === [] in typescript)
  arraysEqual(a: any[], b: any[]): boolean {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (var i = 0; i < a.length; ++i) {  // Element-wise checking
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
}
