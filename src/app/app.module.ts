import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRippleModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TopbarComponent } from './topbar/topbar.component';
import { GridComponent } from './grid/grid.component';
import { PointComponent } from './grid/point/point.component';
import { PointrowComponent } from './grid/pointrow/pointrow.component';
import { PointrowDirective } from './grid/pointrow/pointrow.directive';
import { PointDirective } from './grid/point/point.directive';
import { PathComponent } from './grid/path/path.component';
import { PathDirective } from './grid/path/path.directive';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DialogInfoComponent } from './topbar/dialog-info/dialog-info.component';

@NgModule({
  declarations: [
    AppComponent,
    TopbarComponent,
    GridComponent,
    PointComponent,
    PointrowComponent,
    PointrowDirective,
    PointDirective,
    PathComponent,
    PathDirective,
    DialogInfoComponent
  ],
  entryComponents: [DialogInfoComponent],
  imports: [
    BrowserModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatSelectModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatSliderModule,
    MatButtonModule,
    MatButtonToggleModule,
    BrowserAnimationsModule,
    NgbModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
