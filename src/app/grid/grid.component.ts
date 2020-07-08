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
  @ViewChild(PointrowDirective, {static: true}) pointHost: PointrowDirective;

  selectedPointString: string = '';

  selectedPoints: {x: number, y:number}[] = [];
  prevSelectedPoints: {x: number, y:number}[] = [];

  noRows = 21;
  noCols = 50;

  constructor(private data: GridcommService, private resolver: ComponentFactoryResolver) {}

  ngOnInit(): void {
    // const offsetHeight = 350;
    // const offsetWidth = 300;

    // this.noRows = (window.innerHeight - offsetHeight)/30;
    // this.noCols = (window.innerWidth - offsetWidth)/30;

    this.makeGrid(this.noRows, this.noCols);
    this.data.currentSelPointsMessage.subscribe(message => this.selectedPoints = message);
  }

  ngAfterContentInit(): void {
  }

  ngDoCheck() {
    if(!this.arraysEqual(this.prevSelectedPoints, this.selectedPoints)){
      this.createPointString();
      this.prevSelectedPoints = this.selectedPoints.slice(0);
    }
  }


  makeGrid(rows: number, cols: number){
    const viewContainerRef = this.pointHost.viewContainerRef;
    viewContainerRef.clear();

    for(let i = 0; i < rows; i++){
      const newRow = viewContainerRef.createComponent(this.resolver.resolveComponentFactory(PointrowComponent));

      (<PointrowComponent>newRow.instance).makePoints(cols, i);

    }
  }

  createPointString(){
    var newstring = "";
    this.selectedPoints.forEach(obj1 => newstring += '('  + obj1.x + ',' + obj1.y +'),');
    this.selectedPointString = newstring;
  }

  randomize(no: number){
    for(let num = 0; num < no; num++){
      this.data.addToSelPointsMessage({x: this.getRandomNumberBetweenZ(this.noCols), y: this.getRandomNumberBetweenZ(this.noRows)});
    }
    this.createPointString();
  }

  clearAll(){
    this.data.changeSelPointMessage([]);
    this.createPointString();
  }

  getRandomNumberBetweenZ(max: number){
      return Math.floor(Math.random()*(max));
  }

  arraysEqual(a: any[], b: any[]) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

}
