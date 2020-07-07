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

  selectedPoints: {x: Number, y:Number}[] = [];
  prevSelectedPoints: {x: Number, y:Number}[] = [];

  height = 15;
  width = 50;
  // public innerWidth: any;
  // public innerHeight: any;

  constructor(private data: GridcommService, private resolver: ComponentFactoryResolver) {}

  ngOnInit(): void {
    this.makeRows();

    // this.innerHeight = window.innerHeight;
    // this.innerWidth = window.innerWidth;

    this.data.currentSelPointsMessage.subscribe(message => this.selectedPoints = message);
  }

  ngAfterContentInit(): void {
  }

  ngDoCheck() {
    if(this.prevSelectedPoints !== this.selectedPoints){
      this.createPointString();
      console.log(this.prevSelectedPoints, this.selectedPoints);

      this.prevSelectedPoints = this.selectedPoints.slice(0);
    }
  }


  makeRows(){
    const viewContainerRef = this.pointHost.viewContainerRef;
    viewContainerRef.clear();

    for(let i = 0; i < this.height; i++){
      const newRow = viewContainerRef.createComponent(this.resolver.resolveComponentFactory(PointrowComponent));

      (<PointrowComponent>newRow.instance).makePoints(this.width, i);

    }
  }

  createPointString(){
    var newstring = "";
    this.selectedPoints.forEach(obj1 => newstring += '('  + obj1.x + ',' + obj1.y +'),');
    this.selectedPointString = newstring;
  }

  randomize(no: number){
    for(let num = 0; num < no; num++){
      this.data.addToSelPointsMessage({x: this.getRandomNumberBetweenZ(this.width), y: this.getRandomNumberBetweenZ(this.height)});
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

}
