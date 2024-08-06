import {
  Component,
  EventEmitter,
  input,
  Input,
  output,
  Output,
} from '@angular/core';
import { MeetService } from 'src/app/services/meet.service';
import { isToday } from 'date-fns';
import { HttpContext } from '@angular/common/http';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent {
  today = new Date();
  selectedDates: Date[] = [];
  weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  //TODO: maybe switch this to signals once i discover how to use them
  // @Output() dateSelected = new EventEmitter<Date[]>();

  datesSelected = output<Date[]>();
  eventStyle = input<string>();

  constructor(private readonly meetService: MeetService) {}

  ngOnInit(): void {
    console.log(this.eventStyle);
  }

  getMonth(): string {
    return this.today.toLocaleString('default', { month: 'long' });
  }

  getYear(): number {
    return this.today.getFullYear();
  }

  getDays(): number[] {
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
    return Array.from({ length: offset + days }, (_, i) => i - offset + 1);
  }

  getFirstDayOfMonth(): string {
    return new Date(
      this.today.getFullYear(),
      this.today.getMonth(),
      1
    ).toLocaleString('default', { weekday: 'long' });
  }

  adjustCalender(action: string): string {
    if (action === 'back') {
      this.today.setMonth(this.today.getMonth() - 1);
    } else {
      this.today.setMonth(this.today.getMonth() + 1);
    }
    return this.getMonth();
  }
  selectDay(date: number): void {
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

    // Optionally, set background color for selected date here

    // console.log(this.selectedDates);
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
