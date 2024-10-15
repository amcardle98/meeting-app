import { Component, input, output } from '@angular/core';
import { MeetService } from 'src/app/services/meet.service';
import { Event } from 'src/app/services/event.service';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent {
  today = new Date();
  selectedDates: Date[] = [];
  selectedMonthDays: number[] = [];
  weekDays = WEEKDAYS;

  datesSelected = output<Date[]>();
  eventStyle = input<string>();

  constructor(private readonly meetService: MeetService) {}

  ngOnInit(): void {
    this.getDays();
  }

  getMonth(): string {
    return this.today.toLocaleString('default', { month: 'long' });
  }

  getYear(): number {
    return this.today.getFullYear();
  }

  selectBroad(day: string) {
    if (this.eventStyle() == 'specific') {
      return;
    }

    const year = this.today.getFullYear();
    const month = this.today.getMonth();
    const validDays = Array.from(
      { length: new Date(year, month + 1, 0).getDate() },
      (_, i) => i + 1
    );

    if (day === 'all') {
      this.selectedDates = validDays.map((d) => new Date(year, month, d));
    } else {
      const datesSelected = validDays
        .filter((d) => WEEKDAYS[new Date(year, month, d).getDay()] === day)
        .map((d) => new Date(year, month, d));

      for (const date of datesSelected) {
        if (!this.selectedDates.some((d) => d.getTime() === date.getTime())) {
          this.selectedDates.push(date);
        } else {
          this.selectedDates = this.selectedDates.filter(
            (d) => d.getTime() !== date.getTime()
          );
        }
      }
    }

    this.datesSelected.emit(this.selectedDates);
  }

  getDays() {
    const offset = new Date(
      this.today.getFullYear(),
      this.today.getMonth(),
      1
    ).getDay();
    const days = new Date(
      this.today.getFullYear(),
      this.today.getMonth() + 1,
      0
    ).getDate();

    const totalDays = Array.from(
      { length: offset + days },
      (_, i) => i - offset + 1
    );

    this.selectedMonthDays = totalDays;
  }

  getFirstDayOfMonth(): string {
    return new Date(
      this.today.getFullYear(),
      this.today.getMonth(),
      1
    ).toLocaleString('default', { weekday: 'long' });
  }

  adjustCalender(action: string) {
    if (action === 'back') {
      this.today.setMonth(this.today.getMonth() - 1);
    } else {
      this.today.setMonth(this.today.getMonth() + 1);
    }

    this.getDays();
  }

  selectDay(date: number): void {
    if (this.eventStyle() == 'broad') {
      return;
    }

    const dateToCheck = new Date(
      this.today.getFullYear(),
      this.today.getMonth(),
      date
    );

    // Check if date is already selected
    const isDateSelected = this.selectedDates.some((d) => d.getDate() === date);

    if (isDateSelected) {
      // Remove the date if already selected
      this.selectedDates = this.selectedDates.filter(
        (d) => d.getDate() !== date
      );
    } else {
      // Add the new date to the selected dates
      this.selectedDates.push(dateToCheck);
    }

    this.datesSelected.emit(this.selectedDates);
  }

  isSelected(day: number): boolean {
    return this.selectedDates.some(
      (date) =>
        date.getDate() === day &&
        date.getMonth() === this.today.getMonth() &&
        date.getFullYear() === this.today.getFullYear()
    );
  }

  handleCalenderClick(day: number): void {
    //function runs when mousedown
    // console.log('mousedown');

    const daySelected = document.getElementById('day-' + day);

    if (daySelected) {
      daySelected.classList.add('multi-selected');
    }
  }
}
