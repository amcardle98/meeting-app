import { Component } from '@angular/core';
import { MeetService } from 'src/app/services/meet.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent {
  eventCode!: string;
  loaded = false;

  constructor(private readonly meetService: MeetService) {
    this.eventCode = this.meetService.generateEventCody();
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
}
