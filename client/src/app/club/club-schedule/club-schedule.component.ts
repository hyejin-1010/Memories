import { Component, OnInit } from '@angular/core';
import { CalendarEvent, CalendarEventAction, CalendarView, CalendarEventTimesChangedEvent } from 'angular-calendar';
import {
  startOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ScheduleDialogComponent } from 'src/app/schedule-dialog/schedule-dialog.component';

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
  CalendarView = CalendarView;  // html에서도 CalendarView를 사용할 수 있도록

  view: CalendarView = CalendarView.Month;  // calendar view
  viewDate: Date = new Date();  // active date
  activeDayIsOpen = false; // active day 일정 view flag

  // events: CalendarEvent[] = []; // event list

  refresh: Subject<any> = new Subject();

  // --- 필요 X
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

  events: CalendarEvent[] = [
    {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'A 3 day event',
      color: primaryColor,
      actions: this.actions,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: true
    },
    {
      start: startOfDay(new Date()),
      title: 'An event with no end date',
      color: primaryColor,
      actions: this.actions
    },
    {
      start: subDays(endOfMonth(new Date()), 3),
      end: addDays(endOfMonth(new Date()), 3),
      title: 'A long event that spans 2 months',
      color: primaryColor,
      allDay: true
    },
    {
      start: addHours(startOfDay(new Date()), 2),
      end: addHours(new Date(), 2),
      title: 'A draggable and resizable event',
      color: primaryColor,
      actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: true
    }
  ];

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit() {

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
