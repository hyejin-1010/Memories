import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../services/api.service';
import { StoreService } from '../services/store.service';
import { PopupService } from '../services/popup.service';
import { CommonPopupResultBody } from '../common-popup/common-popup.component';

@Component({
  selector: 'app-schedule-dialog',
  templateUrl: './schedule-dialog.component.html',
  styleUrls: ['./schedule-dialog.component.scss']
})
export class ScheduleDialogComponent implements OnInit {
  createMode = false;
  editMode = false;

  schedule: any = {};
  scheduleOrg: any = {};

  constructor(
    public dialogRef: MatDialogRef<ScheduleDialogComponent>,
    private api: ApiService,
    private store: StoreService,
    private popup: PopupService,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) { }

  ngOnInit() {
    if (this.dialogData && this.dialogData.schedule) {
      this.schedule = JSON.parse(JSON.stringify(this.dialogData.schedule));
    }

    if (this.schedule && this.schedule._id) {
      this.scheduleOrg = JSON.parse(JSON.stringify(this.schedule));
    } else {
      this.createMode = this.editMode = true;
      this.initDate();
    }

    // 편집시 취소 막기
    this.dialogRef.disableClose = true;
    this.dialogRef.backdropClick().subscribe(() => {
      this.closeCheck();
    });
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

  // 편집 도중 dialog 밖에 클릭 시 편집을 중단하고 나갈 것이지 확인
  private closeCheck() {
    if (this.editMode) {
      const popupRef = this.popup.open({
        title: '가이드',
        contents: '편집을 중단하고 현재 페이지를 나가시겠습니까?',
        type: 'confirm'
      });

      popupRef.afterClosed().subscribe((result: CommonPopupResultBody) => {
        if (result.action) {
          if (this.editMode) {
            this.close();
          }
        }
      });
    } else {
      this.close();
    }
  }

  cancel() {
    if (this.editMode && !this.createMode) {
      this.schedule = JSON.parse(JSON.stringify(this.scheduleOrg));
      this.editMode = true;
    } else {
      this.close();
    }
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
    } else if (this.editMode) {
      this.api.put(`schedule/${this.schedule._id}`, {
        title: this.schedule.title,
        start: this.schedule.start,
        end: this.schedule.end
      }).subscribe((resp) => {
        if (!resp.success) { return; }
        this.editMode = false;
      });
    }
  }

  close() {
    this.dialogRef.close({
      type: 'done',
      schedule: this.schedule
    });
  }
}
