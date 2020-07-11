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

  // selectedPointString: string = ''; //string displayed at bottom of html with selected point coordinates

  // selectedPoints: {x: number, y:number}[] = []; //array of coordinate objects to store only selected points
  // prevSelectedPoints: {x: number, y:number}[] = []; //array with previous selected points for change detection

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

  ngDoCheck() { //runs whenever a change is detected in ANY component in the app (could be mouse changes or any data changes)
    // if(!this.arraysEqual(this.prevSelectedPoints, this.selectedPoints)){ //if there is a change in selected points
    //   this.createPointString(); //update selected points string
    //   this.prevSelectedPoints = this.selectedPoints.slice(0); //update previous selected points; slice makes copy of array - cannot just update with (=)
    // }
  }


  makeGrid(rows: number, cols: number){ //create grid with rows and columns
    const viewContainerRef = this.pointHost.viewContainerRef; //reference to container (replaces <ng-template app-pointrowhost><ng-template>)
    viewContainerRef.clear(); //clear it for good practice

    for(let i = 0; i < rows; i++){
      const newRow = viewContainerRef.createComponent(this.resolver.resolveComponentFactory(PointrowComponent)); //componentFactory resolves a new PointrowComponent; the container creates it within itself

      (<PointrowComponent>newRow.instance).makePoints(cols, i); //reference to the created pointrow component - make its child points
    }
  }

  // createPointString(){ //updates the selected points string
  //   var newstring = "";
  //   this.selectedPoints.forEach(obj1 => newstring += '('  + obj1.x + ',' + obj1.y +'),'); //use of an anonymous function to append coordinate data to string for each array object
  //   this.selectedPointString = newstring;
  // }

  // randomize(no: number){ //auxiliary function (can be called from html) to add a number (no) of random points in the grid - combine with clearAll for generation instead of appending random points
  //   for(let num = 0; num < no; num++){
  //     this.data.addToSelPointsMessage({x: this.getRandomNumberBetweenZ(this.noCols), y: this.getRandomNumberBetweenZ(this.noRows)}); //updates the selectedpoints 'message' with the new random point - see gridcomm.service.ts for more information
  //   }
  //   this.createPointString(); //update selected points string
  // }

  // clearAll(){ //auxiliary function (can be called from html) to clear all selected points
  //   this.data.changeSelPointMessage([]); //empties the selectedpoints 'message' - see gridcomm.service.ts for more information
  //   this.createPointString(); //update selected points string
  // }

  // getRandomNumberBetweenZ(max: number){ //helper function to generate random number
  //     return Math.floor(Math.random()*(max));
  // }

  // arraysEqual(a: any[], b: any[]) { //array equality checker (can't simply call [] === [] in typescript)
  //   if (a === b) return true;
  //   if (a == null || b == null) return false;
  //   if (a.length !== b.length) return false;

  //   for (var i = 0; i < a.length; ++i) { //element-wise checking
  //     if (a[i] !== b[i]) return false;
  //   }
  //   return true;
  // }

}
