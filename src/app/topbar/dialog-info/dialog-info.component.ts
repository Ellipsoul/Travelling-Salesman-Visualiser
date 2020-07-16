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
    this.dialogRef.updateSize('50%', '80%');
  }

  // Which page to display
  infoPageNumber:number = 0;

  incrementPage():void {
    this.infoPageNumber += 1;
    console.log(this.infoPageNumber)
  }

  decrementPage():void {
    this.infoPageNumber -= 1;
  }

}
