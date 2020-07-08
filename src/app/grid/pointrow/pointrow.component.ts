import { Component, OnInit, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { PointComponent } from '../point/point.component';
import { PointDirective } from '../point/point.directive';

@Component({
  selector: 'app-pointrow',
  templateUrl: './pointrow.component.html',
  styleUrls: ['./pointrow.component.css']
})
export class PointrowComponent implements OnInit {
  @ViewChild(PointDirective, {static: true}) pointHost: PointDirective; //reference to container to host the new components -- see point.directive.ts

  constructor(private resolver: ComponentFactoryResolver) {
  }

  ngOnInit(): void {
  }

  makePoints(numPoints: number, rowNumber: number): void{ //create child points in this row

    const viewContainerRef = this.pointHost.viewContainerRef; //reference to container (replaces <ng-template app-pointhost><ng-template>)
    viewContainerRef.clear(); //clear it for good practice

    for(let i = 0; i < numPoints; i ++){
      const newPoint = viewContainerRef.createComponent(this.resolver.resolveComponentFactory(PointComponent)); //componentFactory resolves a new PointComponent; the container creates it within itself

      (<PointComponent>newPoint.instance).setCoords(i, rowNumber); //reference to the created point component - set the coordinates in its own class data
    }
  }

}
