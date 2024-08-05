import { Component } from '@angular/core';
import { MeetService } from 'src/app/services/meet.service';
import { isToday } from 'date-fns';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent {
  today = new Date();
  selectedDates: Date[] = [];

  constructor(private readonly meetService: MeetService) {}

  ngOnInit(): void {}

  // getMonths(): string[] {
  //   return [
  //     'January', 'February', 'March', 'April', 'May', 'June',
  //     'July', 'August', 'September', 'October', 'November', 'December'
  //   ];
  // }

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
    //if date is already selected, remove it
    if (this.selectedDates.some((d) => d.getDate() === date)) {
      this.selectedDates = this.selectedDates.filter(
        (d) => d.getDate() !== date
      );
      return;
    }

    this.selectedDates.push(
      new Date(this.today.getFullYear(), this.today.getMonth(), date)
    );

    //set background color for selected date

    console.log(this.selectedDates);
  }

  isSelected(day: number): boolean {
    return this.selectedDates.some(
      (date) =>
        date.getDate() === day &&
        date.getMonth() === this.today.getMonth() &&
        date.getFullYear() === this.today.getFullYear()
    );
  }
}
