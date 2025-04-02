import { Component, inject } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { CodeService } from 'src/app/services/code.service';
import { Event } from 'src/app/services/event.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  standalone: false,
})
export class CreateComponent {
  public eventInfo = new FormGroup({
    eventName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    eventCreator: new FormControl('', Validators.required),
    eventStyle: new FormControl('specific'),
    startTime: new FormControl<string>('09:00'),
    endTime: new FormControl<string>('17:00'),
  });

  loaded = false;
  selectedDates: Date[] = [];
  // times: Date[] = times.map((time) => new Date(`2021-01-01 ${time}`));
  times: Date[] = [];
  filteredTimes: Date[] = [];
  errors: string[] = [];
  selectionType: string = 'specific';
  requireTimeRange: boolean = true;
  currentSelectionMode: string = 'specific';
  currentTimeRangeMode: boolean = false;

  constructor(
    private readonly codeService: CodeService,
    private readonly eventService: EventService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.loaded = true;
    }, 200);

    this.generateTimes();
    this.filteredTimes = this.times;
  }

  onDatesSelected(dates: Date[]): void {
    this.selectedDates = dates;
  }

  generateTimes() {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    for (let i = 0; i < 48; i++) {
      this.times.push(new Date(start.getTime() + i * 30 * 60000)); // 30 minutes interval
    }
    this.filteredTimes = [...this.times]; // Initialize filteredTimes
  }

  timeControl() {
    const startTimeValue = this.eventInfo.get('startTime')?.value;
    if (startTimeValue) {
      this.filteredTimes = this.times.filter(
        (time) => time.toTimeString() > new Date(startTimeValue).toTimeString()
      );
      // Set default end time to first available time after start
      if (this.filteredTimes.length > 0) {
        this.eventInfo.patchValue({
          endTime: this.filteredTimes[0].toISOString(),
        });
      }
    }
  }

  isEventValid(): void {
    if (!this.eventInfo.valid) {
      alert('Please fill out all fields');
    } else {
      this.createLobby(this.eventInfo.value.eventStyle!, this.selectedDates);
    }
  }

  changeEventStyle(eventStyle: string): void {
    this.eventInfo.patchValue({ eventStyle });
  }

  async createLobby(eventStyle: string, dates: Date[]) {
    const eventCode = await this.codeService.generateUniqueEventCode();
    const newEvent: Partial<Event> = {
      name: this.eventInfo.value.eventName!,
      eventType: eventStyle,
      dates,
      eventCode,
      eventCreated: new Date(),
      lobbyCreator: this.eventInfo.value.eventCreator!,
    };

    this.eventService.addEvent(newEvent);

    this.router.navigate(['event', eventCode]);
    // this.meetService.joinEvent(this.meetService.generateLobbyId());
  }

  onSelectionTypeChanged(type: string): void {
    this.selectionType = type;
    this.eventInfo.patchValue({ eventStyle: type });
  }

  onTimeRangeRequiredChanged(required: boolean): void {
    this.requireTimeRange = required;

    // If time range is not required, hide/disable time inputs
    if (!required) {
      // Reset time values when switching to "Anytime"
      this.eventInfo.patchValue({
        startTime: '',
        endTime: '',
      });
    } else {
      // Set default times when switching to "With Time Range"
      this.eventInfo.patchValue({
        startTime: '09:00',
        endTime: '17:00',
      });
    }
  }

  onSelectionModeChange(mode: string): void {
    this.currentSelectionMode = mode;
    this.eventInfo.patchValue({ eventStyle: mode });
  }

  onTimeRangeModeChange(required: boolean): void {
    this.currentTimeRangeMode = required;
    if (!required) {
      // Reset time values when switching to "Anytime"
      this.eventInfo.patchValue({
        startTime: '',
        endTime: '',
      });
    } else {
      // Set default times when switching to "With Time Range"
      this.eventInfo.patchValue({
        startTime: '09:00',
        endTime: '17:00',
      });
    }
  }

  clearDates(): void {
    this.selectedDates = [];
    this.eventInfo.patchValue({
      startTime: '',
      endTime: '',
    });
  }
}
