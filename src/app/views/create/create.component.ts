import { Component } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { MeetService } from 'src/app/services/meet.service';
import { Event } from 'src/app/services/event.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent {
  eventStyle: string = 'specific';
  eventCode!: string;
  eventName!: string;
  loaded = false;
  selectedDates: Date[] = [];
  startTime!: Date;
  endTime!: Date;

  constructor(
    private readonly meetService: MeetService,
    private readonly eventService: EventService,
    private readonly router: Router
  ) {
    this.eventCode = this.meetService.generateEventCode();
  }

  ngOnInit(): void {
    //wait 2 seconds
    setTimeout(() => {
      this.loaded = true;
    }, 200);
  }

  createEvent(): void {
    alert('no backend :(');
  }

  onDatesSelected(dates: Date[]): void {
    this.selectedDates = dates;
  }

  isEventValid(): void {
    // const isValid = Boolean(this.eventName) && this.selectedDates.length > 0;
    let isValid = true;

    //specific event
    // if (this.eventStyle === 'specific') {
    //   if (this.selectedDates.length === 0) {
    //     isValid = false;
    //   }
    // }

    //broadevent
    // if (this.eventStyle === 'broad') {
    //   if (!this.selectedDates.length) {
    //     alert('Please fill out all fields');
    //     return;
    //   }
    // }

    if (!isValid) {
      alert('Please fill out all fields');
    } else {
      this.createLobby(this.eventStyle, this.selectedDates);
      // console.log(this.startTime + ' ' + this.endTime);
    }
  }

  createLobby(eventStyle: string, dates: Date[]): void {
    console.log(
      `Creating lobby for ${this.eventName} event style: ${eventStyle}`
    );
    console.log(
      `Dates selected: ${dates
        .map((date) => date.toLocaleDateString())
        .join(', ')}`
    );

    const newEvent: Partial<Event> = {
      name: this.eventName,
      eventType: eventStyle,
      eventCode: this.eventCode,
      dates,
      eventCreated: new Date(),
    };

    this.eventService.addEvent(newEvent);

    this.router.navigate(['event', this.eventCode]);
    // this.meetService.joinEvent(this.meetService.generateLobbyId());
  }
}
