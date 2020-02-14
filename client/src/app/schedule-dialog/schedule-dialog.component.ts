import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../services/api.service';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'app-schedule-dialog',
  templateUrl: './schedule-dialog.component.html',
  styleUrls: ['./schedule-dialog.component.scss']
})
export class ScheduleDialogComponent implements OnInit {
  title: string;
  start: Date;
  end: Date;

  createMode = false;
  editMode = false;

  constructor(
    public dialogRef: MatDialogRef<ScheduleDialogComponent>,
    private api: ApiService,
    private store: StoreService,
  ) { }

  ngOnInit() {
    this.createMode = this.editMode = true;
    this.initDate();
  }

  initDate() {
    const today = new Date();
    const minutes = today.getMinutes();
    if (minutes % 5 !== 0) {
      today.setMinutes(minutes - (minutes % 5));
    }

    this.start = JSON.parse(JSON.stringify(today));
    this.end = today;
    this.end.setHours(this.end.getHours() + 1);
  }

  cancel() {
    this.dialogRef.close({
      type: 'cancel',
    });
  }

  done() {
    if (this.createMode) {
      this.api.post('schedule', {
        title: this.title,
        start: this.start,
        end: this.end,
        owner: this.store.me._id,
        galleries: [],
        club: this.store.currentClub._id,
        allDay: false,
      }).subscribe((resp) => {
        console.log('chloe test schedule create resp', resp);
      });
    }
  }

  close() {
    this.dialogRef.close({
      type: 'done',
    });
  }
}
