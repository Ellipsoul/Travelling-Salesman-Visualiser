import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
// import { MatSliderModule } from '@angular/material/slider';
// import { MatButtonToggleModule } from '@angular/material/button-toggle';
// import { MatGridListModule } from '@angular/material/grid-list';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TopbarComponent } from './topbar/topbar.component';
import { GridComponent } from './grid/grid.component'

@NgModule({
  declarations: [
    AppComponent,
    TopbarComponent,
    GridComponent
  ],
  imports: [
    BrowserModule,
    // MatSliderModule,
    // MatButtonToggleModule,
    // MatGridListModule,
    // BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
