import { Component, OnInit, AfterContentInit, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { PointrowComponent } from './pointrow/pointrow.component';
import { PointrowDirective } from './pointrow/pointrow.directive';
import { GridcommService } from '../gridcomm.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css'],
})

export class GridComponent implements OnInit, AfterContentInit {
  @ViewChild(PointrowDirective, {static: true}) pointHost: PointrowDirective;

  message: string;

  // public innerWidth: any;
  // public innerHeight: any;

  // constructor(private resolver: ComponentFactoryResolver) { }

  constructor(private data: GridcommService, private resolver: ComponentFactoryResolver) {}

  ngOnInit(): void {
    this.makeRows();

    // this.innerHeight = window.innerHeight;
    // this.innerWidth = window.innerWidth;
    this.data.currentMessage.subscribe(message => this.message = message);
  }

  ngAfterContentInit(): void {
  }

  makeRows(){
    const viewContainerRef = this.pointHost.viewContainerRef;
    viewContainerRef.clear();

    for(let i = 0; i < 20; i++){
      const newRow = viewContainerRef.createComponent(this.resolver.resolveComponentFactory(PointrowComponent));

      (<PointrowComponent>newRow.instance).makePoints(50, i);

    }
  }
}
