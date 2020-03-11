import { Component, OnInit, Inject } from '@angular/core';
import { ScheduleDialogComponent } from '../schedule-dialog/schedule-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-image-viewer-dialog',
  templateUrl: './image-viewer-dialog.component.html',
  styleUrls: ['./image-viewer-dialog.component.scss']
})
export class ImageViewerDialogComponent implements OnInit {
  image: any;

  constructor(
    public dialogRef: MatDialogRef<ScheduleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) { }

  ngOnInit() {
    if (this.dialogData && this.dialogData.image) {
      this.image = this.dialogData.image;
    }
  }

  close() {
    this.dialogRef.close();
  }
}
