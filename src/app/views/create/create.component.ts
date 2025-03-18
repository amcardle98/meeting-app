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
    standalone: false
})
export class CreateComponent {
  public eventInfo = new FormGroup({
    eventName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    eventCreator: new FormControl('', Validators.required),
    eventStyle: new FormControl('specific'),
    startTime: new FormControl(new Date(), [Validators.required]),
    endTime: new FormControl(new Date(), Validators.required),
  });

  loaded = false;
  selectedDates: Date[] = [];
  // times: Date[] = times.map((time) => new Date(`2021-01-01 ${time}`));
  times: Date[] = [];
  filteredTimes: Date[] = [];
  errors: string[] = [];

  constructor(
    private readonly codeService: CodeService,
    private readonly eventService: EventService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    //wait 2 seconds
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
    this.filteredTimes = this.times.filter(
      (time) => time > this.eventInfo.value.startTime!
    );
    this.eventInfo.value.endTime = this.filteredTimes[0];
  }

  isEventValid(): void {
    if (!this.eventInfo.valid) {
      alert('Please fill out all fields');
    } else {
      this.createLobby(this.eventInfo.value.eventStyle!, this.selectedDates);
      // console.log(this.startTime + ' ' + this.endTime);
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
}
