import { Component } from '@angular/core';
import { MeetService } from 'src/app/services/meet.service';

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

  constructor(private readonly meetService: MeetService) {
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
    const isValid = true;

    if (!isValid) {
      alert('Please fill out all fields');
    } else {
      this.createLobby(this.eventStyle, this.selectedDates);
    }
  }

  createLobby(eventStyle: string, dates: Date[]): void {
    console.log(`Creating lobby for event style: ${eventStyle}`);
    console.log(
      `Dates selected: ${dates
        .map((date) => date.toLocaleDateString())
        .join(', ')}`
    );
    // this.meetService.joinEvent(this.meetService.generateLobbyId());
  }
}
