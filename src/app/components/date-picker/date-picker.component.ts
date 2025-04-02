import {
  Component,
  input,
  output,
  EventEmitter,
  OnInit,
  Output,
  signal,
  WritableSignal,
  inject,
} from '@angular/core';
import { EventService } from 'src/app/services/event.service';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  standalone: false,
})
export class DatePickerComponent implements OnInit {
  private readonly eventService = inject(EventService);

  @Output() datesSelected = new EventEmitter<Date[]>();
  @Output() selectionModeChanged = new EventEmitter<string>();
  @Output() timeRangeModeChanged = new EventEmitter<boolean>();
  @Output() timeRangeRequired = new EventEmitter<boolean>();

  today = new Date();
  selectedDates: Date[] = [];
  selectedMonthDays: number[] = [];
  weekDays = WEEKDAYS;

  // Input signals
  selectionMode = input<string>('specific');
  timeRangeMode = input<boolean>(true);

  // Private writable signals to track internal state
  private _currentSelectionMode: WritableSignal<string> = signal('specific');
  private _currentTimeRangeMode: WritableSignal<boolean> = signal(true);

  // For date range selection
  startDate: Date | null = null;
  endDate: Date | null = null;

  // For day of week selection
  selectedDaysOfWeek: { [key: string]: boolean } = {};

  eventStyle = input<string>();

  calendar: Date[][] = [];
  currentDate = new Date();
  isDragging = false;
  dragStartDate: Date | null = null;

  _timeRangeMode = true;

  // Track selected dates by month for persistence
  private selectedDatesByMonth: { [key: string]: Date[] } = {};

  // Add these properties to your component class
  startTime: string = '09:00'; // Default start time
  endTime: string = '17:00'; // Default end time
  timeOptions: string[] = []; // Will hold all time options

  ngOnInit(): void {
    this.getDays();
    this.generateCalendar();

    // Initialize internal state from inputs
    this._currentSelectionMode.set(this.selectionMode());
    this._currentTimeRangeMode.set(this.timeRangeMode());

    // Initialize month key for current month
    this.getCurrentMonthKey();

    // Add global mouseup listener
    document.addEventListener('mouseup', this.onMouseUp.bind(this));

    // Generate time options in 30-minute intervals
    this.generateTimeOptions();
  }

  getMonth(): string {
    return this.today.toLocaleString('default', { month: 'long' });
  }

  getYear(): number {
    return this.today.getFullYear();
  }

  // Helper method to get current month key (for storage)
  getCurrentMonthKey(): string {
    return `${this.today.getFullYear()}-${this.today.getMonth()}`;
  }

  // Method to change selection mode
  changeSelectionMode(mode: string): void {
    if (mode === 'specific' || mode === 'broad') {
      this._currentSelectionMode.set(mode);
      this.selectionModeChanged.emit(mode);

      if (mode === 'broad') {
        if (!this.startDate) this.startDate = new Date();
        if (!this.endDate) this.endDate = new Date();
        this.selectDateRange();
      }
    }
  }

  // Method to toggle time range requirement
  toggleTimeRange(required: boolean): void {
    this._currentTimeRangeMode.set(required);
    this.timeRangeModeChanged.emit(required);
  }

  // Getter methods to access the current values
  getCurrentSelectionMode(): string {
    return this._currentSelectionMode();
  }

  getCurrentTimeRangeMode(): boolean {
    return this._currentTimeRangeMode();
  }

