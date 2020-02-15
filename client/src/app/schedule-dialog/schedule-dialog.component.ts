import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../services/api.service';
import { StoreService } from '../services/store.service';
import { PopupOptions } from '../services/popup.service';

@Component({
  selector: 'app-schedule-dialog',
  templateUrl: './schedule-dialog.component.html',
  styleUrls: ['./schedule-dialog.component.scss']
})
export class ScheduleDialogComponent implements OnInit {
  createMode = false;
  editMode = false;

  schedule: any = {};

  constructor(
    public dialogRef: MatDialogRef<ScheduleDialogComponent>,
    private api: ApiService,
    private store: StoreService,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) { }

  ngOnInit() {
    this.schedule = this.dialogData.schedule;

    if (this.schedule && this.schedule._id) {
    } else {
      this.createMode = this.editMode = true;
      this.initDate();
    }
  }

  initDate() {
    const today = new Date();
    const minutes = today.getMinutes();
    if (minutes % 5 !== 0) {
      today.setMinutes(minutes - (minutes % 5));
    }

    this.schedule.title = JSON.parse(JSON.stringify(today));
    this.schedule.end =  today;;
    this.schedule.end.setHours(this.schedule.end.getHours() + 1);
  }

  cancel() {
    this.dialogRef.close({
      type: 'cancel',
    });
  }

  edit() {
    this.editMode = true;
  }

  done() {
    if (this.createMode) {
      this.api.post('schedule', {
        title: this.schedule.title,
        start: this.schedule.start,
        end: this.schedule.end,
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
