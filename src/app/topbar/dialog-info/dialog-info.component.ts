import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-info',
  templateUrl: './dialog-info.component.html',
  styleUrls: ['./dialog-info.component.css']
})
export class DialogInfoComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<any>) { }

  ngOnInit():void {
    // Sets the size of the window, tweak this so that it works well with all window sizes
    this.dialogRef.updateSize('60%', '84%');
  }

  // Which page to display
  infoPageNumber:number = 0;

  incrementPage():void {
    this.infoPageNumber += 1;
  }

  decrementPage():void {
    this.infoPageNumber -= 1;
  }

}