  // Select all days of a specific weekday in the current month
  selectWeekday(day: string) {
    const year = this.today.getFullYear();
    const month = this.today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day

    // Toggle the weekday selection
    this.selectedDaysOfWeek[day] = !this.selectedDaysOfWeek[day];

    // Update selected dates based on weekday selection
    const monthKey = this.getCurrentMonthKey();

    // Initialize the month array if it doesn't exist
    if (!this.selectedDatesByMonth[monthKey]) {
      this.selectedDatesByMonth[monthKey] = [];
    }

    // Process each day of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      // Skip past dates
      if (date < today) {
        continue;
      }

      const dayOfWeek = WEEKDAYS[date.getDay()];

      // If the weekday matches and is selected
      if (dayOfWeek === day && this.selectedDaysOfWeek[day]) {
        // Only add the date if it's not already in the list
        if (
          !this.dateExistsInArray(date, this.selectedDatesByMonth[monthKey])
        ) {
          this.selectedDatesByMonth[monthKey].push(new Date(date));
        }
      }
      // If the weekday matches but is now deselected
      else if (dayOfWeek === day && !this.selectedDaysOfWeek[day]) {
        // Remove any dates for this weekday
        this.selectedDatesByMonth[monthKey] = this.selectedDatesByMonth[
          monthKey
        ].filter(
          (d) =>
            !(
              d.getDay() === date.getDay() &&
              d.getMonth() === month &&
              d.getFullYear() === year
            )
        );
      }
    }

