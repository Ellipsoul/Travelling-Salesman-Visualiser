import { Component, OnInit, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { PointComponent } from '../point/point.component';
import { PointDirective } from '../point/point.directive';

@Component({
  selector: 'app-pointrow',
  templateUrl: './pointrow.component.html',
  styleUrls: ['./pointrow.component.css']
})
export class PointrowComponent implements OnInit {
  // Reference to container to host the new components -- see point.directive.ts
  @ViewChild(PointDirective, {static: true}) pointHost: PointDirective;

  constructor(private resolver: ComponentFactoryResolver) { }

  ngOnInit(): void { }

  // Create child points in this row
  makePoints(numPoints: number, rowNumber: number): void{

    // Reference to container (replaces <ng-template app-pointhost><ng-template>)
    const viewContainerRef = this.pointHost.viewContainerRef;
    viewContainerRef.clear();  // Clear it for good practice

    for(let i = 0; i < numPoints; i ++){
      // componentFactory resolves a new PointComponent; the container creates it within itself
      const newPoint = viewContainerRef.createComponent(this.resolver.resolveComponentFactory(PointComponent));

      // Reference to the created point component - set the coordinates in its own class data
      (<PointComponent>newPoint.instance).setCoords(i, rowNumber);
    }
  }

}
