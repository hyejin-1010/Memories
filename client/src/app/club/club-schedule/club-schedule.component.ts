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
      this.initData();
    });
  }

  private initData() {
    this.api.get(`schedule/${this.currentClub._id}`).subscribe((resp) => {
      if (!resp.success) { return; }
      const schedules = resp.data;
      this.events = schedules.map((schedule) => {
        schedule.color = primaryColor;
        schedule.start = new Date(schedule.start);
        schedule.end = new Date(schedule.end);
        return schedule;
      });
    });
  }

  handleEvent(action: string, event: CalendarEvent): void {
    // this.modalData = { event, action };
    // this.modal.open(this.modalContent, { size: 'lg' });
    console.log('chloe test action event', action, event);
  }

  // calendar view 방식 변경
  setView(view: CalendarView) {
    this.view = view;
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
}