    // Update the selected dates array to include all dates across all months
    this.updateSelectedDatesFromAllMonths();
  }

  // Helper to check if a date exists in an array
  dateExistsInArray(date: Date, dateArray: Date[]): boolean {
    return dateArray.some(
      (d) =>
        d.getDate() === date.getDate() &&
        d.getMonth() === date.getMonth() &&
        d.getFullYear() === date.getFullYear()
    );
  }

  // Update the selected dates array to include all dates across all months
  updateSelectedDatesFromAllMonths(): void {
    this.selectedDates = [];

    // Combine all dates from all months
    for (const monthKey in this.selectedDatesByMonth) {
      this.selectedDatesByMonth[monthKey].forEach((date) => {
        this.selectedDates.push(new Date(date));
      });
    }

    // Sort dates chronologically
    this.selectedDates.sort((a, b) => a.getTime() - b.getTime());

    // Emit the updated selection
    this.datesSelected.emit([...this.selectedDates]);
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

    // Update weekday highlights for this month
    this.updateWeekdaySelectionForCurrentMonth();
  }

  // Update weekday highlighting based on selected dates in current month
  updateWeekdaySelectionForCurrentMonth(): void {
    const monthKey = this.getCurrentMonthKey();
    const selectedDatesThisMonth = this.selectedDatesByMonth[monthKey] || [];

    // Reset weekday selections
    this.selectedDaysOfWeek = {};

    // Check if all occurrences of each weekday are selected
    const year = this.today.getFullYear();
    const month = this.today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // For each weekday
    for (const weekday of WEEKDAYS) {
      // Count how many occurrences of this weekday exist in the month
      let weekdayOccurrences = 0;
      let weekdaySelected = 0;

      for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i);
        if (WEEKDAYS[date.getDay()] === weekday) {
          weekdayOccurrences++;

          // Check if this date is selected
          if (this.dateExistsInArray(date, selectedDatesThisMonth)) {
            weekdaySelected++;
          }
        }
      }

      // If all occurrences are selected, mark the weekday as selected
      if (weekdayOccurrences > 0 && weekdayOccurrences === weekdaySelected) {
        this.selectedDaysOfWeek[weekday] = true;
      }
    }
  }

  selectDay(date: number): void {
    // Prevent selecting past dates
    if (this.isPastDate(date)) {
      return;
    }

    const dateToCheck = new Date(
      this.today.getFullYear(),
      this.today.getMonth(),
      date
    );

    const monthKey = this.getCurrentMonthKey();

    // Initialize the month array if it doesn't exist
    if (!this.selectedDatesByMonth[monthKey]) {
      this.selectedDatesByMonth[monthKey] = [];
    }

    // Check if date is already selected
    const existingDateIndex = this.selectedDatesByMonth[monthKey].findIndex(
      (d) =>
        d.getDate() === date &&
        d.getMonth() === this.today.getMonth() &&
        d.getFullYear() === this.today.getFullYear()
    );

    if (existingDateIndex !== -1) {
      // Remove the date if already selected
      this.selectedDatesByMonth[monthKey].splice(existingDateIndex, 1);
    } else {
      // Add the new date to the selected dates
      this.selectedDatesByMonth[monthKey].push(new Date(dateToCheck));
    }

    // Update the consolidated selected dates
    this.updateSelectedDatesFromAllMonths();

    // Update weekday highlighting
    this.updateWeekdaySelectionForCurrentMonth();
  }

  isSelected(day: number): boolean {
    const monthKey = this.getCurrentMonthKey();
    const selectedDatesThisMonth = this.selectedDatesByMonth[monthKey] || [];

    return selectedDatesThisMonth.some(
      (date) =>
        date.getDate() === day &&
        date.getMonth() === this.today.getMonth() &&
        date.getFullYear() === this.today.getFullYear()
    );
  }

  isWeekdaySelected(day: string): boolean {
    return !!this.selectedDaysOfWeek[day];
  }

  // For date range selection
  selectDateRange(): void {
    if (!this.startDate || !this.endDate) {
      return;
    }

    this.selectedDates = [];
    const current = new Date(this.startDate);

    while (current <= this.endDate) {
      this.selectedDates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    this.datesSelected.emit(this.selectedDates);
  }

  setStartDate(date: Date): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Prevent setting start date before today
    if (date < today) {
      date = new Date(today);
    }

    this.startDate = date;
    if (this.endDate && this.startDate > this.endDate) {
      this.endDate = new Date(this.startDate);
    }
    this.selectDateRange();
  }

  setEndDate(date: Date): void {
    this.endDate = date;
    if (this.startDate && this.endDate < this.startDate) {
      this.startDate = new Date(this.endDate);
    }
    this.selectDateRange();
  }

  generateCalendar() {
    // Calendar generation code
    this.calendar = [];
    const year = this.today.getFullYear();
    const month = this.today.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let date = 1;
    for (let i = 0; i < 6; i++) {
      const week: Date[] = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          week.push(new Date(year, month, -firstDay + j + 1));
        } else if (date > daysInMonth) {
          week.push(new Date(year, month + 1, date - daysInMonth));
          date++;
        } else {
          week.push(new Date(year, month, date));
          date++;
        }
      }
      this.calendar.push(week);
      if (date > daysInMonth && i < 5) break;
    }
  }

  onMouseDown(date: number): void {
    if (
      this.getCurrentSelectionMode() !== 'specific' ||
      this.isPastDate(date)
    ) {
      return;
    }

    this.isDragging = true;

    const day = new Date(this.today.getFullYear(), this.today.getMonth(), date);
    this.dragStartDate = day;

    // Clear selection if not holding Shift key
    if (!event || !(event as MouseEvent).shiftKey) {
      // When starting a drag, we don't clear the selection
      // We'll wait until the drag completes
    }

    // Don't toggle on mouse down for drag - will handle in mouse up
  }

  onMouseOver(date: number): void {
    if (
      !this.isDragging ||
      !this.dragStartDate ||
      this.getCurrentSelectionMode() !== 'specific'
    ) {
      return;
    }

    const monthKey = this.getCurrentMonthKey();

    // Initialize the month array if it doesn't exist
    if (!this.selectedDatesByMonth[monthKey]) {
      this.selectedDatesByMonth[monthKey] = [];
    }

    // Add all dates between dragStartDate and current date
    const start = new Date(
      this.dragStartDate!.getFullYear(),
      this.dragStartDate!.getMonth(),
      this.dragStartDate!.getDate()
    );
    const end = new Date(this.today.getFullYear(), this.today.getMonth(), date);

    // Determine which date is earlier
    const earlierDate = start < end ? start : end;
    const laterDate = start < end ? end : start;

    // Create a temporary array for visual feedback
    const tempDates = [...this.selectedDatesByMonth[monthKey]];

    // Get today's date for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const current = new Date(earlierDate);
    while (current <= laterDate) {
      if (
        current.getMonth() === this.today.getMonth() &&
        current.getFullYear() === this.today.getFullYear() &&
        current >= today // Only select dates from today onwards
      ) {
        if (!this.dateExistsInArray(current, tempDates)) {
          tempDates.push(new Date(current));
        }
      }
      current.setDate(current.getDate() + 1);
    }

    // Update the display with the temporary selection
    this.selectedDatesByMonth[monthKey] = tempDates;
    this.updateSelectedDatesFromAllMonths();
  }

  onMouseUp(): void {
    if (this.isDragging && this.dragStartDate) {
      // Apply the selection made during dragging
      // This is already done in onMouseOver

      // Update weekday selections
      this.updateWeekdaySelectionForCurrentMonth();
    } else if (!this.isDragging && !this.dragStartDate) {
      // Single click selection (no drag)
      // Already handled in selectDay
    }

    this.isDragging = false;
    this.dragStartDate = null;
  }

  isDateSelected(date: Date): boolean {
    return this.selectedDates.some(
      (d) =>
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
    );
  }

  ngOnDestroy(): void {
    // Clean up any mouse event listeners if needed
    document.removeEventListener('mouseup', this.onMouseUp.bind(this));
  }

  // Handle date input changes
  handleStartDateChange(event: any): void {
    const dateValue = event.target.value;
    if (dateValue) {
      this.setStartDate(new Date(dateValue));
    }
  }

  handleEndDateChange(event: any): void {
    const dateValue = event.target.value;
    if (dateValue) {
      this.setEndDate(new Date(dateValue));
    }
  }

  // Add this method to check if a date is in the past
  isPastDate(date: Date | number): boolean {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Reset time to start of day

    // If a number is passed (day of month), convert to date
    let dateToCheck: Date;
    if (typeof date === 'number') {
      dateToCheck = new Date(
        this.today.getFullYear(),
        this.today.getMonth(),
        date
      );
    } else {
      dateToCheck = new Date(date);
    }

    return dateToCheck < currentDate;
  }

  // Add this new method to remove a specific date from selection
  removeDate(dateToRemove: Date): void {
    // Find which month this date belongs to
    const year = dateToRemove.getFullYear();
    const month = dateToRemove.getMonth();
    const monthKey = `${year}-${month}`;

    // Check if we have dates for this month
    if (this.selectedDatesByMonth[monthKey]) {
      // Filter out the date to remove
      this.selectedDatesByMonth[monthKey] = this.selectedDatesByMonth[
        monthKey
      ].filter(
        (date) =>
          !(
            date.getDate() === dateToRemove.getDate() &&
            date.getMonth() === dateToRemove.getMonth() &&
            date.getFullYear() === dateToRemove.getFullYear()
          )
      );

      // Update the selected dates array
      this.updateSelectedDatesFromAllMonths();

      // Update weekday highlighting if this is the current month
      if (monthKey === this.getCurrentMonthKey()) {
        this.updateWeekdaySelectionForCurrentMonth();
      }
    }
  }

  // Add this new method
  generateTimeOptions(): void {
    const times: string[] = [];
    for (let hours = 0; hours < 24; hours++) {
      for (let minutes of ['00', '30']) {
        const hour = hours.toString().padStart(2, '0');
        times.push(`${hour}:${minutes}`);
      }
    }
    this.timeOptions = times;
  }

  // Add method to handle time changes
  onTimeChange(type: 'start' | 'end', time: string): void {
    if (type === 'start') {
      this.startTime = time;
      // If end time is before start time, update end time
      if (this.endTime < this.startTime) {
        this.endTime = this.startTime;
      }
    } else {
      this.endTime = time;
      // If start time is after end time, update start time
      if (this.startTime > this.endTime) {
        this.startTime = this.endTime;
      }
    }
  }
}
