import { Component, OnInit, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { PointComponent } from '../point/point.component';
import { PointDirective } from '../point/point.directive';

@Component({
  selector: 'app-pointrow',
  templateUrl: './pointrow.component.html',
  styleUrls: ['./pointrow.component.css']
})
export class PointrowComponent implements OnInit {
  @ViewChild(PointDirective, {static: true}) pointHost: PointDirective;

  constructor(private resolver: ComponentFactoryResolver) {
  }

  ngOnInit(): void {
  }

  makePoints(numpoints: number, rownumber: number): void{

    const viewContainerRef = this.pointHost.viewContainerRef;
    viewContainerRef.clear();
    for(let i = 0; i < numpoints; i ++){
      const newPoint = viewContainerRef.createComponent(this.resolver.resolveComponentFactory(PointComponent));

      (<PointComponent>newPoint.instance).setCoords(i, rownumber);
    }
  }

}
