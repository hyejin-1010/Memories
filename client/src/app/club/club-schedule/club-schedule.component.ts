import { Component, OnInit } from '@angular/core';
import { CalendarEvent, CalendarView, CalendarEventTimesChangedEvent } from 'angular-calendar';
import {
  isSameDay,
  isSameMonth,
} from 'date-fns';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ScheduleDialogComponent } from 'src/app/schedule-dialog/schedule-dialog.component';
import { ApiService } from 'src/app/services/api.service';
import { StoreService, ClubModel } from 'src/app/services/store.service';

const primaryColor = {
  primary: '#F78181',
  secondary: '#F78181'
};

@Component({
  selector: 'app-club-schedule',
  templateUrl: './club-schedule.component.html',
  styleUrls: ['./club-schedule.component.scss']
})
export class ClubScheduleComponent implements OnInit {
  currentClub: ClubModel;

  CalendarView = CalendarView;  // html에서도 CalendarView를 사용할 수 있도록

  view: CalendarView = CalendarView.Month;  // calendar view
  viewDate: Date = new Date();              // active date
  activeDayIsOpen = false;                  // active day 일정 view flag

  events: CalendarEvent[] = [];             // event list

  refresh: Subject<any> = new Subject();

  constructor(
    private dialog: MatDialog,
    private api: ApiService,
    private store: StoreService,
  ) { }

  ngOnInit() {
    this.store.currentClub$.subscribe((currentClub) => {
      if (!currentClub || !currentClub._id) { return; }
      this.currentClub = currentClub;
      this.getSchedules();
    });
  }

  // 일정 list를 받아와 event list를 init하는 함수
  private getSchedules() {
    this.api.get(`schedule/${this.currentClub._id}`).subscribe((resp) => {
      if (!resp.success) { return; }
      const schedules = resp.data;
      this.events = schedules.map((schedule) => {
        return this.scheduleToEvent(schedule);
      });
    });
  }

  // calendar에서 일정 클릭 시
  handleEvent(action: string, event: CalendarEvent): void {
    const dialogRef =this.dialog.open(ScheduleDialogComponent, {
      width: '450px',
      minHeight: '450px',
      height: '450px',
      panelClass: ['no-padding-dialog'],
      data: {
        schedule: event
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.type === 'done') {
        const schedule = result.schedule;
        const findIndex = this.events.findIndex((evt: any) => evt._id === schedule._id);
        if (findIndex > -1) {
          this.events[findIndex] = this.scheduleToEvent(schedule);
          this.events = [ ... this.events ];
        }
      }
    });
  }

  // active day의 schedule view close
  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  // 날짜 클릭
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map(iEvent => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  addSchedule() {
    this.dialog.open(ScheduleDialogComponent, {
      width: '450px',
      minHeight: '450px',
      height: '450px',
      panelClass: ['no-padding-dialog'],
    });
  }

  // schedule을 event 형식에 맞춰서 변경해주는 func
  private scheduleToEvent(schedule: any) {
    schedule.color = primaryColor;
    schedule.start = new Date(schedule.start);
    schedule.end = new Date(schedule.end);
    return schedule;
  }
}
