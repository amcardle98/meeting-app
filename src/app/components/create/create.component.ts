import { Component } from '@angular/core';
import { MeetService } from 'src/app/services/meet.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent {
  eventCode!: string;

  constructor(private readonly meetService: MeetService) {
    this.eventCode = this.meetService.generateEventCody();
  }

  createEvent(): void {
    alert('no backend :(');
  }
}
