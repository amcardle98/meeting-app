import { Component } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { MeetService } from 'src/app/services/meet.service';
import { Event } from 'src/app/services/event.service';
import { Router } from '@angular/router';

const times = [
  '12:00 AM',
  '12:30 AM',
  '1:00 AM',
  '1:30 AM',
  '2:00 AM',
  '2:30 AM',
  '3:00 AM',
  '3:30 AM',
  '4:00 AM',
  '4:30 AM',
  '5:00 AM',
  '5:30 AM',
  '6:00 AM',
  '6:30 AM',
  '7:00 AM',
  '7:30 AM',
  '8:00 AM',
  '8:30 AM',
  '9:00 AM',
  '9:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '1:00 PM',
  '1:30 PM',
  '2:00 PM',
  '2:30 PM',
  '3:00 PM',
  '3:30 PM',
  '4:00 PM',
  '4:30 PM',
  '5:00 PM',
  '5:30 PM',
  '6:00 PM',
  '6:30 PM',
  '7:00 PM',
  '7:30 PM',
  '8:00 PM',
  '8:30 PM',
  '9:00 PM',
  '9:30 PM',
  '10:00 PM',
  '10:30 PM',
  '11:00 PM',
  '11:30 PM',
];

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent {
  eventStyle: string = 'specific';
  eventCode!: string;
  eventName!: string;
  eventCreator!: string;
  loaded = false;
  selectedDates: Date[] = [];
  startTime!: Date;
  endTime!: Date;
  times: Date[] = times.map((time) => new Date(`2021-01-01 ${time}`));

  constructor(
    private readonly meetService: MeetService,
    private readonly eventService: EventService,
    private readonly router: Router
  ) {
    this.meetService.generateEventCode().then((eventCode) => {
      this.eventCode = eventCode;
    });
  }

  ngOnInit(): void {
    //wait 2 seconds
    setTimeout(() => {
      this.loaded = true;
    }, 200);
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

  changeEventStyle(eventStyle: string): void {
    this.eventStyle = eventStyle;
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
      participants: [...this.eventCreator],
      lobbyCreator: this.eventCreator,
    };

    this.eventService.addEvent(newEvent);

    this.router.navigate(['event', this.eventCode]);
    // this.meetService.joinEvent(this.meetService.generateLobbyId());
  }
}
